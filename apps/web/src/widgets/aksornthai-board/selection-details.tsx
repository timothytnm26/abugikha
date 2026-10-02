import { CLASS_META, consonantSpeech, type ConsonantClass } from "@/entities/consonant";
import { vowelGlyph } from "@/entities/vowel";
import { TONE_META, resolveTone, type ToneMark } from "@/entities/syllable";
import { fmt, useLocale, useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { speakThai } from "@/shared/lib/speech";
import { Phonetic, SpeakButton } from "@/shared/ui";
import type { Selected } from "./selection";
import { DIGIT_TILE_COLOR, chipTile, classTileColor, closedForms, markTileColor, vowelTileColor } from "./tiles";
import { vowelGroup } from "@abugikha/core/vowel";

/** Phụ âm đại diện mỗi nhóm để minh hoạ dấu thanh: ก่า ข่า ค่า */
const CLASS_EXAMPLE: Record<ConsonantClass, string> = { mid: "ก", high: "ข", low: "ค" };
const CLASSES: ConsonantClass[] = ["mid", "high", "low"];

/** Chi tiết chữ đang chọn trong khung preview (nút nghe / thử trong Ghép chữ nằm ở SelectionActions) */
export function SelectionDetails({ sel }: { sel: Selected }) {
  switch (sel.kind) {
    case "consonant":
      return <ConsonantDetails item={sel.item} />;
    case "initial":
      return <InitialDetails item={sel.item} />;
    case "vowel":
      return <VowelDetails item={sel.item} />;
    case "digit":
      return <DigitDetails item={sel.item} />;
    case "tone":
      return <ToneDetails mark={sel.item} />;
  }
}

function ConsonantDetails({ item }: { item: Extract<Selected, { kind: "consonant" }>["item"] }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span lang="th" className="font-thai text-3xl">
          {consonantSpeech(item)}
        </span>
        <SpeakButton text={consonantSpeech(item)} bare className="-ml-2" />
        <span {...chipTile({ tile: classTileColor(item.cls) })}>
          {fmt(t.builder.formula.cls, { cls: CLASS_META[item.cls].label[locale] })}
        </span>
        {item.obsolete && (
          <span className="bg-paper-deep px-2 py-0.5 text-xs text-ink-soft">{t.aksornthai.obsolete}</span>
        )}
      </div>
      <p className="text-sm text-ink-soft">
        {item.name} · {t.aksornthai.keyword}:{" "}
        <span lang="th" className="font-thai text-base text-ink">
          {item.word}
        </span>{" "}
        “{item.meaning[locale]}”
      </p>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-paper px-3 py-2">
          <dt className="text-xs text-ink-soft">{t.aksornthai.initial}</dt>
          <dd>
            <Phonetic ipa={item.initial} />
          </dd>
        </div>
        <div className="bg-paper px-3 py-2">
          <dt className="text-xs text-ink-soft">{t.aksornthai.final}</dt>
          <dd>
            {item.final ? <Phonetic ipa={item.final} /> : <span className="text-ink-soft">{t.aksornthai.noFinal}</span>}
          </dd>
        </div>
      </dl>
    </>
  );
}

function InitialDetails({ item }: { item: Extract<Selected, { kind: "initial" }>["item"] }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span lang="th" className="font-thai text-3xl">
          {item.chars}
        </span>
        <span {...chipTile({ tile: classTileColor(item.cls) })}>
          {fmt(t.builder.formula.cls, { cls: CLASS_META[item.cls].label[locale] })}
        </span>
        <Phonetic ipa={item.ipa} className="text-ink-soft" />
        <SpeakButton text={item.chars} bare className="-ml-2" />
      </div>
      {item.note && <p className="text-sm text-ink-soft">{item.note[locale]}</p>}
    </>
  );
}

function VowelDetails({ item }: { item: Extract<Selected, { kind: "vowel" }>["item"] }) {
  const t = useT();
  const tile = vowelTileColor(vowelGroup(item));
  const { locale } = useLocale();
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-3">
        <span lang="th" className="font-thai text-2xl" style={{ color: tile.ink }}>
          {vowelGlyph(item)}
        </span>
        <span {...chipTile({ tile })}>{item.length === "long" ? t.ipa.long : t.ipa.short}</span>
        <Phonetic ipa={item.ipa} className="text-ink-soft" />
        {/* Đọc nguyên âm đi với อ làm phụ âm đầu (vd. เCอ → เออ) */}
        <SpeakButton text={item.open.replace("C", "อ")} bare className="-ml-2 self-center" />
      </div>
      <p className="text-sm text-ink-soft">{item.approx[locale]}</p>
      {item.closed && (
        <p className="text-sm">
          {t.aksornthai.closedForm}:{" "}
          <span lang="th" className="font-thai text-xl">
            {closedForms(item).join(" · ")}
          </span>
        </p>
      )}
    </>
  );
}

function DigitDetails({ item }: { item: Extract<Selected, { kind: "digit" }>["item"] }) {
  const t = useT();
  return (
    <>
      <div className="flex items-baseline gap-3">
        <span lang="th" className="font-thai text-3xl" style={{ color: DIGIT_TILE_COLOR.ink }}>{item.word}</span>
        <span {...chipTile({ tile: DIGIT_TILE_COLOR })}>
          {t.aksornthai.value}: {item.value}
        </span>
        <Phonetic ipa={item.ipa} className="text-ink-soft" />
        <SpeakButton text={item.word} bare className="-ml-2" />
      </div>
    </>
  );
}

/** Chi tiết dấu thanh: cùng một dấu cho thanh khác nhau theo nhóm phụ âm (âm sống, nguyên âm dài า). */
function ToneDetails({ mark }: { mark: ToneMark }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-3">
        <span lang="th" className="font-thai text-2xl" style={{ color: markTileColor(mark.id).ink }}>{mark.thai}</span>
        <span {...chipTile({ tile: markTileColor(mark.id) })}>{mark.latin}</span>
      </div>
      <p className="text-sm text-ink-soft">{t.aksornthai.markNote}</p>
      <p className="text-sm font-medium">{t.aksornthai.toneByClass}</p>
      <ul className="grid grid-cols-3 gap-2">
        {CLASSES.map((c) => {
          const example = `${CLASS_EXAMPLE[c]}${mark.char}า`;
          const r = resolveTone({ cls: c, liveness: "live", length: "long", mark: mark.id }, locale);
          return (
            <li key={c}>
              <button
                type="button"
                onClick={() => speakThai(example)}
                title={r.irregular}
                className={cn(
                  "flex w-full flex-col bg-paper px-2.5 py-1.5 text-left hover:bg-paper/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                  r.irregular && "border border-dashed border-ink/40",
                )}
              >
                <span className="text-xs font-medium" style={{ color: CLASS_META[c].ink }}>
                  {fmt(t.builder.formula.cls, { cls: CLASS_META[c].label[locale] })}
                </span>
                <span lang="th" className="font-thai text-xl leading-snug">{example}</span>
                <span className="text-xs font-semibold" style={{ color: TONE_META[r.tone].ink }}>
                  → {fmt(t.builder.formula.tone, { tone: TONE_META[r.tone].label[locale] })}
                </span>
                {r.irregular && <span className="text-xs leading-tight text-ink-soft">{t.builder.rare}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
