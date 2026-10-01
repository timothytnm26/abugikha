"use client";
import { useEffect, useState } from "react";
import { SYLLABLE_EXAMPLES, useBuilderStore } from "@/features/build-syllable";
import { useT } from "@/shared/i18n";
import { usePreferences } from "@/shared/lib/preferences";
import { LIGHT_VARS } from "@/shared/ui";

/** Khung hướng dẫn ngắn ở đầu trang /lab: bốn bước ghép và vài âm tiết mẫu bấm một lần là điền đủ. Đóng rồi thì nhớ lại. */
export function BuilderCoach() {
  const t = useT();
  const dismissed = usePreferences((p) => p.coachDismissed);
  const setDismissed = usePreferences((p) => p.setCoachDismissed);
  const setSyllable = useBuilderStore((s) => s.setSyllable);
  // Chờ nạp tuỳ chỉnh đã lưu rồi mới hiện, để người đã đóng không thấy khung nháy lên
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const off = usePreferences.persist.onFinishHydration(() => setReady(true));
    if (usePreferences.persist.hasHydrated()) setReady(true);
    return off;
  }, []);
  if (!ready) return null;

  if (dismissed)
    return (
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setDismissed(false)}
          className="min-h-11 px-3 text-xs font-medium text-ink-soft underline underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {t.builder.coach.show}
        </button>
      </div>
    );

  const c = t.builder.coach;
  return (
    <section aria-label={c.title} style={LIGHT_VARS} className="mb-4 bg-poster-lime px-5 py-4 text-poster-black">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">{c.title}</h2>
          <ol className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-ink/80">
            {[c.step1, c.step2, c.step3, c.step4].map((s, i) => (
              <li key={i}>
                <span className="font-semibold text-ink">{i + 1}.</span> {s}
              </li>
            ))}
          </ol>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="min-h-11 shrink-0 border-2 border-poster-black px-4 text-sm font-semibold hover:bg-poster-black hover:text-poster-lime focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-poster-black"
        >
          {c.dismiss}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">{c.try}</span>
        {SYLLABLE_EXAMPLES.map((e) => (
          <button
            key={e.word}
            type="button"
            lang="th"
            onClick={() => setSyllable(e)}
            className="min-h-11 min-w-11 border-2 border-poster-black bg-poster-cream px-3 font-thai text-2xl leading-none hover:bg-poster-black hover:text-poster-lime focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-poster-black"
          >
            {e.word}
          </button>
        ))}
        <span className="text-xs text-poster-black/80">{c.tryHint}</span>
      </div>
    </section>
  );
}
