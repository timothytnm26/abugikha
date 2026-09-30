"use client";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger, useGSAP);
  // Thanh địa chỉ trên điện thoại co giãn khi cuộn: đừng tính lại vị trí ghim mỗi lần như vậy
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, Draggable, ScrollTrigger, useGSAP };
