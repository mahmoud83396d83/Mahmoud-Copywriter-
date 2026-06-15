import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";
import { Phone, Send } from "lucide-react";

export default function FloatingButtons() {
  const { lang } = useLanguage();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href="https://wa.me/201211303375"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2"
        aria-label="WhatsApp"
      >
        <span
          className="px-3 py-1.5 bg-[#1A1A1A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
          style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
        >
          {t(lang, "whatsappLabel")}
        </span>
        <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
          <Phone size={20} className="text-white" />
        </div>
      </a>

      {/* Telegram */}
      <a
        href="https://t.me/+201211303375"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2"
        aria-label="Telegram"
      >
        <span
          className="px-3 py-1.5 bg-[#1A1A1A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
          style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
        >
          {t(lang, "telegramLabel")}
        </span>
        <div className="w-12 h-12 rounded-full bg-[#0088CC] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
          <Send size={20} className="text-white" />
        </div>
      </a>
    </div>
  );
}
