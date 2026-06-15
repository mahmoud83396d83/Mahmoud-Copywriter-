import { Link } from "react-router";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center">
        <h1
          className="text-8xl font-bold text-[#FF5252] mb-4"
          style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
        >
          404
        </h1>
        <p
          className="text-xl text-white/60 mb-8"
          style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
        >
          {lang === "ar" ? "الصفحة غير موجودة" : "Page not found"}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5252] text-white rounded-lg font-medium hover:bg-[#FF6B6B] transition-colors"
        >
          <ArrowLeft size={18} />
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
