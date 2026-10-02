"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CLASS_META, CONSONANTS, consonantSpeech } from "@/entities/consonant";
import { VOWELS, vowelGlyph } from "@/entities/vowel";
import { MorphPanel, TONE_MARK_BY_ID } from "@/entities/syllable";
import { MORPH_RULES } from "@abugikha/core/syllable";
import { vowelGroup } from "@abugikha/core/vowel";
import { useLocale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { LetterNotebook } from "@/shared/ui";
import { prefersReducedMotion } from "@/shared/lib/gsap";
import { speakThai } from "@/shared/lib/speech";
import { ConsonantSection } from "./consonant-section";
import { DigitSection } from "./digit-section";
import { SelectionActions } from "./selection-actions";
import { SelectionDetails } from "./selection-details";
import { morphRulesOf, type Selected } from "./selection";
import { ToneSection } from "./tone-section";
import { vowelTileColor } from "./tiles";
import { VowelSection } from "./vowel-section";

export function AksornThaiBoard() {
  const { locale } = useLocale();
  const [sel, setSel] = useState<Selected>({ kind: "consonant", item: CONSONANTS[0] });
  const preview = useRef<HTMLElement>(null);
  // Quy tắc biến hình mở sẵn (vd. từ link #morph-ooe-y ở trang Ghép chữ)
  const [morphId, setMorphId] = useState<string>();
  const morphRules = useMemo(() => morphRulesOf(sel), [sel]);
  // Desktop: khung preview cao tối đa bằng màn hình và cuộn bên trong (ẩn thanh cuộn); dải mờ ở đáy báo còn nội dung
  const [more, setMore] = useState(false);
  useEffect(() => {
    const el = preview.current;
    if (!el) return;
    const update = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [sel, morphRules]);

  useEffect(() => {
    const fromHash = () => {
      const id = /^#morph-(.+)$/.exec(decodeURIComponent(location.hash))?.[1];
      const rule = MORPH_RULES.find((r) => r.id === id);
      if (!rule) return;
      setMorphId(rule.id);
      setSel(rule.mark ? { kind: "tone", item: TONE_MARK_BY_ID.get(rule.mark)! } : { kind: "vowel", item: VOWELS.find((v) => v.id === rule.vowelId)! });
      preview.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const char =
    sel.kind === "vowel" ? vowelGlyph(sel.item) : sel.kind === "tone" ? `◌${sel.item.char}` : sel.kind === "initial" ? sel.item.chars : sel.item.char;

  const choose = (s: Selected) => {
    setSel(s);
    setMorphId(undefined);
    // Về đầu khung preview để luôn thấy chữ vừa chọn ở 4 font
    preview.current?.scrollTo({ top: 0 });
    // Mobile: khung preview nằm trên cùng; phần đầu (4 font) đã cuộn khuất thì kéo về để thấy chữ vừa chọn
    const box = preview.current?.getBoundingClientRect();
    if (box && box.top < 0) preview.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    if (s.kind === "vowel" || s.kind === "tone") return;
    speakThai(s.kind === "consonant" ? consonantSpeech(s.item) : s.kind === "initial" ? s.item.chars : s.item.word);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] xl:grid-cols-[minmax(0,1fr)_28rem]">
      {/* Khung preview dùng chung: trên cùng ở mobile, cột phải dính khi cuộn ở desktop */}
      <div className="relative order-first lg:sticky lg:top-20 lg:order-last lg:self-start">
      <aside
        ref={preview}
        className="scroll-mt-20 border-2 border-ink/30 bg-sheet p-4 md:p-5 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
      >
        {/* Chỉ thông báo một dòng ngắn khi đổi lựa chọn, không đọc lại cả khung */}
        <p role="status" className="sr-only">
          {sel.kind === "consonant" ? `${consonantSpeech(sel.item)}, ${CLASS_META[sel.item.cls].label[locale]}` : char}
        </p>
        {/* Chữ đặt trong vở 4 tầng để thấy nó nằm ở dòng nào khi viết */}
        <div role="img" aria-label={char}>
          <LetterNotebook text={char} />
        </div>

        <div className="mt-5 space-y-3 border-t border-ink/10 pt-4">
          <SelectionDetails sel={sel} />
        </div>

        {morphRules.length > 0 && (
          <div className="mt-5 border-t border-ink/10 pt-4">
            <MorphPanel key={`${sel.kind}-${morphRules[0]!.vowelId}-${morphId ?? ""}`} rules={morphRules} initialId={morphId} vowelTone={sel.kind === "vowel" ? vowelTileColor(vowelGroup(sel.item)) : undefined} />
          </div>
        )}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none sticky -bottom-4 -mx-4 -mb-4 hidden h-12 bg-linear-to-t from-sheet to-transparent md:-bottom-5 md:-mx-5 md:-mb-5",
            more && "lg:block",
          )}
        />
      </aside>
      {/* Băng keo dán xéo ở lề phải, nằm ngoài vùng cuộn của aside nên lòi ra ngoài được */}
      <SelectionActions sel={sel} className="absolute right-0 top-8 z-10 flex flex-col items-end gap-32" />
      </div>

      {/* Cột chọn chữ; các phần ngăn bởi đường nét đứt */}
      <div className="divide-y-4 divide-ink/30 [&>*]:py-8 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
        <ConsonantSection sel={sel} onChoose={choose} />
        <VowelSection sel={sel} onChoose={choose} />
        <DigitSection sel={sel} onChoose={choose} />
        <ToneSection sel={sel} onChoose={choose} />
      </div>
    </div>
  );
}
