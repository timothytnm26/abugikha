# NarakThai (น่ารักไทย) - Thai Script Lab

NarakThai is an interactive guide to Thai script. Explore its sounds and history, then build syllables to see how consonants, vowels, and tones work together. The name plays on “น่ารัก” (nâa-rák), Thai for “cute”, because learning a script can be friendly, too. (The repository and packages keep the original `abugikha` name.)

The repository is a Bun + Turborepo monorepo with a web app, a mobile app, and an API that share the same Thai-script engine.

| Workspace | Stack | Hosting |
| --- | --- | --- |
| `apps/web` | Next.js 15 (App Router, static export) · React 19 · Tailwind CSS 4 · GSAP · TanStack Query · Zustand · Feature-Sliced Design | GitHub Pages |
| `apps/mobile` | Expo SDK 57 · Expo Router · Zustand + AsyncStorage (offline-first) · expo-secure-store · expo-speech | EAS Build / Expo Go |
| `apps/api` | Hono · Cloudflare Workers · D1 (SQLite) · Drizzle ORM · zod | Cloudflare Workers |
| `packages/core` | Pure TypeScript: consonants, vowels, tone rules, syllable analysis, lexicon, romanization, palette | — |
| `packages/i18n` | Every user-facing string (UI, analysis explanations, content data) as per-locale JSON, shared by core, web, and mobile | — |
| `packages/contracts` | zod schemas for the API plus a `fetch`-based client used by web, mobile, and tests | — |
| `packages/eslint-config`, `packages/tsconfig` | Shared tooling config | — |

## Getting Started

Requires [Bun](https://bun.sh) 1.3+.

```bash
bun install
bun run dev:web      # http://localhost:3000
bun run dev:api      # http://localhost:8787 (local D1, see below)
bun run dev:mobile   # Expo dev server; open in Expo Go or a simulator
bun run check        # typecheck + lint + test for every workspace
```

Before the first `dev:api`, create the local database once:

```bash
cd apps/api && bun run db:migrate:local
```

For the mobile app, copy `apps/mobile/.env.example` to `apps/mobile/.env` and point `EXPO_PUBLIC_API_URL` at the API. The Android emulator reaches the host as `http://10.0.2.2:8787`; a physical device needs the host machine's LAN IP.

### Dependency Layout

`bunfig.toml` uses Bun's **isolated** linker, so each workspace only sees the dependencies it declares. This lets the web app run React 19.3 while the mobile app uses the React version pinned by Expo. Add mobile dependencies with `bunx expo install <package>` from `apps/mobile` so versions match the SDK.

`expo-doctor` currently reports "duplicate native modules" because Bun gives packages with circular peer dependencies (`expo` ↔ `expo-router`) separate directory names. The JS bundle and native autolinking each resolve a single copy, so the warning can be ignored. Re-check with `bunx expo-modules-autolinking resolve --platform android` after dependency upgrades.

## Deployment

- **Web:** pushing to `main` builds and publishes the static site with `.github/workflows/deploy-pages.yml`. In the repository's **Settings → Pages**, set the source to **GitHub Actions**. Project Pages uses `https://<owner>.github.io/<repository>/`; a `<owner>.github.io` repository uses the domain root.
- **API:** create the database with `bunx wrangler d1 create abugikha`, put its id in `apps/api/wrangler.jsonc`, and add the production web origin to `CORS_ORIGINS`. Then add the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets and set the repository variable `API_DEPLOY_ENABLED=true`. After that, `.github/workflows/deploy-api.yml` applies D1 migrations and deploys on every change to the API or its packages.
- **Mobile:** build and submit with EAS (`bunx eas-cli build`). Set `EXPO_PUBLIC_API_URL` to the deployed Worker URL for production builds.
- **CI:** `.github/workflows/ci.yml` runs `bun run check` on every push and pull request.

## Web Features

Every page is prerendered for each locale under `/vi/...` and `/en/...`, with localized `<html lang>`, titles, canonical URLs, and `hreflang` alternates. The root `/` sends visitors to their saved locale (the `locale` cookie) or to their browser language.

1. **/ipa - Phonetics:** Explore consonants by place and manner of articulation, vowel positions, and the contours of all five tones. IPA transcriptions are accompanied by RTGS romanization.
2. **/history - Script history:** Travel a horizontally scrolling timeline from Brahmi through Pallava, Old Khmer, Sukhothai and Ayutthaya to modern Thai, with grey side branches (Mon, Cham, Lao, Tai Tham, Tai Dam and others) for related scripts.
3. **/aksornthai - Aksorn Thai (อักษรไทย, the Thai script):** Browse the 44 consonants in traditional order, vowel spellings, and all 10 digits. Less common consonants are muted and obsolete ones are struck through. Select a consonant to see its details and open the syllable builder with it.
4. **/lab - Syllable builder:** Combine consonants, vowels, tone marks, and final consonants to explore how Thai syllables are formed.
   - Each of the four composition slots represents a step in the process. Hover over or touch a slot to inspect the syllable and its explanation. For example, step 2 of หน้า is หนา /nǎː/.
   - A formula panel displays tone-rule notation, an explanation, and highlights the rule currently in use.
   - The component picker has three columns: initial consonant | vowel and tone mark | final consonant. Initials are grouped as single, cluster, or leading consonants. Finals are grouped by stop (dead syllable) and sonorant (live syllable) sounds.
   - Less common letters have a muted background while remaining legible. IPA, RTGS, and tone-mark names can be toggled on or off.
   - At 1440×900, the full page fits in one viewport. During drag and drop, the target slot flashes in the dragged component's color. If the composition panel scrolls out of view, a floating builder appears below the navigation and remains a drop target.
5. **Appearance controls:** Toggle IPA and RTGS labels in component pickers, and pick one of seven soft themes, choose the preview paper (4-tier book, ruled, grid, dotted, plain) and customize the color of every syllable part (consonant classes, vowel, final, tone marks). Colors are stored per theme.

## Mobile Features

- **Letters:** the consonant grid colored by class. Open a letter to hear its name, see its keyword and sounds, and mark it as learned.
- **Build:** pick an initial, vowel, final, and tone mark to see the spelling, IPA, tone, and step-by-step rules from the shared engine, then listen with the device's `th-TH` voice.
- **Profile:** display name, language, IPA/RTGS toggle, progress, and sync status.

Progress is stored on the device first and synced when the API is reachable. On first launch the app creates an anonymous account and keeps its session token in the secure store.

## API

All endpoints are versioned under `/v1` and validated with the schemas in `packages/contracts`. Errors always use the shape `{ "error": { "code", "message", "details?" } }`.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/v1/auth/anonymous` | Create an anonymous user and session; returns a bearer token |
| `POST` | `/v1/auth/logout` | Revoke the current session |
| `GET` / `PATCH` / `DELETE` | `/v1/me` | Read, update (`displayName`, `locale`), or delete the account and all its data |
| `GET` / `PUT` | `/v1/me/preferences` | Appearance and learning preferences (stored as validated JSON) |
| `GET` / `PUT` | `/v1/me/progress` | Per-item learning progress; `PUT` accepts up to 200 items, `GET ?since=` returns changes for incremental sync |

Design notes for extending it:

- **Modules:** each feature lives in `src/modules/<name>/` with its own `routes.ts` (HTTP) and `service.ts` (database logic), mounted in `src/app.ts`.
- **Sessions:** tokens are random 256-bit values. Only their SHA-256 hash is stored, so a session can be revoked by deleting its row. Sessions slide forward at most once a day. To add email or OAuth sign-in, create an `auth_identities (user_id, provider, subject)` table that links to the existing anonymous user, so progress is kept.
- **Sync:** progress uses last-write-wins on the client's `updatedAt`, which is clamped to 5 minutes in the future to guard against clock skew, and a server-side `synced_at` for `?since=` queries. Large batches are split to respect D1's 100-parameter limit per statement.
- **Schema changes:** edit `src/db/schema.ts`, run `bun run db:generate`, and commit the SQL in `drizzle/`. New preference fields need a `.default()` in `PreferencesSchema` so older rows stay valid.
- **Tests:** `apps/api/test` runs inside the real Workers runtime (Miniflare) against a migrated local D1.

## Project Structure

```text
apps/
  web/                 Next.js site (Feature-Sliced Design)
    app/[locale]/      Localized routes: metadata + re-export pages from src/pages
    app/(root)/        "/" redirect to the preferred locale
    app/global-not-found.tsx
    pages/             Intentionally empty; prevents Next.js from treating src/pages as Pages Router
    src/
      app/             Locale and Query providers, root shell, global styles
      pages/           Page compositions: home, IPA, history, and builder
      widgets/         Site navigation, hero merge, IPA explorer, history timeline, syllable builder
      features/        Syllable building, locale and theme toggles, appearance customization
      entities/        UI and queries on top of @abugikha/core (adds web colors to class/tone metadata)
      shared/          i18n provider, routing and metadata helpers, utilities, UI
  mobile/              Expo app: src/app (routes), src/lib (API session, sync, theme), src/store
  api/                 Cloudflare Worker: src/modules, src/db, drizzle/ (migrations), test/
packages/
  core/                Thai script data and engine (no React, no DOM); scripts/extract-strokes.py
  i18n/                locales/<locale>/*.json (all translations), fmt() and l10n() helpers
  contracts/           API schemas and client
  eslint-config/       Shared ESLint flat configs (base, react, next)
  tsconfig/            Shared TypeScript base config
```

## Syllable Analysis and Lexicon

The `packages/core/src/syllable/analyze.ts` engine accepts `{ initial, vowel, final, mark }` and returns:

- Correctly ordered Thai spelling in Unicode, including tone marks placed on the final letter of a cluster (for example, ใกล้ and หน้า).
- IPA transcription.
- The tone and whether the syllable is live or dead.
- Step-by-step explanations in the selected language. Each step carries an `accent` palette key (a consonant class or a tone) instead of a CSS color, so every platform can map it to its own colors.

The `@abugikha/core/lexicon` sample dictionary contains around 150 simple and compound words. On the web it is exposed through TanStack Query with the bundled data as `initialData`, so pages render immediately without embedding a second copy in the HTML. Switching to an API only requires changing `queryFn`. A result described as "not a Thai word" means only that it is not present in this dictionary. The irregular readings น้ำ /náːm/ and เงิน /ŋɤn/ are documented separately.

Audio uses the Web Speech API on the web and `expo-speech` on mobile, both with the `th-TH` voice. If a Thai voice is unavailable on the device, the site displays instructions for installing one.

## Localization, Themes, and Romanization

- All translations live in `packages/i18n/locales/<locale>/` as JSON; no user-facing text is written in TypeScript. On the web the locale comes from the URL segment. The `locale` cookie only remembers the choice for the root redirect.

  | File | Contents |
  | --- | --- |
  | `ui.json` | Web and mobile interface (`useT()`) |
  | `analysis.json` | Step-by-step explanations produced by the syllable engine |
  | `consonants.json`, `initials.json`, `vowels.json`, `tones.json` | Class and tone names, letter meanings, notes, approximate sounds |
  | `phonemes.json`, `script-history.json`, `lexicon.json`, `morph.json` | IPA page, script-history timeline (main eras plus side branches), word meanings (keyed by the Thai word), vowel-morph rules |

  Data in `@abugikha/core` keeps only language-neutral fields and builds its `L10n = Record<Locale, string>` values from these files with `l10n(["lexicon", "กา"])`, so UI code still reads `word.meaning[locale]`. Strings with parameters use `{name}` placeholders (optionally `{name|lower}`) and are rendered with `fmt(t.app.learned, { n, total })`.
- `packages/i18n/src/catalog.ts` types every locale against the default one (`vi`), so a missing key fails `typecheck`; `packages/i18n/test` also checks that placeholders match. To add a language: add its code to `LOCALES` in `packages/i18n/src/locale.ts`, copy `locales/vi/` to `locales/<code>/`, translate, and register the files in `catalog.ts`. Any missing string in a non-default locale falls back to `vi` at runtime.
- Themes live in `apps/web/src/shared/config/themes.ts`: four soft light themes (Celadon, Sakura milk, Matcha, Sepia paper) and three soft dark ones (Midnight celadon, Twilight, Cocoa), with names in `ui.settings.themes`. Backgrounds avoid pure white and black to reduce glare. A theme is a set of CSS variables applied to `<html>` (plus `data-theme` for the mode); the default follows `prefers-color-scheme`. Class, vowel, final and tone colors are CSS variables, so SVGs and inline styles follow the theme, and each can be overridden per theme. The default light/dark palette still lives in `@abugikha/core` (`DEFAULT_PALETTE`, `SURFACE_COLORS`) for the mobile app.
- RTGS romanization (Royal Thai General System, Thailand's official romanization system) is generated from IPA by `packages/core/src/romanize.ts`. It omits tones and vowel length. Final ย becomes `-i`, final ว becomes `-o`, and both จ and ช are romanized as `ch`. Examples: หน้า → `na`, ควาย → `khwai`, แม่น้ำ → `maenam`.
- Appearance preferences (theme, paper style, custom colors, phonetic and auto-speak toggles) are stored in localStorage under `narakthai-prefs` using Zustand persist. A small script in `<head>` applies them before the page is painted to prevent a color flash.
- The preview notebooks use the `.note-paper` class in `globals.css`; the paper style is read from `data-paper` on `<html>` (`tiers` draws the 4-tier guide lines, the other styles replace them with a ruled, grid or dotted background).
- The history page (`widgets/script-timeline`) pins a full-width stage and scrolls it horizontally with GSAP ScrollTrigger from Brahmi to modern Thai; below 1024×720 or with `prefers-reduced-motion` it becomes a normal swipeable strip. The landing page explains syllable building with a plain vertical section (`widgets/syllable-intro`) under a full-screen hero. On touch (`pointer: coarse`) screens drag-and-drop is disabled so tiles do not block scrolling; tapping picks a piece.

## Stroke Data

`packages/core/src/writing/strokes.json` contains centerline paths generated from the **Noto Sans Thai Looped** font by `packages/core/scripts/extract-strokes.py`. It is exported from the separate `@abugikha/core/writing/glyphs` entry point so the ~60 KB file is only bundled where it is imported. These paths are approximations, not verified handwriting stroke sequences, so the abugida page currently shows static glyphs instead of animating them. The writing animation can return when reliable stroke-order references are available.
