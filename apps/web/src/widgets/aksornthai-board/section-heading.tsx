import type { ReactNode } from "react";

/** Tiêu đề phần + vùng bộ lọc / gợi ý bên cạnh */
export function SectionHeading({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <h2 id={id} className="mr-2 font-poster text-4xl font-extrabold uppercase leading-none">
        {title}
      </h2>
      {children}
    </div>
  );
}
