import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";
import { trpc } from "@/providers/trpc";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.send.useMutation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    try {
      const result = await chatMutation.mutateAsync({
        message: userMsg,
        sessionId,
      });

      if (!sessionId) {
        setSessionId(result.sessionId);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: result.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            lang === "ar"
              ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
              : "Sorry, an error occurred. Please try again.",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-[#1A1A1A] text-white rotate-0"
            : "bg-[#FF5252] text-white hover:bg-[#FF6B6B] hover:scale-110"
        }`}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-[360px] max-h-[500px] bg-[#1A1A1A] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF5252]/20 flex items-center justify-center">
              <Bot size={16} className="text-[#FF5252]" />
            </div>
            <div>
              <h4
                className="text-sm font-bold text-white"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              >
                {t(lang, "chatTitle")}
              </h4>
              <span className="text-xs text-[#848B7D]">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px] max-h-[350px]">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot size={32} className="text-[#848B7D] mx-auto mb-3" />
                <p
                  className="text-sm text-[#848B7D]"
                  style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                >
                  {t(lang, "chatWelcome")}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-[#FF5252]/20"
                      : "bg-[#848B7D]/20"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={12} className="text-[#FF5252]" />
                  ) : (
                    <Bot size={12} className="text-[#848B7D]" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#FF5252] text-white rounded-tr-none"
                      : "bg-white/10 text-white/90 rounded-tl-none"
                  }`}
                  style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#848B7D]/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-[#848B7D]" />
                </div>
                <div className="bg-white/10 rounded-lg rounded-tl-none px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[#848B7D] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[#848B7D] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[#848B7D] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t(lang, "chatPlaceholder")}
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5252]/50 transition-colors"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                className="w-9 h-9 rounded-lg bg-[#FF5252] flex items-center justify-center text-white hover:bg-[#FF6B6B] transition-colors disabled:opacity-30"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
