# Kanso Living — Real Estate Landing Page Template

Swiss-bento landing page for property developers. Static site (HTML + Tailwind CDN), no build step. **All client data lives in `config.js`.**

```
index.html   semantic skeleton + Tailwind tokens (no client data)
config.js    CLIENT_CONFIG: brand, theme, copy, units, banks, WhatsApp
app.js       rendering, mobile menu, filters, modal, KPR calculator, WhatsApp links
```

## Customize for a new client (≈5 minutes)

1. **Brand & SEO** — edit `brand.name`, `brand.logoIcon` (any [Material Symbol](https://fonts.google.com/icons)), `meta.title`, `meta.description`.
2. **Colors** — in `theme`, change `primary` / `secondary` / `accent` / `dark` hex codes (3 ready presets are in the comment above `CLIENT_CONFIG`). Tints and all Tailwind tokens follow automatically. Check text contrast via `onPrimary`, `onSecondary`, `onAccent`.
3. **WhatsApp** — set `whatsapp.phone` (digits only, e.g. `62812xxxxxxx`) and tweak `whatsapp.messages`. Placeholders: `{brand} {unit} {price} {dp} {dpAmount} {tenor} {rate} {monthly}`.
4. **Properties** — edit `properties.items`. Each unit needs `id`, `category` (must exist in `properties.categories`), `price` (number, Rupiah), `lt`, `lb`, `kt`, `km`, `carport`, `certificate` (SHM/HGB), `promo`, `description`, `images[]`, `floorplan`. Add/remove objects freely; cards, filters, modal and the KPR unit dropdown update automatically.
5. **Images** — all in `IMAGES` at the top of `config.js`. Images are local in `./assets/`; overwrite the files or change the paths.
6. **Copy** — `hero`, `pillars`, `facilities`, `kpr` (banks, DP options, tenor 5–25, default rate), `testimonials`, `consultation`, `footer`, `ui`.
7. **Language** — translate the strings and set `locale: 'en-US'`, `currency.prefix: '$'`, `meta.lang: 'en'`.

## Run

Open `index.html` in a browser, or serve locally: `python3 -m http.server 8000`. Deploy to any static host (Netlify, Vercel, Cloudflare Pages, S3).

## Notes

- Tone names (`primary | secondary | accent | dark | surface`) in config map to theme colors.
- Tailwind CDN is fine for demos; for production compile with the Tailwind CLI using the token block in `index.html`.
- Modal and mobile menu are keyboard accessible (Esc closes, focus is trapped/restored, `aria-expanded`/`aria-modal` set).
- KPR uses the standard annuity formula; results are estimates only.

## Deploy to Vercel (static, no build step)

1. Push the folder to Git (or run `vercel` in it). Framework preset: **Other**; leave Build Command and Output Directory empty.
2. `vercel.json` sets clean URLs, security headers and 1-year immutable caching for `/assets/*`. Unknown paths serve `404.html` automatically.
3. After you know the production domain, replace `https://kanso-living.vercel.app` in the `og:url`, `og:image` and `twitter:image` tags in `index.html` (share previews require absolute URLs). The preview image is `assets/og-image.jpg` (1200×630).
4. If you overwrite an asset, give it a new filename (assets are cached as immutable).
