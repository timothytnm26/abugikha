import { DEFAULT_LOCALE } from "@abugikha/i18n";
import { BASE_PATH } from "@/shared/config/metadata";

/**
 * Static export không có redirect phía server nên chọn locale ngay trên trình duyệt:
 * cookie `locale` đã lưu → ngôn ngữ trình duyệt (vi → vi, còn lại → en).
 */
const REDIRECT_SCRIPT = `(function(){var m=document.cookie.match(/(?:^|; )locale=(vi|en)(?:;|$)/);var l=m?m[1]:((navigator.languages||[navigator.language]).some(function(x){return /^vi\\b/i.test(x)})?"vi":"en");location.replace(${JSON.stringify(BASE_PATH)}+"/"+l+"/"+location.search+location.hash)})()`;

export default function RootRedirect() {
  const fallback = `${BASE_PATH}/${DEFAULT_LOCALE}/`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${fallback}`} />
      </noscript>
      <p>
        <a href={`${BASE_PATH}/vi/`}>Tiếng Việt</a> · <a href={`${BASE_PATH}/en/`}>English</a>
      </p>
    </>
  );
}
