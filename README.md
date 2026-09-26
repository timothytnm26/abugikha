# Abugikha (อะบูกิค่ะ) - Thai Script Lab

Abugikha is an interactive guide to Thai script. Explore its sounds and history, then build syllables to see how consonants, vowels, and tones work together. Its name is a playful nod to both “abugida” and the Thai greeting “sawasdee kha” (สวัสดีค่ะ).

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · GSAP (Draggable, useGSAP) · TanStack Query · Zustand · Feature-Sliced Design

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy to GitHub Pages

Push to `main` to build and publish the static site with `.github/workflows/deploy-pages.yml`. In the repository's **Settings → Pages**, set the source to **GitHub Actions**. Project Pages uses `https://<owner>.github.io/<repository>/`; a `<owner>.github.io` repository uses the domain root.

## Web Features

1. **/ipa - Phonetics:** Explore consonants by place and manner of articulation, vowel positions, and the contours of all five tones. IPA transcriptions are accompanied by RTGS romanization.
2. **/history - Script history:** Follow the script's lineage from Brahmi through Pallava, Old Khmer and Mon, and Sukhothai to modern Thai.
3. **/abugida - Thai abugida:** Browse the 44 consonants in traditional order, vowel spellings, and all 10 digits. Less common consonants are muted and obsolete ones are struck through. Select a consonant to see its details and open the syllable builder with it.
4. **/lab - Syllable builder:** Combine consonants, vowels, tone marks, and final consonants to explore how Thai syllables are formed.
   - Each of the four composition slots represents a step in the process. Hover over or touch a slot to inspect the syllable and its explanation. For example, step 2 of หน้า is หนา /nǎː/.
   - A formula panel displays tone-rule notation, an explanation, and highlights the rule currently in use.
   - The component picker has three columns: initial consonant | vowel and tone mark | final consonant. Initials are grouped as single, cluster, or leading consonants. Finals are grouped by stop (dead syllable) and sonorant (live syllable) sounds.
   - Less common letters have a muted background while remaining legible. IPA, RTGS, and tone-mark names can be toggled on or off.
   - At 1440×900, the full page fits in one viewport. During drag and drop, the target slot flashes in the dragged component's color. If the composition panel scrolls out of view, a floating builder appears below the navigation and remains a drop target.
5. **Appearance controls:** Toggle IPA and RTGS labels in component pickers, and customize the colors for the three consonant classes and five tones. Light and dark themes have separate color settings.

## Project Structure

The project uses Feature-Sliced Design (FSD). Next.js routes live in the root `app/` directory and re-export page implementations from `src/pages/`.

```text
app/                   Next.js App Router routes (metadata and TanStack Query prefetching)
pages/                 Intentionally empty; prevents Next.js from treating src/pages as Pages Router
src/
  app/                 Locale and Query providers, root shell, global styles
  pages/               Page compositions: home, IPA, history, and builder
  widgets/             Site navigation, hero merge, IPA explorer, history graph, syllable builder
  features/            Syllable building, locale and theme toggles, appearance customization
  entities/            Consonants, vowels, syllables, lexicon, phonemes, script history, writing
  shared/              Internationalization, utilities, UI, and configuration
scripts/               Utility scripts, including stroke extraction
```

## Syllable Analysis and Lexicon

The `entities/syllable/lib/analyze.ts` engine accepts `{ initial, vowel, final, mark }` and returns:

- Correctly ordered Thai spelling in Unicode, including tone marks placed on the final letter of a cluster (for example, ใกล้ and หน้า).
- IPA transcription.
- The tone and whether the syllable is live or dead.
- Step-by-step explanations in the selected language.

The `entities/lexicon` sample dictionary contains around 150 simple and compound words. It is accessed through TanStack Query and can be replaced with an API. A result described as "not a Thai word" means only that it is not present in this dictionary. The irregular readings น้ำ /náːm/ and เงิน /ŋɤn/ are documented separately.

Audio uses the Web Speech API with the `th-TH` voice. If a Thai voice is unavailable on the device, the site displays instructions for installing one.

## Localization, Themes, and Romanization

- `src/shared/i18n` contains the `vi` and `en` interface dictionaries. Entity text uses the `L10n = { vi, en }` type. The selected locale is stored in the `locale` cookie and restored in the browser after hydration so the site can be statically exported.
- Light and dark theme tokens are CSS variables, with dark values defined under `[data-theme=dark]`. The default follows `prefers-color-scheme`; the selected theme is stored in the `theme` cookie and applied by a small head script before paint. Consonant-class and tone colors use CSS variables, so SVGs and inline styles follow the active theme.
- RTGS romanization (Royal Thai General System, Thailand's official romanization system) is generated from IPA by `src/shared/lib/romanize.ts`. It omits tones and vowel length. Final ย becomes `-i`, final ว becomes `-o`, and both จ and ช are romanized as `ch`. Examples: หน้า → `na`, ควาย → `khwai`, แม่น้ำ → `maenam`.
- Appearance preferences are stored in localStorage under `kaa-prefs` using Zustand persist. A small script in `<head>` applies the color palette before the page is painted to prevent a color flash.

## Stroke Data

`src/entities/writing/model/strokes.json` contains centerline paths generated from the **Noto Sans Thai Looped** font by `scripts/extract-strokes.py`. These paths are approximations, not verified handwriting stroke sequences, so the alphabet page currently shows static glyphs instead of animating them. The writing animation can return when reliable stroke-order references are available.

# abugikha

# abugikha
