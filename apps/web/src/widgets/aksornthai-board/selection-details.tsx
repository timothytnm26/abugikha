import { useRouter } from "next/navigation";
import { CLASS_META, CONSONANT_BY_ID, INITIAL_BY_ID, consonantSpeech, type ConsonantClass } from "@/entities/consonant";
import { vowelFitsInitial, vowelGlyph } from "@/entities/vowel";
import { TONE_META, resolveTone, type ToneMark } from "@/entities/syllable";
import { useBuilderStore } from "@/features/build-syllable";
import { fmt, useLocale, useLocalePath, useT } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { speakThai } from "@/shared/lib/speech";
import { Phonetic, SpeakButton } from "@/shared/ui";
import type { Selected } from "./selection";
import { closedForms } from "./tiles";

/** Phụ âm đại diện mỗi nhóm để minh hoạ dấu thanh: ก่า ข่า ค่า */
const CLASS_EXAMPLE: Record<ConsonantClass, string> = { mid: "ก", high: "ข", low: "ค" };
const CLASSES: ConsonantClass[] = ["mid", "high", "low"];

/** Chi tiết chữ đang chọn trong khung preview, kèm nút "thử trong Ghép chữ" */
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
  const router = useRouter();
  const href = useLocalePath();
  const setPart = useBuilderStore((s) => s.setPart);
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span lang="th" className="font-thai text-3xl">
          {consonantSpeech(item)}
        </span>
        <span className="px-2.5 py-0.5 text-xs font-medium text-on-accent" style={{ backgroundColor: CLASS_META[item.cls].color }}>
          {fmt(t.builder.formula.cls, { cls: CLASS_META[item.cls].label[locale] })}
        </span>
        {item.obsolete && (
          <span className="border border-ink/20 px-2 py-0.5 text-xs text-ink-soft">{t.aksornthai.obsolete}</span>
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
      <div className="flex flex-wrap gap-2">
        <SpeakButton text={consonantSpeech(item)} label={t.aksornthai.listenName} />
        {INITIAL_BY_ID.has(item.char) && (
          <button
            type="button"
            onClick={() => {
              setPart("initial", item.char);
              router.push(href("/lab"));
            }}
            className="btn btn-outline btn-xs"
          >
            {t.aksornthai.tryIt} →
          </button>
        )}
      </div>
    </>
  );
}

function InitialDetails({ item }: { item: Extract<Selected, { kind: "initial" }>["item"] }) {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const href = useLocalePath();
  const setPart = useBuilderStore((s) => s.setPart);
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span lang="th" className="font-thai text-3xl">
          {item.chars}
        </span>
        <span className="px-2.5 py-0.5 text-xs font-medium text-on-accent" style={{ backgroundColor: CLASS_META[item.cls].color }}>
          {fmt(t.builder.formula.cls, { cls: CLASS_META[item.cls].label[locale] })}
        </span>
        <Phonetic ipa={item.ipa} className="text-ink-soft" />
      </div>
      {item.note && <p className="text-sm text-ink-soft">{item.note[locale]}</p>}
      <div className="flex flex-wrap gap-2">
        <SpeakButton text={item.chars} label={t.aksornthai.listenName} />
        <button
          type="button"
          onClick={() => {
            setPart("initial", item.id);
            router.push(href("/lab"));
          }}
          className="btn btn-outline btn-xs"
        >
          {t.aksornthai.tryIt} →
        </button>
      </div>
    </>
  );
}

function VowelDetails({ item }: { item: Extract<Selected, { kind: "vowel" }>["item"] }) {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const href = useLocalePath();
  const setPart = useBuilderStore((s) => s.setPart);
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-3">
        <span lang="th" className="font-thai text-2xl">
          {vowelGlyph(item)}
        </span>
        <Phonetic ipa={item.ipa} className="text-ink-soft" />
      </div>
      <p className="text-sm text-ink-soft">
        {item.approx[locale]} · {item.length === "long" ? t.ipa.long : t.ipa.short}
      </p>
      {item.closed && (
        <p className="text-sm">
          {t.aksornthai.closedForm}:{" "}
          <span lang="th" className="font-thai text-xl">
            {closedForms(item).join(" · ")}
          </span>
        </p>
      )}
      <button
        type="button"
        onClick={() => {
          const state = useBuilderStore.getState();
          const currentInitial = INITIAL_BY_ID.get(state.initialId)!;
          const currentFinal = state.finalId ? CONSONANT_BY_ID.get(state.finalId) : null;
          if (!vowelFitsInitial(item, currentInitial.chars)) setPart("initial", "ก");
          if (currentFinal && (!item.closed || item.excludeFinals?.includes(currentFinal.char))) {
            setPart("final", null);
          }
          setPart("vowel", item.id);
          router.push(href("/lab"));
        }}
        className="w-fit btn btn-outline btn-xs"
      >
        {t.aksornthai.tryVowel} →
      </button>
    </>
  );
}

function DigitDetails({ item }: { item: Extract<Selected, { kind: "digit" }>["item"] }) {
  const t = useT();
  return (
    <>
      <div className="flex items-baseline gap-3">
        <span lang="th" className="font-thai text-3xl">{item.word}</span>
        <Phonetic ipa={item.ipa} className="text-ink-soft" />
      </div>
      <p className="text-sm">
        {t.aksornthai.value}: <span className="font-semibold">{item.value}</span>
      </p>
      <SpeakButton text={item.word} />
    </>
  );
}

/** Chi tiết dấu thanh: cùng một dấu cho thanh khác nhau theo nhóm phụ âm (âm sống, nguyên âm dài า). */
function ToneDetails({ mark }: { mark: ToneMark }) {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const href = useLocalePath();
  const setPart = useBuilderStore((s) => s.setPart);
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-3">
        <span lang="th" className="font-thai text-2xl">{mark.thai}</span>
        <span className="text-sm text-ink-soft">{mark.latin}</span>
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
      <button
        type="button"
        onClick={() => {
          setPart("mark", mark.id);
          router.push(href("/lab"));
        }}
        className="w-fit btn btn-outline btn-xs"
      >
        {t.aksornthai.tryMark} →
      </button>
    </>
  );
}
