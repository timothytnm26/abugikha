import { DICTS, type L10n } from "@abugikha/i18n";
import { useLearning } from "@/store/learning";

export const useLocale = () => useLearning((s) => s.locale);
export const useT = () => DICTS[useLocale()];
/** Chọn bản dịch cho dữ liệu song ngữ */
export const useL = () => {
  const locale = useLocale();
  return (x: L10n) => x[locale];
};
