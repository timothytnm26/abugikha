import * as Speech from "expo-speech";

/** Đọc tiếng Thái bằng giọng th-TH của hệ điều hành. */
export function speakThai(text: string, rate = 0.75) {
  Speech.stop();
  Speech.speak(text, { language: "th-TH", rate });
}
