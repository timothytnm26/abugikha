---
name: NarakThai
description: A flat poster Thai script lab: flush color tiles, condensed uppercase type, and glyph colors that carry meaning.
colors:
  paper: "#eef1ec"
  paper-deep: "#e1e8e1"
  ink: "#1e2833"
  ink-soft: "#58646f"
  on-accent: "#ffffff"
  sheet: "#fbfbf4"
  sheet-line: "#b9c9c9"
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
  poster-blue: "#2332e8"
  poster-lime: "#d4f72a"
  poster-violet: "#5a1fb0"
  poster-black: "#0c0c18"
  poster-orange: "#ff6a1f"
  poster-red: "#e8382f"
  poster-cream: "#fbe6cc"
  poster-green: "#0e7a58"
  poster-pink: "#f6a6c3"
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
    backgroundColor: "{colors.poster-lime}"
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
  poster-tile-blue:
    backgroundColor: "{colors.poster-blue}"
    textColor: "#ffffff"
    padding: "32px"
  poster-tile-lime:
    backgroundColor: "{colors.poster-lime}"
    textColor: "{colors.poster-black}"
    padding: "32px"
  poster-tile-black:
    backgroundColor: "{colors.poster-black}"
    textColor: "{colors.poster-lime}"
    padding: "32px"
  note-paper:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: NarakThai

## Overview

**Creative North Star: "The Flat Poster Lab"**

NarakThai is a lab where a beginner can pick Thai letters up, drop them into slots and watch syllables assemble, set as a flat color-block poster. Every page is built from flush rectangular tiles and full-bleed color bands: condensed uppercase headlines, huge Thai glyphs, outlined repeated numerals and chevron marks. There are no rounded corners, no shadows, no gradients, no textures and no separate card backgrounds; surfaces meet edge to edge.

Color has two jobs and they never mix. Poster colors (blue, lime, violet, black, orange, red, cream, green, pink) are structure: bands, strips, buttons, tiles. Meaning colors (consonant class, tone, vowel, final, removed part) live only on Thai glyphs and their tiles, so a learner can still read a color as information. Thai glyphs are the largest, most legible thing in their group; romanization is an optional aid.

The page itself stays theme-aware: the seven themes, dark mode and per-theme syllable-part colors still set paper, ink and meaning colors, while poster colors are fixed. Any poster tile that holds theme-colored content resets the theme variables to celadon so it stays legible in dark mode.

**Key Characteristics:**
- Flush tiles and full-bleed bands; the only separation between areas is a change of color.
- Square everywhere. Circles appear only as small marks (dots, rings, timeline nodes).
- Condensed uppercase poster type for headings and buttons; humanist sans for prose.
- Black top bar with a lime active tab; every page opens with a colored title band.
- Flat state feedback: hover inverts colors, focus draws a thick outline, drop targets get a thick solid outline.
- Motion only where it teaches: the hero merge, tile reveal on the home page, result stamp and drop.

## Colors

Fixed poster palette for structure, theme-driven paper and ink for the page, meaning colors for glyphs.

### Poster palette (structure)
- **Electric Blue** (#2332e8): title tiles and the first group strip; white text (7.8:1). **Lime** (#d4f72a): primary buttons, highlight tiles, the active nav tab; black text (15.9:1). **Violet** (#5a1fb0): white text (9.3:1). **Poster Black** (#0c0c18): the top bar, footer and some tiles; lime or white text. **Orange** (#ff6a1f): black text (6.8:1). **Red** (#e8382f): black text only (4.7:1; white fails). **Cream** (#fbe6cc): the one light tile, black text, hosts themed content. **Green** (#0e7a58): white text (5.3:1). **Pink** (#f6a6c3): black text.
- Every tile and text pair is fixed in `PosterTile` and checked in `shared/config/poster.test.ts`; do not pair colors the list above does not give.

### Primary
- **Ink Slate** (#1e2833): body text and outlines on the page paper, theme-driven.

### Secondary (consonant classes)
- **Mid-class Jade** (#007a5b), **High-class Brick** (#a23e2d), **Low-class Cobalt** (#215da5): consonant classes.

### Tertiary (tones and syllable parts)
- **Mid-tone Graphite** (#616c67), **Low-tone Indigo** (#474c95), **Falling-tone Plum** (#a3416d), **High-tone Ochre** (#965f00), **Rising-tone Teal** (#007498): the five tones.
- **Vowel Violet** (#7c4a98) and **Final Olive** (#507308): vowel and final parts. **Removed Red** (#c2361c): a part being dropped by a vowel transformation, never an error color.

### Neutral
- **Celadon Paper** (#eef1ec) is the page background, **Slate Ink Soft** (#58646f) secondary text, **Note Sheet** (#fbfbf4) the ruled notebook sheet and **Sheet Line** (#b9c9c9) its rules. Dark mode uses Night Paper (#121a1d), Night Ink (#e3ebe6), Night Ink Soft (#9aaaa2) and Night Sheet (#1f2b2f). All seven themes redefine these in `shared/config/themes.ts`.

### Named Rules
**The Two Jobs Rule.** Poster colors structure the page; meaning colors mark class, tone, vowel, final and removed parts. A poster tile color never carries meaning and a meaning color never fills a band.

**The No-Pure-Black Rule.** Page paper and ink are never #fff or #000; the poster black and white text are confined to poster tiles.

**The Theme Variable Rule.** Page-level colors come from `--color-*` variables; poster colors from `--color-poster-*`. Never hard-code a literal in a component.

## Typography

**Poster Font:** Barlow Condensed 600 to 800 (with Be Vietnam Pro, Noto Sans Thai), loaded for every page.
**Body Font:** Be Vietnam Pro (with Noto Serif Thai for inline Thai).
**Thai Display:** Noto Serif Thai at 400, 500, 600, so glyphs never synthesize bold. **IPA:** Charis SIL (Doulos SIL, Gentium Plus). **Historic scripts:** Noto Sans faces, loaded only on /history.

**Character:** Loud condensed uppercase headings against calm readable prose, with a looped serif Thai face that models the letterforms learners copy.

### Hierarchy
- **Poster display** (800, up to 5.5rem, line-height about 0.98, uppercase): page title bands, hero headline, section bands (3rem to 5rem).
- **Poster title** (700, 1.5rem to 3rem, uppercase): tile titles, group strips, buttons (1.25rem).
- **Body** (400, 1rem, relaxed leading, about 65 characters): prose and explanations.
- **Label** (500 to 600, 0.75rem to 0.875rem): captions, legends, romanization. 0.75rem is the floor for any text.

### Named Rules
**The Thai-First Rule.** A Thai glyph is always the largest element in its group, with IPA and RTGS below.
**The Specimen Rule.** Compare letterform styles in their real fonts; never fake with weight or slant.

## Layout

A centered container (max 1440px, 16px then 24px side padding) holds prose and tools, while title bands, section bands, poster grids and the footer run full-bleed. The home page is a stack of flush grids: the hero is a 12-column by 6-row grid on lg and above that fills the first screen; later sections are a black heading band, a short lead, then a flush tile grid. Every tool page starts with a colored title band (blue /ipa, violet /aksornthai, orange /lab), then bands and content in the container. /history pins the screen and scrolls horizontally on tall desktop viewports (min 1024px wide, 720px tall) and falls back to a swipe strip otherwise; its era bar is a black strip. The syllable builder is designed to fit 1440×900, with a floating mini-builder docked under the nav when the main composition scrolls away. The nav collapses to a hamburger panel on narrow screens.

## Elevation & Depth

None. The system is flat: no box shadows, drop shadows or blur. Depth is conveyed only by color change and by 2px ink or poster outlines. Hover inverts a tile or button; focus draws a 4px outline; a drop target gets a 3px dashed outline that becomes a 5px solid outline when a part is over it. Popovers and the settings panel are set apart by a 2px ink border.

### Named Rules
**The Flat Rule.** Never add a shadow, gradient, blur or texture to a surface.

## Shapes

Square. Every tile, button, input, chip, panel, popover and sheet has square corners and straight edges; the 2px-bordered ruled note sheet is a plain rectangle. Circles are allowed only as small marks: legend dots, trap dots, the timeline nodes, the hero ring and the rule-breakdown bullets. Marks that look like tiles (the clear button, the warning badge) are squares too.

## Components

### Buttons
- **Shape:** Square, 2px border, minimum height 48px (44px small and extra small), condensed uppercase labels.
- **Primary:** Lime fill, Poster Black border and text; hover flips to Poster Black fill with lime text.
- **Outline:** Transparent, 2px ink border and ink text; hover fills ink with paper text.
- **Focus:** 4px outline offset 2px.
- **Icon (nav):** 44px square with a 2px lime border on the black bar; hover fills lime.

### Chips and pills
- Small bordered squares. The active chip is filled ink. Legend dots are the only round marks.

### Tiles and bands
- **Poster tile:** A flush rectangle in a poster color with its paired text color, padded 20px (32px from md up). Links nudge their arrow or chevrons right on hover and focus with an inset 4px outline.
- **Title band (PageIntro):** A full-bleed tile with a condensed uppercase h1 and a one-line lead; compact on tool pages.
- **Section band (PosterHeading):** A full-bleed tile with an uppercase h2 above a section of content.
- **Group strip:** The header of each builder group at xl and above, in blue, violet, orange or green; the strip color is decoration, tile colors carry meaning.
- **Cream panel:** The selected-item detail (IPA and alphabet previews, hero merge, syllable parts) on Cream with celadon variables.
- **Poster frame:** An unstyled wrapper that groups flush tiles; it has no radius, border or shadow.
- **Learning path tiles:** Four link tiles of different sizes in a 6-column mosaic (builder the largest), each with a huge outlined Thai numeral and chevrons.
- **Syllable intro:** Five three-tile columns on a shared subgrid: a colored strip with the part number and the + or = sign, a cream tile with the large Thai glyph in its meaning color, and a cream explanation tile. The result column is lime.

### Inputs / Fields
- Appearance settings (theme, paper, per-part colors) are square swatches and switches in a 2px-bordered panel; there are no free-text inputs in the core flows. Pickers are tiles, not form fields.

### Navigation
- **Style:** A 3.5rem Poster Black bar with the logo (white with a lime "ไทย"), learning-path tabs in uppercase condensed type (the current page is a lime tab) and 44px lime-bordered locale, theme and settings buttons.
- **Mobile:** A hamburger opens a black panel with a lime top rule; the current page is a lime row. Esc or an outside click closes it and returns focus.

### Syllable slot (signature)
A square part-holder colored by the part it expects. While dragging, non-target slots fade to 30% and go greyscale; the target gets a dashed outline that pulses; the slot a part hovers over previews the glyph with a 5px solid outline. Parts removed by a vowel transformation wobble, turn red and get a strike-through; new parts glow once.

### Notebook sheet
The ruled sheet (4 tiers, lines, grid, dots or plain by user choice) is a plain rectangle with a 2px ink border; ruling is functional because it shows where a letter sits when writing.

## Do's and Don'ts

### Do:
- **Do** keep tiles flush: they touch, areas separate by color change only, heights come from the grid.
- **Do** pair poster text colors exactly as `PosterTile` does and keep the test green.
- **Do** read page colors from `--color-*` variables and poster colors from `--color-poster-*`.
- **Do** give every page a colored title band and use the condensed uppercase poster font for headings and buttons.
- **Do** reset theme variables (celadon) on any poster tile that shows theme-colored glyphs.
- **Do** set Thai glyphs largest in their group, with IPA and RTGS beneath.
- **Do** respect prefers-reduced-motion: transitions shorten and loops stop.

### Don't:
- **Don't** add rounded corners, shadows, gradients, blur, grain, tape or fold effects.
- **Don't** put an eyebrow or kicker pill above a heading.
- **Don't** loop ambient motion (floating glyphs, marquees) behind content.
- **Don't** fill a band with a meaning color or let a poster color stand for class, tone, vowel or final.
- **Don't** put white text on red or red text on cream; they fail AA.
- **Don't** use pure white or pure black on the page paper or page text.
- **Don't** hard-code user-facing strings or colors; copy comes from `packages/i18n`.
