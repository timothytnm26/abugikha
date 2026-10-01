---
name: NarakThai
description: A calm cream canvas with huge condensed type, one color per section and scroll-driven reveals; glyph colors carry meaning.
colors:
  paper: "#f4efe9"
  paper-deep: "#e9e1d7"
  ink: "#1b1a17"
  ink-soft: "#5e5750"
  on-accent: "#ffffff"
  sheet: "#fbf8f3"
  sheet-line: "#d3c8ba"
  margin: "#d98a86"
  class-mid: "#007a5b"
  class-high: "#a23e2d"
  class-low: "#215da5"
  tone-mid: "#616c67"
  tone-low: "#474c95"
  tone-falling: "#a3416d"
  tone-high: "#965f00"
  tone-rising: "#007498"
  part-vowel: "#7c4a98"
  part-final: "#507308"
  removed: "#c2361c"
  night-paper: "#121a1d"
  night-paper-deep: "#1b262a"
  night-ink: "#e3ebe6"
  night-ink-soft: "#9aaaa2"
  night-sheet: "#1f2b2f"
  poster-blue: "#0a0adc"
  poster-orange: "#ff5200"
  poster-black: "#14130f"
  poster-cream: "#f4efe9"
  poster-taupe: "#8a7f73"
typography:
  display:
    fontFamily: "Noto Serif Thai, Noto Sans Thai, Leelawadee UI, Thonburi, serif"
    fontWeight: 600
  headline:
    fontFamily: "Be Vietnam Pro, Noto Serif Thai, Leelawadee UI, Thonburi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
  body:
    fontFamily: "Be Vietnam Pro, Noto Serif Thai, Leelawadee UI, Thonburi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  label:
    fontFamily: "Be Vietnam Pro, Noto Serif Thai, Leelawadee UI, Thonburi, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
  ipa:
    fontFamily: "Charis SIL, Doulos SIL, Gentium Plus, Noto Serif, serif"
    fontWeight: 400
  poster:
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontFamily: "Barlow Condensed, Be Vietnam Pro, Noto Sans Thai, ui-sans-serif, sans-serif"
    fontWeight: 800
    lineHeight: 0.98
  historic:
    fontFamily: "Noto Sans Khmer, Noto Sans Lao, Noto Sans Tai Tham, Noto Sans Brahmi, Noto Sans Devanagari, Noto Sans Tamil, Noto Sans Javanese, Noto Sans Cham, Noto Sans Tai Viet, sans-serif"
    fontWeight: 400
rounded:
  none: "0px"
  mark: "9999px"
spacing:
  container-pad-sm: "16px"
  container-pad-md: "24px"
components:
  button-primary:
    backgroundColor: "{colors.poster-orange}"
    textColor: "{colors.poster-black}"
    rounded: "{rounded.none}"
    padding: "12px 28px"
    height: "48px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 28px"
    height: "48px"
  note-paper:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: NarakThai

## Overview

**Creative North Star: "The Calm Poster"**

NarakThai is a Thai script lab set like a calm editorial poster: a warm cream canvas, enormous condensed uppercase headlines, small starred section labels, and a single saturated color per section. The page breathes; whitespace is the main separator, so blocks of color are rare, large and never stacked against each other. Every corner is square. Circles appear only as a graphic motif (four orange circles) and small marks.

Color has two jobs that never mix. Poster colors (electric blue, vermilion orange, near-black, cream, a muted taupe) give structure and mood: the blue manifesto section, the orange closing section, the orange primary button and active tab. Meaning colors (consonant class, tone, vowel, final, removed part) live only on Thai glyphs and their tiles, so a learner can still read a color as information. Thai glyphs are the largest, most legible thing in their group; romanization is an optional aid.

The page stays theme-aware: eight themes (cream is the default, plus celadon, sakura, matcha, sepia and three dark ones), dark mode and per-theme syllable-part colors still set paper, ink and meaning colors, while poster colors are fixed.

**Key Characteristics:**
- Cream canvas, generous whitespace, content in a centered 1440px container.
- One saturated color per section: a full-viewport blue section, a full-viewport orange section, everything else on paper.
- Huge Barlow Condensed uppercase headings; Be Vietnam Pro for prose; Noto Serif Thai for glyphs.
- Square everywhere; orange circles as the only decorative shape.
- Scroll does the storytelling: words rise into view, a pinned section lights words one by one, a pinned section builds the syllable piece by piece, a path list highlights the chapter in view.
- Smooth inertia scrolling on the home page, off for reduced motion.

## Colors

Fixed poster palette for structure, theme-driven paper and ink for the page, meaning colors for glyphs.

### Poster palette (structure)
- **Electric Blue** (#0a0adc): the manifesto section and the brand "ไทย"; white or cream text (10:1 and 8.8:1).
- **Vermilion Orange** (#ff5200): the closing section, the primary button, the active tab, section asterisks and the circle motif; Poster Black text only (5.7:1). Orange text on cream fails AA, so it is never used as text on paper.
- **Poster Black** (#14130f): footer and dark buttons; cream text (16:1) or orange text (5.7:1).
- **Poster Cream** (#f4efe9): the same cream as the default page paper.
- **Muted Taupe** (#8a7f73): inactive large headings (3.4:1 on cream, large text only), never body text.
- Every pair is checked in `shared/config/poster.test.ts`.

### Meaning colors
- **Mid-class Jade** (#007a5b), **High-class Brick** (#a23e2d), **Low-class Cobalt** (#215da5): consonant classes.
- **Mid-tone Graphite** (#616c67), **Low-tone Indigo** (#474c95), **Falling-tone Plum** (#a3416d), **High-tone Ochre** (#965f00), **Rising-tone Teal** (#007498): the five tones.
- **Vowel Violet** (#7c4a98), **Final Olive** (#507308), and **Removed Red** (#c2361c) for a part being dropped by a vowel transformation (never an error color).

### Neutral
- **Warm Cream** (#f4efe9) page, **Deep Cream** (#e9e1d7) subtle fills, **Warm Ink** (#1b1a17) text, **Soft Ink** (#5e5750) secondary text (6.2:1), **Note Sheet** (#fbf8f3) the ruled notebook sheet, **Sheet Line** (#d3c8ba). Dark mode uses Night Paper (#121a1d), Night Ink (#e3ebe6), Night Ink Soft (#9aaaa2), Night Sheet (#1f2b2f).

### Named Rules
**The One Color Rule.** A section carries at most one saturated structural color; two poster colors never touch.
**The Two Jobs Rule.** Poster colors structure; meaning colors mark class, tone, vowel, final and removed parts. A band is never a meaning color.
**The Theme Variable Rule.** Page colors come from `--color-*`; poster colors from `--color-poster-*`. Never hard-code a literal.

## Typography

**Poster Font:** Barlow Condensed 600 to 800 (Vietnamese diacritics supported), loaded globally.
**Body Font:** Be Vietnam Pro. **Thai Display:** Noto Serif Thai 400, 500, 600. **IPA:** Charis SIL. **Historic scripts:** Noto Sans faces, loaded only on /history.

### Hierarchy
- **Display** (800, up to 9rem, line-height 0.9 to 0.95, uppercase): hero and closing headlines, tool page titles, section titles.
- **Title** (700, 1.5rem to 6.5rem, uppercase): path titles, group headings, buttons.
- **Body** (400, 1rem to 1.25rem, relaxed leading, about 65 characters): prose, in Soft Ink.
- **Label** (600 to 700, 1.25rem condensed uppercase with an orange asterisk): section labels. Text never goes below 0.75rem.

### Named Rules
**The Thai-First Rule.** A Thai glyph is the largest element in its group, with IPA and RTGS below.
**The Diacritic Room Rule.** Words that animate inside a mask need vertical padding (about 0.3em) so Vietnamese tone marks and under-dots are never clipped.

## Layout

A centered container (max 1440px, 16px then 24px padding) holds everything; sections are tall and airy with a lot of vertical padding. The home page is five sections: hero (headline left, the ค่ะ merge sheet right, a rule and the lead plus buttons below), a pinned full-viewport blue manifesto, a pinned syllable build (five columns separated by thin ink rules with + and = signs), a path list with four huge titles beside four sticky circles, and a full-viewport orange closing section. Tool pages open with an orange asterisk and a very large uppercase title on cream, then content; no colored bands. /history pins the screen and scrolls horizontally on tall desktop viewports and falls back to a swipe strip otherwise. The builder fits 1440×900 with a floating mini-builder when the stage scrolls away. The header is a cream bar with a 2px ink rule; on narrow screens a hamburger opens a cream panel.

## Elevation & Depth

None. The system is flat: no shadows, gradients, blur or texture. Separation is whitespace, thin ink rules (1px to 2px) and a change of section color. Focus draws a 4px outline; a drop target gets a dashed outline that becomes solid when a part is over it. Popovers and the settings panel are set apart by a 2px ink border.

## Shapes

Square. Tiles, buttons, inputs, panels, popovers and sheets all have square corners. Circles are used only for the four-circle motif beside the path list and for small marks (legend dots, trap dots, timeline nodes, the hero ring, rule bullets).

## Components

### Buttons
- Square, 2px border, minimum height 48px (44px small), condensed uppercase labels.
- **Primary:** orange fill, Poster Black border and text; hover flips to Poster Black fill with cream text.
- **Outline:** transparent, 2px ink border; hover fills ink with paper text.
- **Nav icon button:** 44px square with a 2px ink border.

### Navigation
- A cream header with a 2px ink bottom rule: logo (ink with a blue "ไทย"), condensed uppercase tabs (the current page is an orange tab with black text) and 44px icon buttons. Mobile: a cream panel under the header with orange for the current row.

### Section label and heading
- **Section label:** an orange eight-spoke asterisk and a condensed uppercase label.
- **Title block (PageIntro):** asterisk, a 6rem to 9rem uppercase title, and a one-line lead in Soft Ink.
- **Section heading (tool pages):** label plus a 3rem to 4.5rem uppercase heading on paper.

### Home sections and scroll behavior
- **Hero:** words of the headline rise through masks on load; the lead row and the sheet fade up.
- **Manifesto:** a full-viewport blue section pinned for 150% of a viewport while its words light from 18% to full opacity; on small screens it only scrubs without pinning.
- **Syllable build:** pinned for 220% of a viewport on lg and above; each of the five pieces lights up in turn, ending on the result and its call to action. On small screens each piece rises once into view.
- **Path list:** four rows with a hairline between them; the row near the middle of the viewport turns its title from taupe to ink and fills the matching circle of the sticky four-circle motif.
- **Closing:** a full-viewport orange section; the headline rises word by word, then four example syllables (button squares with a 2px black border) that preload the builder.
- Smooth inertia scrolling (Lenis) is enabled only on the home page and synced with ScrollTrigger; it is disabled when reduced motion is requested.

### Builder panels
- **Group headings:** a condensed uppercase title with a 2px ink rule beneath at xl and above; below xl, tabs (the active tab is orange).
- **Tone table:** a heading with a 2px ink rule, then the grid.
- **Detail panels (selected item):** 2px ink border on Note Sheet with theme-driven colors.
- **Coach:** a 2px-bordered Note Sheet block with four example buttons.

### Syllable slot (signature)
A square part-holder colored by the part it expects. While dragging, other slots fade to 30% and go greyscale; the target gets a pulsing dashed outline; the slot a part hovers over previews the glyph with a 5px solid outline. Removed parts wobble, turn red and get a strike-through.

### Notebook sheet
The ruled sheet (4 tiers, lines, grid, dots or plain by user choice) is a plain rectangle with a 2px ink border; the ruling is functional.

## Do's and Don'ts

### Do:
- **Do** leave generous whitespace and let one section carry one saturated color.
- **Do** pair poster colors and text exactly as the palette lists and keep `poster.test.ts` green.
- **Do** use the condensed uppercase poster font for headings, labels and buttons, with room for Vietnamese diacritics.
- **Do** set Thai glyphs largest in their group, with IPA and RTGS beneath.
- **Do** make scroll effects tell the story (words, pieces, chapters) and honor prefers-reduced-motion.
- **Do** read page colors from `--color-*` and poster colors from `--color-poster-*`.

### Don't:
- **Don't** stack saturated blocks against each other or fill bands with meaning colors.
- **Don't** add rounded corners, shadows, gradients, blur or texture.
- **Don't** use orange text on cream or paper (fails AA), or white text on orange.
- **Don't** put an eyebrow pill above a heading; the asterisk label is the only kicker.
- **Don't** loop ambient motion behind content.
- **Don't** hard-code user-facing strings or colors; copy comes from `packages/i18n`.
