"use client";
import { useMemo, useState } from "react";
import { CONSONANT_PHONES, MANNERS, PLACES, type ConsonantPhone } from "@/entities/phoneme";
import { CLASS_META, CONSONANTS } from "@/entities/consonant";
import { useLocale, useT } from "@/shared/i18n";
import { Phonetic, SpeakButton } from "@/shared/ui";
import { cn, ipaToRtgs } from "@/shared/lib";

export function ConsonantChart() {
  const t = useT();
  const { locale } = useLocale();
  const [sel, setSel] = useState<ConsonantPhone>(CONSONANT_PHONES.find((p) => p.ipa === "kʰ")!);
  const letters = useMemo(() => CONSONANTS.filter((c) => c.initial === sel.ipa), [sel]);
  const classes = new Set(letters.map((l) => l.cls));
  const trap = sel.trap?.[locale];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] table-fixed border-separate border-spacing-1.5 text-sm">
          <thead>
            <tr>
              <th className="w-40" />
              {PLACES.map((p) => (
                <th key={p.id} scope="col" className="pb-2 text-center font-medium text-ink-soft">{p.label[locale]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MANNERS.map((m) => (
              <tr key={m.id}>
                <th scope="row" className="pr-3 text-left font-medium text-ink-soft">{m.label[locale]}</th>
                {PLACES.map((p) => {
                  const phone = CONSONANT_PHONES.find((x) => x.place === p.id && x.manner === m.id);
                  if (!phone) return <td key={p.id} className="rounded-xl bg-ink/[0.03]" />;
                  const active = phone.ipa === sel.ipa;
                  return (
                    <td key={p.id} className="p-0">
                      <button
                        type="button"
                        onClick={() => setSel(phone)}
                        aria-pressed={active}
                        className={cn(
                          "relative flex h-16 w-full flex-col items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                          active ? "bg-ink text-paper" : "bg-paper-deep hover:bg-ink/10",
                        )}
                      >
                        <span className="font-ipa text-2xl leading-none">{phone.ipa}</span>
                        <span className="mt-1 text-[11px] opacity-70">{ipaToRtgs(phone.ipa) || "–"}</span>
                        {phone.trap?.[locale] && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-high" aria-label={t.ipa.trapAria} />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
          <span className="size-2 rounded-full bg-high" /> {t.ipa.trapLegend}
          <span className="ml-4">{t.common.rtgsHint}</span>
        </p>
      </div>

      <aside aria-live="polite" className="rounded-3xl bg-paper-deep p-6">
        <Phonetic ipa={sel.ipa} className="text-5xl" />
        <p className="mt-3 leading-relaxed">{sel.note[locale]}</p>
        {trap && <p className="mt-3 rounded-2xl bg-high/10 p-3 text-sm text-high">{trap}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span lang="th" className="font-thai text-3xl">{sel.example}</span>
          <Phonetic ipa={sel.exampleIpa} className="text-ink-soft" />
          <SpeakButton text={sel.example} />
        </div>
        <p className="text-sm text-ink-soft">{sel.meaning[locale]}</p>

        <p className="mt-6 text-sm font-medium">{t.ipa.lettersTitle}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {letters.map((l) => (
            <span lang="th" key={l.id} className={cn("grid size-11 place-items-center rounded-xl font-thai text-2xl text-on-accent", CLASS_META[l.cls].bg, l.obsolete && "opacity-40")} title={`${l.name} – ${CLASS_META[l.cls].label[locale]}`}>
              {l.char}
            </span>
          ))}
        </div>
        {classes.size > 1 && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.ipa.multiClass}</p>}
      </aside>
    </div>
  );
}
