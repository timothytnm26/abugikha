"use client";
/**
 * Adapter phát âm. Hiện dùng Web Speech API (giọng th-TH của trình duyệt/hệ điều hành).
 * Khi có file ghi âm thật, chỉ cần thay phần thân của `speakThai` (vd. phát /audio/<text>.mp3).
 */
export function getThaiVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  return window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("th"));
}

export function speakThai(text: string, rate = 0.75): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "th-TH";
  utter.rate = rate;
  const voice = getThaiVoice();
  if (voice) utter.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  return Boolean(voice);
}
