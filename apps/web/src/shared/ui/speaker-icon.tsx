/** Biểu tượng loa dùng chung (tô theo màu chữ hiện tại); đặt ở shared để mọi nút nghe dùng cùng một hình */
export function SpeakerIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`${className} shrink-0 fill-current`}>
      <path d="M3 8v4h3l4 4V4L6 8H3zm10.5 2a3.5 3.5 0 0 0-2-3.2v6.4a3.5 3.5 0 0 0 2-3.2zM11.5 3v1.6a5.5 5.5 0 0 1 0 10.8V17a7 7 0 0 0 0-14z" />
    </svg>
  );
}
