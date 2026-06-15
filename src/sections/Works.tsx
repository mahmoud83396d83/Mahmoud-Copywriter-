import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";

const works = [
  {
    id: 1,
    title: { ar: "حملة تسويقية — شركة ناشئة", en: "Marketing Campaign — Startup" },
    category: "marketing",
    image: "/work-1.jpg",
  },
  {
    id: 2,
    title: { ar: "كتابة محتوى — علامة تجارية", en: "Content Writing — Brand" },
    category: "writing",
    image: "/work-2.jpg",
  },
  {
    id: 3,
    title: { ar: "سيناريو فيديو — منتج تقني", en: "Video Script — Tech Product" },
    category: "script",
    image: "/work-3.jpg",
  },
  {
    id: 4,
    title: { ar: "حملة سوشيال ميديا — مطعم", en: "Social Media — Restaurant" },
    category: "marketing",
    image: "/work-4.jpg",
  },
  {
    id: 5,
    title: { ar: "كتابة إبداعية — مجلة", en: "Creative Writing — Magazine" },
    category: "writing",
    image: "/work-5.jpg",
  },
  {
    id: 6,
    title: { ar: "تصميم هوية — متجر إلكتروني", en: "Brand Identity — E-commerce" },
    category: "design",
    image: "/work-6.jpg",
  },
  {
    id: 7,
    title: { ar: "سيناريو إعلاني — تطبيق", en: "Ad Script — App" },
    category: "script",
    image: "/work-7.jpg",
  },
  {
    id: 8,
    title: { ar: "محتوى تعليمي — منصة", en: "Educational Content — Platform" },
    category: "writing",
    image: "/work-8.jpg",
  },
];

const filters = ["all", "marketing", "writing", "script", "design"] as const;

export default function Works() {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

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

  const filteredWorks = activeFilter === "all"
    ? works
    : works.filter((w) => w.category === activeFilter);

  const filterLabels: Record<string, string> = {
    all: t(lang, "filterAll"),
    marketing: t(lang, "filterMarketing"),
    writing: t(lang, "filterWriting"),
    script: t(lang, "filterScript"),
    design: t(lang, "filterDesign"),
  };

  return (
    <section
      id="works"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-black"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span
            className="text-sm text-[#848B7D] uppercase tracking-[2px] mb-4 block"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            {t(lang, "worksLabel")}
          </span>
          <h2
            className="text-5xl lg:text-6xl font-bold text-white tracking-tight"
            style={{
              fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans",
              letterSpacing: "-1.5px",
            }}
          >
            {t(lang, "worksHeading")}
          </h2>
        </div>

        {/* Filter Row */}
        <div
          className={`flex flex-wrap gap-3 mb-10 transition-all duration-800 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === f
                  ? "bg-[#FF5252] text-white"
                  : "border border-[#848B7D] text-[#848B7D] hover:text-white hover:border-white"
              }`}
              style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredWorks.map((work, i) => (
            <div
              key={work.id}
              className={`group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={work.image}
                  alt={work.title[lang]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xs text-[#FF5252] uppercase tracking-wider mb-1 block">
                  {filterLabels[work.category]}
                </span>
                <h3
                  className="text-sm font-bold text-white"
                  style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                >
                  {work.title[lang]}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
