# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Beginners learning to read Thai script, in Vietnamese or English (`vi` is the default locale, `en` is supported). They are curious learners, not scholars. They explore sounds, history and syllable construction on their own, on the web or on the mobile companion app. No assumed first language beyond those two.

## Product Purpose
NarakThai (น่ารักไทย, "Thai Script Lab") is an interactive guide to Thai script. Learners explore its sounds and history, then build syllables to see how consonants, vowels, tone marks and final consonants combine. Success means a beginner can look at a Thai syllable and understand why it is read the way it is.

## Positioning
Friendly, not academic. The name plays on "น่ารัก" (nâa-rák, "cute"): learning a script can be gentle and approachable. Behind the friendliness is real rule-based content from one shared Thai-script engine (tone rules, syllable analysis, romanization).

## Operating Context
- Web: Next.js static export on GitHub Pages, every page prerendered per locale (`/vi/...`, `/en/...`).
- Mobile: Expo companion app, offline-first, with device `th-TH` speech.
- API: Hono on Cloudflare Workers, used for anonymous accounts and progress sync.
- Learners compare against printed notebooks and textbooks, so the interface borrows paper styles (4-tier book, ruled, grid, dotted, plain).

## Capabilities and Constraints
- Pages: /ipa (phonetics), /history (script timeline), /aksornthai (consonants, vowels, digits), /lab (syllable builder).
- Appearance controls: seven soft themes, preview paper style, per-theme colors for each syllable part.
- All user-facing strings live in `packages/i18n` as per-locale JSON; no hard-coded copy.
- Shared engine in `packages/core`; web, mobile and API must stay consistent with it.
- The repository and package names keep the original `abugikha` name; the product name is NarakThai.
- Mobile native design language is not decided here.

## Brand Commitments
Name: NarakThai (น่ารักไทย). Friendly, gentle tone. Thai glyphs shown with IPA and RTGS romanization, which learners can toggle.

## Evidence on Hand
Real Thai-script data in `packages/core` and `packages/i18n` (44 consonants, vowels, tone rules, lexicon, script-history timeline). No testimonials, user counts, or benchmarks exist; do not invent them.

## Product Principles
1. Friendly over academic: explain rules gently, never lecture.
2. Show the rule, not just the answer: every syllable result explains why.
3. Thai script first: glyphs stay legible and prominent, with romanization as an optional aid.
4. One engine, many surfaces: web, mobile and API share the same truth.
5. Learners make it theirs: themes, paper and colors are choices, not defaults to be fixed.
