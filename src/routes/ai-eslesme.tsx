import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/meydan/AppShell";
import { Wrench, MapPin, CheckCircle, Info } from "lucide-react";

export const Route = createFileRoute("/ai-eslesme")({
  component: AIEslesmePage,
  head: () => ({ meta: [{ title: "Yapay Zeka Eşleşmesi — Meydan" }] }),
});

function AIEslesmePage() {
  return (
    <AppShell role="athlete">
      {/* Arka plan noktalı desen (Görseldeki "dot pattern" için) */}
      <div className="min-h-screen bg-slate-50/80 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] px-4 py-8 md:p-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          
          {/* KART 1: İHTİYAÇ / TALEP */}
          <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12px] font-bold text-emerald-700 border border-emerald-100">
              <Wrench className="h-3.5 w-3.5" />
              Yetenek
            </div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900 md:text-[28px]">
              Antrenmana ulaşım
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 font-medium">
              Haftada 4 gün antrenmana otobüsle gidiyorum, ücreti zorlanıyorum. Konya içinde araç sahibi destek olabilir mi?
            </p>
          </div>

          {/* KART 2: EŞLEŞME (DESTEKÇİ) */}
          <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              
              <div className="flex gap-4 items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100/70 text-[18px] font-bold text-emerald-800">
                  HŞ
                </div>
                <div className="flex flex-col">
                  <h2 className="font-display text-xl font-extrabold text-slate-900">
                    Hasan Şoför
                  </h2>
                  <div className="mt-1 flex items-center gap-1 text-[13px] font-bold text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    Konya
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[13px] font-extrabold text-emerald-800 h-max w-max">
                <CheckCircle className="h-4 w-4" />
                %87 uyum
              </div>
            </div>

            <p className="mt-6 text-[15px] leading-relaxed text-slate-600 font-medium">
              Şehir içi ulaşım için aracım var, hafta sonu boşum. Sporcuları antrenmana götürebilirim.
            </p>

            <div className="mt-6">
              <a 
                href="/sohbet" 
                className="inline-flex items-center justify-center rounded-full bg-slate-500 px-6 py-2.5 text-[13px] font-bold text-white transition-transform hover:bg-slate-600 hover:scale-105"
              >
                İletişime geç
              </a>
            </div>
          </div>

          {/* KART 3: NASIL SEÇİLDİ (AI EXPLANATION) */}
          <div className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-white/40 backdrop-blur-sm p-8">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-600">
              <Info className="h-4 w-4" />
              NASIL SEÇİLDİ
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex items-start gap-2.5 text-[15px] font-medium text-slate-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                Yetenek tarifi ihtiyacınla doğrudan örtüşüyor.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
