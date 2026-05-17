import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface FloatingAthleteProps {
  src: string;
  alt: string;
  side: "left" | "right";
  mirror?: boolean;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export function FloatingAthlete({ src, alt, side, mirror = false, scale: scaleProp = 1, offsetX = 0, offsetY = 0 }: FloatingAthleteProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [160 + offsetY, offsetY, -30 + offsetY, -90 + offsetY]
  );
  const y = useSpring(rawY, { stiffness: 42, damping: 16, mass: 1.3 });

  const rawX = useTransform(
    scrollYProgress,
    [0, 0.32],
    [(side === "right" ? 60 : -60) + offsetX, offsetX]
  );
  const x = useSpring(rawX, { stiffness: 50, damping: 18 });

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.38, 0.75, 1],
    [0.82 * scaleProp, 1.0 * scaleProp, 1.0 * scaleProp, 0.93 * scaleProp]
  );
  const scale = useSpring(rawScale, { stiffness: 50, damping: 18 });

  const rawRotate = useTransform(
    scrollYProgress,
    [0, 0.32, 0.72, 1],
    [side === "right" ? 7 : -7, 0, 0, side === "right" ? -3 : 3]
  );
  const rotate = useSpring(rawRotate, { stiffness: 38, damping: 14 });

  const opacity = useTransform(scrollYProgress, [0, 0.13, 0.72, 0.95], [0, 1, 1, 0]);

  return (
    <div
      ref={sectionRef}
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 z-10 hidden lg:flex items-center ${
        side === "right" ? "right-0" : "left-0"
      }`}
      style={{ width: "clamp(240px, 20vw, 340px)" }}
    >
      <motion.div
        style={{ y, x, scale, rotate, opacity }}
        className="relative w-full"
      >
        {/* Glow under feet */}
        <div
          className={`absolute -bottom-2 left-1/2 h-10 w-[50%] -translate-x-1/2 rounded-full blur-2xl opacity-50 ${
            side === "right" ? "bg-violet/25" : "bg-sky/25"
          }`}
        />

        {/* PNG — RGBA alpha rendered on transparent canvas.
            scaleX flip applied via CSS class so Framer style prop stays clean */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`relative block w-full h-auto select-none ${((side === "left") !== mirror) ? "-scale-x-100" : ""}`}
          style={{
            maxHeight: "clamp(380px, 52vh, 580px)",
            objectFit: "contain",
            objectPosition: "bottom",
            filter: "drop-shadow(0 20px 40px rgba(10,20,80,0.30))",
          }}
        />
      </motion.div>
    </div>
  );
}
