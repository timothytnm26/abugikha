---
name: NarakThai
description: A gentle Thai script lab on soft note paper, where color means something and parts glow into place.
colors:
  paper: "#eef1ec"
  paper-deep: "#e1e8e1"
  ink: "#1e2833"
  ink-soft: "#5a6672"
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
  historic:
    fontFamily: "Noto Sans Khmer, Noto Sans Lao, Noto Sans Tai Tham, Noto Sans Brahmi, Noto Sans Devanagari, Noto Sans Tamil, Noto Sans Javanese, Noto Sans Cham, Noto Sans Tai Viet, sans-serif"
    fontWeight: 400
rounded:
  pill: "9999px"
  sheet: "24px"
  card: "16px"
  panel: "12px"
  tile: "8px"
  chip: "6px"
  paper: "2px"
spacing:
  container-pad-sm: "16px"
  container-pad-md: "24px"
  notch: "10px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "12px 28px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "12px 28px"
    height: "48px"
  note-paper:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
---

# Design System: NarakThai

## Overview

**Creative North Star: "The Gentle Script Lab"**

NarakThai is a lab where a beginner can pick letters up, drop them into slots and watch Thai syllables assemble. It is friendly, never clinical: the lab bench is a stack of note paper, with ruled tiers, a red margin line and a strip of washi tape. Playfulness comes from motion and glow that respond to what the learner does, not from decoration that sits there.

Surfaces are muted and paper-like, tinted grey-cream or grey-green and never pure white or black, so a long study session does not tire the eyes. Color is saturated only where it carries meaning: consonant class, tone, vowel, final, and the one red that marks a part about to be removed. Thai glyphs are the largest, most legible thing on any screen; romanization is an optional aid.

Everything the learner sees can be re-skinned. Seven soft themes, five paper styles and per-theme syllable-part colors are first-class, so no component may hard-code a color.

**Home page variant: "Ink and Newsprint".** Only the home page (hero, syllable intro, learning path, closing section, site footer) uses a front-page treatment: a display serif (Source Serif 4, falling back to Noto Serif Thai) for headlines, a 4px double rule or 2px ink rule opening each section, square corners, flat notched-free buttons (`btn-flat`), taped paper replaced by plain bordered note sheets, and a faint grain over the theme's paper color. Color is still only the meaning colors. The tool pages (/lab, /ipa, /aksornthai, /history) and the nav keep the notebook treatment described below until they are migrated; the two treatments share tokens, themes and dark mode.

**Key Characteristics:**
- Note paper as the working surface, with ruled tiers, a margin line, tape and a folded corner.
- Color as information: every saturated hue maps to a class, tone or syllable part.
- State-driven glow: slots pulse, lift and light up only during drag, hover or focus.
- Notched, stepped corners on buttons, borrowed from Thai architecture.
- Thai first: glyph set in a serif Thai face, with IPA and RTGS shown beside it on demand.

## Colors

Muted pastel paper with saturated ink-marks. Light values below are the default celadon theme; each of the seven themes (celadon, sakura, matcha, sepia, midnight, twilight, cocoa) redefines every token in `packages/core` and `apps/web/src/shared/config/themes.ts`.

### Primary
- **Ink Slate** (#1e2833): body text, filled buttons, focus outlines. It is the only "brand" color; the identity lives in the meaning-colors below.

### Secondary (consonant classes)
- **Mid-class Jade** (#007a5b): mid-class consonants, also the top-left glow on the home page.
- **High-class Brick** (#a23e2d): high-class consonants.
- **Low-class Cobalt** (#215da5): low-class consonants.

### Tertiary (tones and syllable parts)
- **Mid-tone Graphite** (#616c67), **Low-tone Indigo** (#474c95), **Falling-tone Plum** (#a3416d), **High-tone Ochre** (#965f00), **Rising-tone Teal** (#007498): the five tones. Falling-tone Plum also tints the washi tape and the "ไทย" in the logo.
- **Vowel Violet** (#7c4a98) and **Final Olive** (#507308): the vowel and final-consonant parts of a syllable.
- **Removed Red** (#c2361c): a part being dropped by a vowel transformation. It is never used for errors or decoration.

### Neutral
- **Celadon Paper** (#eef1ec): page background.
- **Deep Celadon** (#e1e8e1): footer, folded corner.
- **Slate Ink Soft** (#5a6672): secondary text.
- **Note Sheet** (#fbfbf4): the preview sheet; **Sheet Line** (#b9c9c9): its ruled lines.
- **Margin Rose** (#d98a86): the red margin rule of writing paper.
- **Night Paper** (#121a1d), **Night Deep** (#1b262a), **Night Ink** (#e3ebe6), **Night Ink Soft** (#9aaaa2), **Night Sheet** (#1f2b2f): the default dark (midnight) theme. Dark values are lighter, softer versions of each meaning-color, not inversions.

### Named Rules
**The Meaning-Only Color Rule.** Saturated hues appear only to mark a consonant class, a tone, a vowel, a final or a removed part. A hue used for decoration steals meaning from the learner.

**The No-Pure-Black Rule.** Neither paper nor ink is ever #fff or #000. Contrast must read as comfortable, not stark.

**The Theme Variable Rule.** Colors are always read from `--color-*` variables (set by the theme, never literals), so every theme and every custom syllable-part color works everywhere.

## Typography

**Display Font:** Noto Serif Thai (with Noto Sans Thai, Leelawadee UI, Thonburi, serif)
**Body Font:** Be Vietnam Pro (with Noto Serif Thai for inline Thai, then system sans-serif)
**Label/Mono Font:** Charis SIL (IPA transcriptions; falls back to Doulos SIL, Gentium Plus, Noto Serif)

**Character:** A friendly geometric sans for Vietnamese and English prose, set against a looped serif Thai face that models the letterforms learners are copying. Historic scripts (Khmer, Lao, Tai Tham, Brahmi, Devanagari, Tamil, Javanese, Cham, Tai Viet) each get their Noto Sans face on the history timeline; those families load only on /history. Noto Serif Thai is loaded at weights 400, 500 and 600, so the logo and headings are never synthesized bold.

### Hierarchy
- **Display** (600, Thai glyph sizes set per context, line-height tight): the logo "น่ารักไทย" and large letter specimens.
- **Headline** (600, 1.5rem to 1.875rem at md and up): section titles.
- **Title** (600, 0.875rem): footer and card group headings.
- **Body** (400, 1rem, relaxed leading): prose and explanations; keep lines to about 65 characters.
- **Label** (500, 0.75rem to 0.875rem): chips, legends, romanization toggles. 0.75rem (12px) is the floor for any text; no fixed px sizes below it.

### Named Rules
**The Thai-First Rule.** A Thai glyph is always the largest element in its group. IPA and RTGS sit below it in the smaller IPA or sans face.

**The Specimen Rule.** When letters are compared (looped, loopless, handwriting), render each in its own real font. Never fake a style with weight or slant.

## Layout

A single centered container, max 1440px, with 16px side padding on small screens and 24px from md up. The home page is a sequence of one-screen sections (each `100svh` minus the 3.5rem nav) sharing one flat paper background with a faint grain layer (no color glows), so sections flow into each other with no seams. The script-history timeline pins the screen and scrolls horizontally on tall desktop viewports (min 1024px wide and 720px tall), and falls back to a normal horizontal swipe on smaller ones. The syllable builder is designed to fit a 1440×900 viewport, with a floating mini-builder docked under the nav as a drop target when the main composition panel scrolls away. The nav collapses to a hamburger panel on narrow screens.

## Elevation & Depth

Flat paper with tactile detail. Resting surfaces use a hairline border (ink at 10%) and a very soft long shadow, like a sheet on a desk. Real lift and glow appear only in response to state: a drop-target slot gets a dashed outline that pulses, and a slot with a part hovering over it scales to 1.15 and gains a colored ring and glow in the part's color. A hero button carries a soft drop shadow.

### Shadow Vocabulary
- **Sheet rest** (`box-shadow: 0 1px 0 ink@6%, 0 14px 30px -18px ink@35%`): the note paper.
- **Slot near** (`box-shadow: 0 0 0 6px accent@35%, 0 16px 40px -8px accent`): a slot a part is hovering over.
- **Tape** (`box-shadow: 0 1px 2px ink@15%`): washi tape.
- **Hero button** (`filter: drop-shadow(0 6px 10px ink@28%)`): the primary call to action only.

### Named Rules
**The Glow-on-Action Rule.** A glow, ring or pulse means "this is a live target or the result of your action". Never use one at rest.

## Shapes

Two silhouettes. Rounded things are friendly and small: 6px chips and 8px tiles inside the tools, 12px panels and chart cells, 16px cards, 24px sheets and settings panels, pills for badges, and a 2px barely-rounded edge for paper. Interactive controls get the signature notch: four stepped corners cut from a 10px step, drawn as a clip-path, replacing the usual rounded rectangle. Paper may carry a tape strip or a folded corner (a 1.6rem triangle). 

## Components

### Buttons
- **Shape:** Notched, stepped corners (clip-path, 10px step; 8px at small, 6px at extra small). Minimum height 48px (44px small and extra small).
- **Primary:** Ink fill, paper-colored text, padding 12px 28px. Hover fades the fill to about 85%.
- **Outline:** A 1.5px ink-at-28% border drawn by an inner clip, paper inside, ink text. Hover inverts to a solid ink fill.
- **Focus:** A 2px ink outline, inset 6px, so it stays inside the notch.
- **Icon:** The same notch, minimum width 44px, no horizontal padding.

### Chips
- **Class legend:** A 10px colored dot plus a label in ink-soft, one per consonant class. It sits on /lab and /aksornthai, where the colors are used, not in the nav.

### Cards / Containers
- **Path rows:** The home learning path is a stepped list, not equal cards: a large Thai numeral in its meaning color, a title and blurb, and an arrow that nudges right on hover. Each row shifts right by 9% from lg up, and only the last (the builder) sits on a taped note sheet. Thin ink@15% rules separate the rows.
- **Note paper:** Sheet fill, 1px ink@10% border, 2px corners. Ruling by `data-paper` (tiers, lines, grid, dots, plain).

### Inputs / Fields
- Appearance settings (theme, paper, per-theme colors) live in a settings menu; there are no free-text inputs in the core flows. Pickers are draggable parts, not form fields.

### Navigation
- **Style:** A 3.5rem top bar with the logo, learning-path steps, and locale, theme and settings controls (all 44px).
- **Mobile:** A hamburger panel that eases in 12px from above; items stagger in from the left.
- **States:** The current path step is marked. Escape or an outside click closes the panel and returns focus to the button.

### Syllable slot (signature)
A rounded part-holder, colored by the part it expects. During drag, non-target slots fade to 30% and go greyscale; the target gets a dashed pulsing outline; the slot a part hovers over previews the glyph that will land. Parts removed by a vowel transformation wobble, turn red and get a quick strike-through; new parts glow once.

## Do's and Don'ts

### Do:
- **Do** read every color from a `--color-*` variable so themes and custom syllable-part colors apply everywhere.
- **Do** set Thai glyphs in Noto Serif Thai at the largest size in their group, with IPA and RTGS beneath.
- **Do** use the notched `.btn` for actions and the paper-and-tape treatment for content that "lives on a page".
- **Do** respect `prefers-reduced-motion`: transitions drop to near zero and loops stop.
- **Do** keep contrast comfortable: ink on paper, never pure black on white.

### Don't:
- **Don't** put an eyebrow or kicker pill above a heading.
- **Don't** loop ambient motion (floating glyphs, marquees) behind content.
- **Don't** use saturated color as decoration; it belongs to class, tone, vowel, final and removed parts.
- **Don't** put glow, pulse or lift on resting elements.
- **Don't** use pure white (#fff) or pure black (#000) for surfaces or text.
- **Don't** fake Thai letterform styles with weight or slant; use the real specimen fonts.
- **Don't** hard-code user-facing strings or colors; copy comes from `packages/i18n`, color from theme variables.
