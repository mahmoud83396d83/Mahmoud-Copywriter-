import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";

export default function About() {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { num: "7+", label: t(lang, "statYears") },
    { num: "150+", label: t(lang, "statClients") },
    { num: "300+", label: t(lang, "statProjects") },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-[#F2EFE6]"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div
            className={`transition-all duration-800 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span
              className="text-sm text-[#848B7D] uppercase tracking-[2px] mb-4 block"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              {t(lang, "aboutLabel")}
            </span>

            <h2
              className="text-5xl lg:text-6xl font-bold text-black mb-8 tracking-tight"
              style={{
                fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans",
                letterSpacing: "-1.5px",
              }}
            >
              {t(lang, "aboutHeading")}
            </h2>

            <div className="space-y-5 max-w-[480px]">
              <p
                className="text-base text-black/80 leading-relaxed"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans", lineHeight: "1.65em" }}
              >
                {t(lang, "aboutP1")}
              </p>
              <p
                className="text-base text-black/80 leading-relaxed"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans", lineHeight: "1.65em" }}
              >
                {t(lang, "aboutP2")}
              </p>
              <p
                className="text-base text-black/80 leading-relaxed"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans", lineHeight: "1.65em" }}
              >
                {t(lang, "aboutP3")}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div
            className={`flex flex-col items-center lg:items-start transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative w-full max-w-[400px] rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <img
                src="/portrait-mahmoud.jpg"
                alt="Mahmoud"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <span
                    className="text-3xl lg:text-4xl font-bold text-[#FF5252] block"
                    style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                  >
                    {stat.num}
                  </span>
                  <span
                    className="text-xs text-[#848B7D] mt-1 block"
                    style={{ fontFamily: "Plus Jakarta Sans" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
