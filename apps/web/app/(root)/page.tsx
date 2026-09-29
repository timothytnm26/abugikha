import { DEFAULT_LOCALE, DICTS, LOCALES } from "@abugikha/i18n";
import { BASE_PATH } from "@/shared/config/metadata";

/**
 * Static export không có redirect phía server nên chọn locale ngay trên trình duyệt:
 * cookie `locale` đã lưu → ngôn ngữ đầu tiên trong danh sách của trình duyệt mà app hỗ trợ → en.
 */
const REDIRECT_SCRIPT = `(function(){var L=${JSON.stringify(LOCALES)};var m=document.cookie.match(/(?:^|; )locale=([a-z]+)(?:;|$)/);var l=m&&L.indexOf(m[1])>=0?m[1]:null;if(!l){var n=navigator.languages||[navigator.language];for(var i=0;i<n.length&&!l;i++){var c=String(n[i]).toLowerCase().split("-")[0];if(L.indexOf(c)>=0)l=c}}location.replace(${JSON.stringify(BASE_PATH)}+"/"+(l||"en")+"/"+location.search+location.hash)})()`;

export default function RootRedirect() {
  const fallback = `${BASE_PATH}/${DEFAULT_LOCALE}/`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${fallback}`} />
      </noscript>
      <p>
        {LOCALES.map((l, i) => (
          <span key={l}>
            {i > 0 && " · "}
            <a href={`${BASE_PATH}/${l}/`}>{DICTS[l].meta.languageName}</a>
          </span>
        ))}
      </p>
    </>
  );
}
