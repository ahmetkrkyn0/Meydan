import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/meydan/Navbar";
import { Hero } from "@/components/meydan/Hero";
import { Sunar } from "@/components/meydan/Sunar";
import { Features } from "@/components/meydan/Features";
import { FinalCta } from "@/components/meydan/FinalCta";
import { Footer } from "@/components/meydan/Footer";

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
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Sunar />
        <Features />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
