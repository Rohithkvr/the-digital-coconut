"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/layout/icons";
import { contact, problems } from "@/content/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

type Msg = {
  id: number;
  from: "client" | "tdc";
  /** Index into `problems`, or -1 for the closing invitation. */
  problem: number;
  typing: boolean;
};

/*
 * Playback timing, in ms from the start of one exchange: the client types
 * and sends, then we type and reply. The reply takes longer to "type" than
 * the question, the way a considered answer does.
 */
const CLIENT_TYPES = 650;
const GAP = 380;
const TDC_TYPES = 1100;
const AFTER = 650;
const EXCHANGE_MS = CLIENT_TYPES + GAP + TDC_TYPES + AFTER;

/** Only the latest messages are kept; older ones have faded out the top anyway. */
const KEEP = 14;

/** The whole thread, finished — what reduced motion shows. */
const FULL_THREAD: Msg[] = [
  ...problems.flatMap((_, i) => [
    { id: -2 * i - 2, from: "client" as const, problem: i, typing: false },
    { id: -2 * i - 3, from: "tdc" as const, problem: i, typing: false },
  ]),
  { id: -100, from: "tdc", problem: -1, typing: false },
];

/**
 * "Problems we fix", as the conversation it really is.
 *
 * A chat thread plays itself once it scrolls into view: a client types and
 * sends the thing they've said out loud, we type and reply with what's
 * usually behind it — all five in turn, older messages sliding up and
 * fading out the top like a live thread — and it closes on an invitation to
 * the contact form. The five complaints also sit as quick replies; tapping
 * one plays that exchange straight away.
 *
 * Accessibility: the animated thread is decoration (aria-hidden). The real
 * content is a plain list for assistive tech, and a chip tap announces its
 * answer through a polite live region — user-initiated, so never chatty.
 * Under reduced motion the finished thread is shown and nothing types.
 */
export function Problems() {
  const reduceMotion = useReducedMotion();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chatRef, { amount: 0.45 });
  const timers = useRef<number[]>([]);
  const nextId = useRef(1);
  const started = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const push = (m: Omit<Msg, "id">) => {
    const id = nextId.current++;
    setMsgs((list) => [...list, { ...m, id }].slice(-KEEP));
    return id;
  };
  const settle = (id: number) =>
    setMsgs((list) => list.map((m) => (m.id === id ? { ...m, typing: false } : m)));

  /** Schedule one exchange starting `offset` ms from now. */
  const scheduleExchange = (i: number, offset: number) => {
    let clientId = 0;
    let tdcId = 0;
    at(offset, () => {
      setActive(i);
      clientId = push({ from: "client", problem: i, typing: true });
    });
    at(offset + CLIENT_TYPES, () => settle(clientId));
    at(offset + CLIENT_TYPES + GAP, () => {
      tdcId = push({ from: "tdc", problem: i, typing: true });
    });
    at(offset + CLIENT_TYPES + GAP + TDC_TYPES, () => settle(tdcId));
  };

  // Play the whole thread once, the first time the chat is properly on screen.
  useEffect(() => {
    if (!inView || started.current || reduceMotion) return;
    started.current = true;
    problems.forEach((_, i) => scheduleExchange(i, 300 + i * EXCHANGE_MS));
    const end = 300 + problems.length * EXCHANGE_MS;
    at(end, () => {
      setActive(null);
      const id = push({ from: "tdc", problem: -1, typing: true });
      at(900, () => settle(id));
    });
    // Timers are cleared on unmount below; not on re-run, so a scroll away
    // mid-thread doesn't cut the conversation off.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion]);

  useEffect(() => clearTimers, []);

  const pick = (i: number) => {
    clearTimers();
    started.current = true;
    setAnnounce(`“${problems[i].quote}” — ${problems[i].body}`);
    if (reduceMotion) {
      setActive(i);
      setMsgs((list) =>
        [
          ...(list.length ? list : FULL_THREAD),
          { id: nextId.current++, from: "client" as const, problem: i, typing: false },
          { id: nextId.current++, from: "tdc" as const, problem: i, typing: false },
        ].slice(-KEEP),
      );
      return;
    }
    // Settle anything left mid-typing, then play the chosen exchange now.
    setMsgs((list) => list.map((m) => ({ ...m, typing: false })));
    scheduleExchange(i, 0);
  };

  const thread = reduceMotion && msgs.length === 0 ? FULL_THREAD : msgs;

  return (
    <Section id="problems">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Problems we fix"
            title="If you've said one of these out loud, we've already seen it"
            lede="What we usually hear first — and what's usually behind it."
          />
        </div>

        {/* ── The chat ───────────────────────────────────────────── */}
        <div className="lg:col-span-7 lg:row-span-2">
          <Reveal>
            <div
              ref={chatRef}
              className="relative flex h-[30rem] flex-col overflow-hidden rounded-3xl border border-line bg-surface-glass shadow-[var(--shadow-card)] sm:h-[34rem]"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/5 px-5 py-3.5">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-[#0B1410]">
                  <Image src="/brand/mark.png" alt="" width={22} height={22} className="h-5.5 w-5.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-fg">The Digital Coconut</span>
                  <span className="block truncate font-mono text-[10px] tracking-[0.12em] text-fg-subtle uppercase">
                    Kochi, Kerala
                  </span>
                </span>
                <span aria-hidden="true" className="flex gap-1">
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                </span>
              </div>

              {/* Thread — anchored to the bottom, older messages fading out the top */}
              <div
                aria-hidden="true"
                className="relative flex flex-1 flex-col justify-end gap-2.5 overflow-hidden px-4 pt-10 pb-5 [mask-image:linear-gradient(to_bottom,transparent,#000_22%)] sm:px-5"
              >
                <AnimatePresence initial={false}>
                  {thread.map((m) => (
                    <Bubble key={m.id} msg={m} reduceMotion={reduceMotion} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Quick replies ─────────────────────────────────────── */}
        <div className="lg:col-span-5 lg:row-start-2">
          <Reveal delay={0.1}>
            <p className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase">
              Tap the one you&apos;ve said
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
              {problems.map((p, i) => (
                <li key={p.quote}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-label={`Show our answer to: ${p.quote}`}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-left text-sm transition-[border-color,background-color,color] duration-300 ease-expo",
                      active === i
                        ? "border-accent-mint/60 bg-accent-mint/12 text-fg"
                        : "border-line bg-white/[0.03] text-fg-muted hover:border-line-hover hover:bg-white/[0.06] hover:text-fg",
                    )}
                  >
                    <span className="text-accent-mint/80">“</span>
                    {p.quote}
                    <ArrowIcon className="h-3.5 w-3.5 shrink-0 opacity-50 transition-[transform,opacity] duration-300 ease-expo group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* The real content, for assistive tech and crawlers */}
      <ul className="sr-only">
        {problems.map((p) => (
          <li key={p.quote}>
            “{p.quote}” {p.body}
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </Section>
  );
}

function Bubble({ msg, reduceMotion }: { msg: Msg; reduceMotion: boolean }) {
  const mine = msg.from === "tdc";
  const problem = msg.problem >= 0 ? problems[msg.problem] : null;

  return (
    <motion.div
      layout={reduceMotion ? false : "position"}
      className={cn("flex", mine ? "justify-end" : "justify-start")}
      initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.div
        layout={reduceMotion ? false : true}
        transition={{ duration: 0.35, ease: EASE }}
        className={cn(
          "relative max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug sm:text-[15px]",
          mine
            ? "rounded-br-md bg-gradient-to-br from-accent to-accent-deep text-white shadow-[0_6px_20px_rgba(30,91,58,0.35)]"
            : "rounded-bl-md border border-line bg-white/[0.06] text-fg",
        )}
      >
        {msg.typing ? (
          <TypingDots light={mine} />
        ) : problem ? (
          <motion.span
            className="block"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            {mine ? <WithTicks text={problem.body} /> : problem.quote}
          </motion.span>
        ) : (
          <motion.span
            className="block"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            Sound familiar? Let&apos;s look at yours.
            <a
              href="#contact"
              className="mt-2.5 flex items-center justify-between gap-3 rounded-xl bg-white/15 px-3 py-2 font-medium text-white transition-colors duration-200 hover:bg-white/25"
            >
              {contact.headline.replace(/\.$/, "")}
              <ArrowIcon className="h-4 w-4" />
            </a>
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

function TypingDots({ light }: { light: boolean }) {
  return (
    <span className="flex h-5 items-center gap-1 px-1">
      {[0, 1, 2].map((k) => (
        <motion.span
          key={k}
          className={cn("h-1.5 w-1.5 rounded-full", light ? "bg-white/80" : "bg-fg-muted")}
          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: k * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/**
 * Our reply with its read ticks glued to the last word — otherwise a line
 * that just fits wraps the ticks onto a line of their own.
 */
function WithTicks({ text }: { text: string }) {
  const cut = text.lastIndexOf(" ");
  return (
    <>
      {cut === -1 ? "" : text.slice(0, cut + 1)}
      <span className="whitespace-nowrap">
        {cut === -1 ? text : text.slice(cut + 1)}
        <ReadTicks />
      </span>
    </>
  );
}

function ReadTicks() {
  return (
    <svg
      viewBox="0 0 24 16"
      className="ml-1.5 inline-block h-2.5 w-4 -translate-y-px text-[#A8E6BF]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 8.5l4 4L13 3.5" />
      <path d="M9 12.5L17 3.5" />
    </svg>
  );
}
