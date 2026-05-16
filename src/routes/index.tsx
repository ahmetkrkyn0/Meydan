import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import { Navbar } from "@/components/meydan/Navbar";
import { Hero } from "@/components/meydan/Hero";
import heroPreload from "@/assets/meydan-hero.png?w=1280&format=webp";

// Below-the-fold: split into separate chunks, loaded after first paint
const Problem = lazy(() =>
  import("@/components/meydan/Problem").then((m) => ({ default: m.Problem })),
);
const Sunar = lazy(() =>
  import("@/components/meydan/Sunar").then((m) => ({ default: m.Sunar })),
);
const Features = lazy(() =>
  import("@/components/meydan/Features").then((m) => ({ default: m.Features })),
);
const FinalCta = lazy(() =>
  import("@/components/meydan/FinalCta").then((m) => ({ default: m.FinalCta })),
);
const Footer = lazy(() =>
  import("@/components/meydan/Footer").then((m) => ({ default: m.Footer })),
);

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Meydan — Her sporun bir meydanı var" },
      {
        name: "description",
        content:
          "Meydan, Türkiye'nin futbol dışı sporcularını taraftarla buluşturan dijital sahnedir. Keşfet, destekle, sahaya çık.",
      },
      { property: "og:title", content: "Meydan — Her sporun bir meydanı var" },
      {
        property: "og:description",
        content: "Keşfet, destekle, sahaya çık. Türkiye'nin yeni sporcu hareketi.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroPreload },
      { name: "twitter:image", content: heroPreload },
    ],
    links: [
      // Preload LCP hero so it ships in the initial response
      {
        rel: "preload",
        as: "image",
        href: heroPreload,
        fetchpriority: "high",
      },
    ],
  }),
});

function Index() {
  return (
    // Respect prefers-reduced-motion site-wide
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<div className="h-[60vh]" />}>
            <Problem />
            <Sunar />
            <Features />
            <FinalCta />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </MotionConfig>
  );
}
