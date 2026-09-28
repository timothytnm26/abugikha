Thư mục rỗng này cố ý tồn tại: nó ngăn Next.js hiểu nhầm `src/pages` (layer "pages" của FSD) là Pages Router.
Routing thật nằm ở `app/` (App Router) và chỉ re-export từ `src/pages/*`.
