import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/meydan/Navbar";
import { Hero } from "@/components/meydan/Hero";
import { Problem } from "@/components/meydan/Problem";
import { Solution } from "@/components/meydan/Solution";
import { Features } from "@/components/meydan/Features";
import { Story } from "@/components/meydan/Story";
import { HowItWorks } from "@/components/meydan/HowItWorks";
import { FinalCta } from "@/components/meydan/FinalCta";
import { Footer } from "@/components/meydan/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Meydan — Görünmeyen sporcuların dijital tribünü" },
      {
        name: "description",
        content:
          "Meydan, Türkiye'nin futbol dışı sporcularını taraftarla buluşturan dijital köprü. İzle. Destekle. Sen de Oyna.",
      },
      { property: "og:title", content: "Meydan — Görünmeyen sporcuların dijital tribünü" },
      {
        property: "og:description",
        content: "Türkiye'nin görünmeyen sporcularını keşfet, destekle ve yeni sporlarla tanış.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <Story />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
