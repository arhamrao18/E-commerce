import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Sparkles, Search, Plus, MessageSquare } from "lucide-react";
import { aiSuggestedPrompts } from "../../data/adminExtra";

const HISTORY = [
  { id: "c1", title: "Restock recommendations for July", time: "Today" },
  { id: "c2", title: "Why did returns spike last week?", time: "Yesterday" },
  { id: "c3", title: "Draft description: Ridge Wool Blanket", time: "3 days ago" },
  { id: "c4", title: "Customer churn risk summary", time: "1 week ago" },
];

function canned(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("revenue")) {
    return "Revenue this week is **$27,950**, up **12.4%** from last week. The Audio and Apparel categories drove most of the gain — Aria Open-Ear Headphones alone accounts for 18% of weekly revenue.\n\n*This is a placeholder response. Once connected to the n8n workflow, this will pull live figures from the orders database.*";
  }
  if (p.includes("stock") || p.includes("restock")) {
    return "Based on current velocity, **5 products** are projected to stock out within 14 days:\n\n- Aria Open-Ear Headphones — 6 days\n- Orbit Wireless Charger — 9 days\n- Canvas Overshirt (M) — 11 days\n\nRecommend restocking these first.\n\n*Placeholder data — real forecasting arrives with the AI Inventory Prediction workflow.*";
  }
  if (p.includes("description")) {
    return "Here's a draft:\n\n> A tight merino-blend weave holds warmth without adding weight. Whipped edges, no fringe, generously sized for two — equally at home at the foot of a bed or spread across a picnic blanket.\n\nWant a shorter version for the product card, or a longer one for the detail page?";
  }
  if (p.includes("churn") || p.includes("90")) {
    return "**14 customers** haven't ordered in 90+ days but previously averaged 3+ orders. Their combined lifetime value is **$4,210**. A win-back email with a 15% incentive is a reasonable next step.\n\n*Placeholder — will connect to real customer activity data.*";
  }
  if (p.includes("discount") || p.includes("slow")) {
    return "Ridge Wool Blanket and Basin Ceramic Planter are trending toward **slow-moving** status. A 15–20% discount over the next 2 weeks would likely clear excess stock without eroding margin too heavily.\n\n*Placeholder recommendation.*";
  }
  return "Got it — once this workspace is wired up to the n8n automation layer, I'll pull real data from your store to answer that. For now this is a UI preview of how responses will render, including **markdown**, lists, and quoted excerpts.";
}

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I'm your store's AI assistant. Ask me about sales, inventory, customers, or have me draft content. I'm running on placeholder logic for now — this workspace is wired up and ready for the n8n integration." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const prompt = (text ?? input).trim();
    if (!prompt) return;
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: canned(prompt) }]);
      setTyping(false);
    }, 900 + Math.random() * 500);
  };

  return (
    <div className="flex h-[calc(100vh-116px)] gap-5 lg:h-[calc(100vh-80px)]">
      {/* History sidebar */}
      <div className={`${sidebarOpen ? "fixed inset-0 z-40 bg-ink/40 lg:static lg:bg-transparent" : "hidden"} lg:flex lg:w-64 lg:shrink-0`} onClick={() => setSidebarOpen(false)}>
        <div onClick={(e) => e.stopPropagation()} className="flex h-full w-64 flex-col rounded-3xl glass p-4 shadow-glass lg:w-full">
          <button className="flex items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-sm font-semibold text-porcelain">
            <Plus size={15} /> New chat
          </button>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-ink/10 bg-white/50 px-3 py-2">
            <Search size={14} className="text-ink/40" />
            <input placeholder="Search chats…" className="w-full bg-transparent text-xs focus:outline-none" />
          </div>
          <div className="mt-4 flex-1 space-y-1 overflow-y-auto">
            {HISTORY.map((h) => (
              <button key={h.id} className="flex w-full items-start gap-2 rounded-xl px-3 py-2.5 text-left hover:bg-white/50">
                <MessageSquare size={14} className="mt-0.5 shrink-0 text-ink/35" />
                <span>
                  <span className="block text-xs text-ink/80">{h.title}</span>
                  <span className="block font-mono text-[10px] text-ink/35">{h.time}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex flex-1 flex-col rounded-4xl glass-dark shadow-glass-lg">
        <div className="flex items-center justify-between border-b border-porcelain/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"><Sparkles size={16} /></span>
            <div>
              <p className="font-display text-lg text-porcelain">Store Assistant</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-porcelain/35">AI-ready · n8n webhook pending</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="rounded-full bg-white/5 px-3 py-1.5 font-mono text-[11px] text-porcelain/60 lg:hidden">
            History
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] whitespace-pre-line rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-emerald-500 text-ink" : "bg-white/8 text-porcelain/90"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-3xl bg-white/8 px-5 py-3.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-porcelain/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-6 pb-3">
            {aiSuggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-porcelain/15 px-3.5 py-2 text-left text-xs text-porcelain/70 hover:bg-white/5"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-3 border-t border-porcelain/10 p-4"
        >
          <button type="button" aria-label="Attach file" className="flex h-10 w-10 items-center justify-center rounded-full text-porcelain/40 hover:bg-white/5 hover:text-porcelain">
            <Paperclip size={17} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sales, inventory, customers…"
            className="flex-1 rounded-full bg-white/5 px-5 py-3 text-sm text-porcelain placeholder:text-porcelain/35 focus:outline-none"
          />
          <button type="submit" aria-label="Send" className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-ink hover:bg-emerald-400">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
