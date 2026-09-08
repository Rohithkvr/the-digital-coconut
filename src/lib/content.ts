/** Content authored as `[[ ... ]]` is an unfilled slot, not real copy. */
export function isPlaceholder(text: string): boolean {
  return /^\s*\[\[.*\]\]\s*$/.test(text);
}
