import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/meydan/AppShell";
import { Send, Phone, Video, MoreVertical, CheckCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/sohbet")({
  component: SohbetPage,
  head: () => ({ meta: [{ title: "Mesajlar — Meydan" }] }),
});

function SohbetPage() {
  const [msg, setMsg] = useState("");
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "sponsor",
      text: "Merhaba! Yetenek profilinizi inceledik. İhtiyacınız olan destek için sizinle çalışmak isteriz.",
      time: "10:42",
      avatar: "https://ui-avatars.com/api/?name=MB&background=e0f2fe&color=0369a1",
    },
    {
      id: 2,
      sender: "me",
      text: "Merhaba! Çok teşekkür ederim. Hedeflerim doğrultusunda yanımda sizin gibi bir destekçiyi görmek beni çok mutlu eder.",
      time: "10:45",
      status: "read",
    },
    {
      id: 3,
      sender: "sponsor",
      text: "Harika! Önümüzdeki hafta bir tanışma toplantısı organize edelim. Ekibimiz detaylar için sizinle iletişime geçecek.",
      time: "10:47",
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: "me",
      text: msg,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' }),
      status: "sent"
    }]);
    setMsg("");
    
    // Murat Beslenme'den otomatik cevap
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "sponsor",
        text: "Mesajınızı aldık, en kısa sürede dönüş yapacağız. Teşekkürler!",
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' }),
      }]);
    }, 1500);
  };

  return (
    <AppShell role="athlete">
      <div className="mx-auto flex h-[calc(100vh-80px)] max-w-6xl flex-col bg-slate-50 p-4 md:flex-row md:gap-8 md:p-8">
        
        {/* SOL PANEL - KİŞİLER */}
        <aside className="hidden w-[340px] flex-col rounded-[2rem] bg-white shadow-sm md:flex h-full">
          <div className="p-6 pb-2">
            <h2 className="font-display text-2xl font-bold text-slate-900">Mesajlar</h2>
            <div className="mt-5 relative">
              <input 
                type="text" 
                placeholder="Sponsorlarda ara..." 
                className="w-full rounded-full bg-slate-100/80 px-5 py-3 text-[14px] font-medium outline-none transition-all focus:bg-slate-100" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            
            {/* Aktif Sohbet - Murat Beslenme */}
            <div className="flex cursor-pointer items-center gap-4 rounded-3xl bg-blue-50/50 p-3 transition-colors border border-blue-100/50">
              <div className="relative">
                <img src="https://ui-avatars.com/api/?name=MB&background=e0f2fe&color=0369a1" alt="MB" className="h-[52px] w-[52px] rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-emerald-500"></span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-bold text-blue-900">Murat Beslenme</h3>
                  <span className="text-[12px] font-bold text-blue-600">10:47</span>
                </div>
                <p className="truncate text-[13px] font-medium text-blue-600/80">Harika! Önümüzdeki hafta bir t...</p>
              </div>
            </div>

            {/* Karaca */}
            <div className="flex cursor-pointer items-center gap-4 rounded-3xl p-3 transition-colors hover:bg-slate-50">
              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-red-100 text-red-600 font-bold">
                KA
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-bold text-slate-700">Karaca</h3>
                  <span className="text-[12px] font-medium text-slate-400">12 May</span>
                </div>
                <p className="truncate text-[13px] text-slate-500">Kampanya detaylarını ilettim...</p>
              </div>
            </div>

            {/* Pegasus */}
            <div className="flex cursor-pointer items-center gap-4 rounded-3xl p-3 transition-colors hover:bg-slate-50">
              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                PE
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-bold text-slate-700">Pegasus</h3>
                  <span className="text-[12px] font-medium text-slate-400">08 May</span>
                </div>
                <p className="truncate text-[13px] text-slate-500">Uçuş destek paketiniz onaylan...</p>
              </div>
            </div>
            
            {/* Tofaş */}
            <div className="flex cursor-pointer items-center gap-4 rounded-3xl p-3 transition-colors hover:bg-slate-50">
              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-cyan-100 text-cyan-600 font-bold">
                TO
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-bold text-slate-700">Tofaş</h3>
                  <span className="text-[12px] font-medium text-slate-400">06 May</span>
                </div>
                <p className="truncate text-[13px] text-slate-500">Maç sonrası içerikler için...</p>
              </div>
            </div>

          </div>
        </aside>

        {/* SAĞ PANEL - SOHBET ALANI */}
        <main className="flex flex-1 flex-col overflow-hidden rounded-[2rem] bg-white shadow-sm h-full">
          {/* HEADER */}
          <header className="flex items-center justify-between border-b border-slate-100 p-6 z-10">
            <div className="flex items-center gap-4">
              <img src="https://ui-avatars.com/api/?name=MB&background=e0f2fe&color=0369a1" alt="MB" className="h-[52px] w-[52px] rounded-full object-cover" />
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
                  Murat Beslenme 
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    SPONSOR
                  </span>
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <p className="text-[13px] font-bold text-emerald-600">Çevrimiçi</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 text-slate-400">
              <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50 hover:text-slate-600 transition-colors hidden sm:flex"><Phone className="h-5 w-5" /></button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50 hover:text-slate-600 transition-colors hidden sm:flex"><Video className="h-5 w-5" /></button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50 hover:text-slate-600 transition-colors"><MoreVertical className="h-5 w-5" /></button>
            </div>
          </header>

          {/* MESAJLAR */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center pb-2">
              <span className="text-[12px] font-bold text-slate-400">Bugün</span>
            </div>
            
            {messages.map((m) => {
              const isMe = m.sender === "me";
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMe && (
                      <img src={m.avatar || "https://ui-avatars.com/api/?name=MB&background=e0f2fe&color=0369a1"} alt="avatar" className="h-10 w-10 rounded-full object-cover self-end mb-6" />
                    )}
                    <div className="flex flex-col gap-1.5">
                      <div className={`rounded-3xl px-6 py-4 text-[15px] leading-relaxed shadow-sm ${
                        isMe 
                          ? "rounded-br-sm bg-[#5B4DFF] text-white" 
                          : "rounded-bl-sm bg-white border border-slate-100 text-slate-700"
                      }`}>
                        {m.text}
                      </div>
                      <div className={`flex items-center gap-1.5 text-[12px] font-bold text-slate-400 ${isMe ? "justify-end" : "justify-start"}`}>
                        {m.time}
                        {isMe && m.status === "read" && <CheckCheck className="h-4 w-4 text-blue-500" />}
                        {isMe && m.status === "sent" && <CheckCheck className="h-4 w-4 text-slate-300" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INPUT ALANI */}
          <footer className="p-6 pt-2 z-10">
            <form onSubmit={handleSend} className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-2 pl-6 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all shadow-sm">
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Mesaj yazın..."
                className="flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!msg.trim()}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A29BFE] text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
              >
                <Send className="h-5 w-5 ml-1" />
              </button>
            </form>
          </footer>
        </main>
      </div>
    </AppShell>
  );
}
