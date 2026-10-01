"use client";
import { useEffect, useState } from "react";
import { SYLLABLE_EXAMPLES, useBuilderStore } from "@/features/build-syllable";
import { useT } from "@/shared/i18n";
import { usePreferences } from "@/shared/lib/preferences";

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
          className="min-h-11 rounded-full px-3 text-xs font-medium text-ink-soft underline underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {t.builder.coach.show}
        </button>
      </div>
    );

  const c = t.builder.coach;
  return (
    <section aria-label={c.title} className="mb-3 rounded-2xl border border-ink/10 bg-paper-deep/60 px-4 py-3">
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
          className="min-h-11 shrink-0 rounded-full border border-ink/15 px-4 text-sm font-medium hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {c.dismiss}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink/80">{c.try}</span>
        {SYLLABLE_EXAMPLES.map((e) => (
          <button
            key={e.word}
            type="button"
            lang="th"
            onClick={() => setSyllable(e)}
            className="min-h-11 min-w-11 rounded-xl border-2 border-ink/20 bg-paper px-3 font-thai text-2xl leading-none hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {e.word}
          </button>
        ))}
        <span className="text-xs text-ink-soft">{c.tryHint}</span>
      </div>
    </section>
  );
}
