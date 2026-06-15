import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";

const services = [
  {
    image: "/service-content.jpg",
    title: "serviceContent" as const,
    desc: "serviceContentDesc" as const,
  },
  {
    image: "/service-marketing.jpg",
    title: "serviceMarketing" as const,
    desc: "serviceMarketingDesc" as const,
  },
  {
    image: "/service-ai.jpg",
    title: "serviceAI" as const,
    desc: "serviceAIDesc" as const,
  },
  {
    image: "/service-script.jpg",
    title: "serviceScript" as const,
    desc: "serviceScriptDesc" as const,
  },
];

export default function Services() {
  const { lang, dir } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

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

  // Horizontal scroll via wheel
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    let isInView = false;

    const handleWheel = (e: WheelEvent) => {
      if (!isInView) return;

      const rect = wrapper.getBoundingClientRect();
      const isAtTop = rect.top <= 0;
      const maxScroll = content.scrollWidth - wrapper.clientWidth;

      if (isAtTop && maxScroll > 0) {
        const newScroll = dir === "rtl"
          ? content.scrollLeft + e.deltaY
          : content.scrollLeft + e.deltaY;

        const clampedScroll = dir === "rtl"
          ? Math.min(0, Math.max(-maxScroll, newScroll))
          : Math.max(0, Math.min(maxScroll, newScroll));

        content.scrollLeft = clampedScroll;

        const prog = maxScroll > 0 ? (dir === "rtl" ? -clampedScroll : clampedScroll) / maxScroll : 0;
        setProgress(Math.min(1, Math.max(0, prog)));

        if (prog > 0 && prog < 1) {
          e.preventDefault();
        }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(wrapper);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", handleWheel);
    };
  }, [dir]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full bg-black"
    >
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-24 lg:pt-32 pb-12">
        <div
          className={`transition-all duration-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span
            className="text-sm text-[#848B7D] uppercase tracking-[2px] mb-4 block"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            {t(lang, "servicesLabel")}
          </span>
          <h2
            className="text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4"
            style={{
              fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans",
              letterSpacing: "-1.5px",
            }}
          >
            {t(lang, "servicesHeading")}
          </h2>
          <p
            className="text-base text-white/70 max-w-[500px]"
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans", lineHeight: "1.65em" }}
          >
            {t(lang, "servicesIntro")}
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={wrapperRef}
        className="relative overflow-hidden"
        style={{ height: "70vh" }}
      >
        <div
          ref={contentRef}
          className="flex h-full overflow-x-auto scrollbar-hide"
          style={{ scrollBehavior: "auto" }}
        >
          {services.map((service, i) => (
            <article
              key={i}
              className={`flex-shrink-0 w-[85vw] lg:w-[80vw] h-full flex flex-col lg:flex-row items-center gap-8 px-6 lg:px-10 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              {/* Image */}
              <div className="w-full lg:w-3/5 h-[40vh] lg:h-full rounded-lg overflow-hidden">
                <img
                  src={service.image}
                  alt={t(lang, service.title)}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="w-full lg:w-2/5 flex flex-col justify-center">
                <span className="text-sm text-[#FF5252] uppercase tracking-wider mb-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight"
                  style={{
                    fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans",
                    letterSpacing: "-1px",
                  }}
                >
                  {t(lang, service.title)}
                </h3>
                <p
                  className="text-base text-white/70 leading-relaxed"
                  style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans", lineHeight: "1.65em" }}
                >
                  {t(lang, service.desc)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-0.5 bg-[#848B7D]/20">
        <div
          className="h-full bg-[#FF5252] transition-transform duration-100 origin-left"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div className="h-16" />
    </section>
  );
}
