import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

interface FloatingAthleteProps {
  src: string;
  alt: string;
  side: "left" | "right";
}

export function FloatingAthlete({ src, alt, side }: FloatingAthleteProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.75, 1],
    [160, 0, -30, -90]
  );
  const y = useSpring(rawY, { stiffness: 42, damping: 16, mass: 1.3 });

  const rawX = useTransform(
    scrollYProgress,
    [0, 0.32],
    [side === "right" ? 60 : -60, 0]
  );
  const x = useSpring(rawX, { stiffness: 50, damping: 18 });

  const rawScale = useTransform(scrollYProgress, [0, 0.38, 0.75, 1], [0.80, 1.0, 1.0, 0.92]);
  const scale = useSpring(rawScale, { stiffness: 50, damping: 18 });

  const rawRotate = useTransform(
    scrollYProgress,
    [0, 0.32, 0.72, 1],
    [side === "right" ? 8 : -8, 0, 0, side === "right" ? -4 : 4]
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
        {/* Subtle color glow under feet */}
        <div
          className={`absolute -bottom-2 left-1/2 h-12 w-[55%] -translate-x-1/2 rounded-full blur-2xl opacity-60 ${
            side === "right" ? "bg-violet/20" : "bg-sky/20"
          }`}
        />

        <img
          src={src}
          alt={alt}
          draggable={false}
          className="relative block w-full h-auto select-none"
          style={{
            maxHeight: "clamp(380px, 52vh, 580px)",
            objectFit: "contain",
            objectPosition: "bottom",
            transform: side === "left" ? "scaleX(-1)" : "none",
            filter: "drop-shadow(0 24px 48px rgba(30,60,180,0.15))",
          }}
        />
      </motion.div>
    </div>
  );
}
