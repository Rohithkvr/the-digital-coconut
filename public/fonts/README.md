# Brand fonts

Drop the licensed web fonts here, named exactly:

```
Grift-Medium.woff2
Grift-Semibold.woff2
Grift-Bold.woff2
XenonNue-Regular.woff2
XenonNue-Medium.woff2
XenonNue-Semibold.woff2
```

They are picked up automatically by `src/styles/brand-fonts.css` — no code
change needed. Restart the dev server after adding them.

Where to buy:

- **Grift** — Ridha / 38.lineart — https://www.myfonts.com/collections/grift-font-38-lineart/
- **Xenon Nue** — Alwin Johnson / Webhance — https://www.myfonts.com/collections/xenon-nue-font-webhance

Buy the **webfont** licence (a desktop licence does not cover website use),
then convert the .otf/.ttf to .woff2 if the vendor does not supply it.

Until these exist the site falls back to Outfit (for Grift) and Plus Jakarta
Sans (for Xenon Nue) — the closest free matches.
