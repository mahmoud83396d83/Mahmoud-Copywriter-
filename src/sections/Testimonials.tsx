import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: {
      ar: "محمود ليس مجرد كاتب، بل شريك استراتيجي. حوّل رؤيتنا إلى محتوى يتحدث بصوت علامتنا",
      en: "Mahmoud is not just a writer, but a strategic partner. He transformed our vision into content that speaks our brand's voice",
    },
    author: { ar: "أحمد الخالدي", en: "Ahmed Al-Khalidi" },
    role: { ar: "مؤسس، تطبيق طلبات", en: "Founder, Food Delivery App" },
    avatar: "/avatar-1.jpg",
  },
  {
    quote: {
      ar: "الجودة والسرعة والاحترافية — ثلاث صفات نادراً ما تجتمع. محمود يجمعها كلها",
      en: "Quality, speed, and professionalism — three qualities rarely found together. Mahmoud has them all",
    },
    author: { ar: "سارة المنصوري", en: "Sara Al-Mansoori" },
    role: { ar: "مديرة تسويق، شركة تقنية", en: "Marketing Director, Tech Company" },
    avatar: "/avatar-2.jpg",
  },
  {
    quote: {
      ar: "تعاملنا مع محمود في أكثر من مشروع، والنتيجة كانت ممتازة دائماً. يفهم السوق العربي بعمق",
      en: "We've worked with Mahmoud on multiple projects, and the results were always excellent. He deeply understands the Arab market",
    },
    author: { ar: "خالد الرفاعي", en: "Khaled Al-Rifai" },
    role: { ar: "صاحب متجر إلكتروني", en: "E-commerce Store Owner" },
    avatar: "/avatar-3.jpg",
  },
  {
    quote: {
      ar: "المحتوى الذي كتبه محمود ضاعف تفاعل جمهورنا ثلاث مرات. أنصح به بشدة",
      en: "The content Mahmoud wrote tripled our audience engagement. Highly recommended",
    },
    author: { ar: "نورا الهاشمي", en: "Nora Al-Hashimi" },
    role: { ar: "مؤثرة، منصة يوتيوب", en: "Content Creator, YouTube" },
    avatar: "/avatar-4.jpg",
  },
  {
    quote: {
      ar: "أفضل استثمار قمنا به هذا العام. محمود يجلب قيمة حقيقية لكل كلمة يكتبها",
      en: "The best investment we made this year. Mahmoud brings real value to every word he writes",
    },
    author: { ar: "يوسف العنزي", en: "Yousef Al-Anzi" },
    role: { ar: "مدير عام، وكالة إعلانات", en: "General Manager, Ad Agency" },
    avatar: "/avatar-5.jpg",
  },
];

export default function Testimonials() {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate cards
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-[#F2EFE6]"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span
            className="text-sm text-[#848B7D] uppercase tracking-[2px] mb-4 block"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            {t(lang, "testimonialsLabel")}
          </span>
          <h2
            className="text-5xl lg:text-6xl font-bold text-black tracking-tight"
            style={{
              fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans",
              letterSpacing: "-1.5px",
            }}
          >
            {t(lang, "testimonialsHeading")}
          </h2>
        </div>

        {/* Cards Stack */}
        <div className="relative max-w-[800px] mx-auto" style={{ minHeight: "400px" }}>
          {testimonials.map((testimonial, i) => {
            const isActive = i === activeCard;
            const isPast = i < activeCard;
            const offset = isPast ? -(activeCard - i) * 8 : isActive ? 0 : (i - activeCard) * 20;
            const scale = isActive ? 1 : 0.92;
            const brightness = isActive ? 1 : 0.65;

            return (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ease-out cursor-pointer ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transform: `translateY(${offset}px) scale(${scale})`,
                  filter: `brightness(${brightness})`,
                  zIndex: testimonials.length - Math.abs(i - activeCard),
                  transitionDelay: `${i * 50}ms`,
                }}
                onClick={() => setActiveCard(i)}
              >
                <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.06)] h-full">
                  <Quote className="w-10 h-10 text-[#FF5252] mb-6 opacity-60" />

                  <p
                    className="text-xl lg:text-2xl text-black/80 leading-relaxed mb-8"
                    style={{
                      fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans",
                      lineHeight: "1.6em",
                    }}
                  >
                    &ldquo;{testimonial.quote[lang]}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author[lang]}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h4
                        className="font-bold text-black"
                        style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                      >
                        {testimonial.author[lang]}
                      </h4>
                      <span
                        className="text-sm text-[#848B7D]"
                        style={{ fontFamily: "Plus Jakarta Sans" }}
                      >
                        {testimonial.role[lang]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveCard(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeCard ? "w-8 bg-[#FF5252]" : "bg-[#848B7D]/40 hover:bg-[#848B7D]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
