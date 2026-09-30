"use client";
import type { RefObject } from "react";
import { gsap, Draggable, useGSAP, prefersReducedMotion } from "@/shared/lib/gsap";
import type { PartKind } from "../model/builder-store";

/**
 * Mọi [data-tile] trong `picker` kéo được. Thả vào vùng `stage` (hoặc thanh ghép nổi [data-dropzone=dock]) → mảnh bay vào đúng ô
 * [data-slot=<data-target-slot của mảnh>] (hoặc [data-slot=<kind>]) rồi gọi onDrop. Thả ra ngoài → bật về chỗ cũ.
 */
export function useSlotDrag(
  picker: RefObject<HTMLElement | null>,
  stage: RefObject<HTMLElement | null>,
  onDrop: (kind: PartKind, id: string) => void,
  deps: unknown[],
) {
  useGSAP(
    () => {
      const root = picker.current;
      if (!root || !stage.current) return;
      // Màn hình cảm ứng: kéo sẽ tranh với cuộn trang, nên chỉ dùng chạm để chọn
      if (matchMedia("(pointer: coarse)").matches) return;
      // Vùng thả: thanh ghép nổi (khi khung chính bị cuộn khuất) hoặc khung chính
      let zone: HTMLElement = stage.current;
      const pickZone = () => document.querySelector<HTMLElement>('[data-dropzone="dock"]') ?? stage.current!;
      const reduce = prefersReducedMotion();
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]:not([disabled])", root);
      // Ô riêng của mảnh (vd. vowel-above) nếu vùng thả có, không thì ô chung theo loại (thanh ghép nổi)
      const slotOf = (t: HTMLElement) =>
        (t.dataset.targetSlot && zone.querySelector<HTMLElement>(`[data-slot="${t.dataset.targetSlot}"]`)) ||
        zone.querySelector<HTMLElement>(`[data-slot="${t.dataset.kind}"]`);

      const instances = tiles.map(
        (tile) =>
          Draggable.create(tile, {
            type: "x,y",
            zIndexBoost: true,
            minimumMovement: 6,
            autoScroll: 1,
            onPress() {
              gsap.to(tile, { scale: 1.1, rotate: -4, duration: 0.15 });
            },
            onDragStart(this: Draggable) {
              // Không bôi đen chữ khi rê chuột qua trang
              document.documentElement.style.userSelect = "none";
              window.getSelection()?.removeAllRanges();
              zone = pickZone();
              // Có thanh ghép nổi thì không cần tự cuộn trang (cuộn sẽ làm thanh nổi biến mất giữa chừng)
              (this as unknown as { autoScroll: number }).autoScroll = zone.dataset.dropzone === "dock" ? 0 : 1;
              // Đánh dấu ô đích bằng màu và hình của chính mảnh đang kéo
              const slot = slotOf(tile);
              zone.toggleAttribute("data-dragging", true);
              if (!slot) return;
              slot.style.setProperty("--accent", tile.dataset.accent ?? "var(--color-ink)");
              slot.dataset.preview = tile.dataset.glyph ?? "";
              slot.toggleAttribute("data-target", true);
            },
            onDrag(this: Draggable) {
              slotOf(tile)?.toggleAttribute("data-near", this.hitTest(zone, "40%"));
            },
            onRelease(this: Draggable) {
              const over = this.hitTest(zone, "40%");
              const slot = slotOf(tile);
              document.documentElement.style.userSelect = "";
              zone.removeAttribute("data-dragging");
              slot?.removeAttribute("data-near");
              slot?.removeAttribute("data-target");
              if (!over || !slot) {
                gsap.to(tile, { x: 0, y: 0, scale: 1, rotate: 0, duration: reduce ? 0 : 0.6, ease: "elastic.out(1, 0.55)" });
                return;
              }
              const a = tile.getBoundingClientRect();
              const b = slot.getBoundingClientRect();
              gsap
                .timeline({
                  onComplete: () => {
                    gsap.set(tile, { x: 0, y: 0, scale: 0.4, rotate: 0, opacity: 0 });
                    gsap.to(tile, { scale: 1, opacity: 1, duration: 0.35, delay: 0.1, ease: "back.out(2)" });
                  },
                })
                .to(tile, {
                  x: `+=${b.left + b.width / 2 - (a.left + a.width / 2)}`,
                  y: `+=${b.top + b.height / 2 - (a.top + a.height / 2)}`,
                  scale: 0.6,
                  rotate: 0,
                  duration: reduce ? 0 : 0.25,
                  ease: "power3.in",
                })
                .add(() => onDrop(tile.dataset.kind as PartKind, tile.dataset.id!));
            },
          })[0],
      );
      return () => instances.forEach((d) => d.kill());
    },
    { scope: picker, dependencies: deps, revertOnUpdate: true },
  );
}
