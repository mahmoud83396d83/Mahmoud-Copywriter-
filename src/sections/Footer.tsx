import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";
import { Linkedin, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const { lang } = useLanguage();

  const quickLinks = [
    { label: t(lang, "navWorks"), target: "works" },
    { label: t(lang, "navServices"), target: "services" },
    { label: t(lang, "navContact"), target: "contact" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/mahmoud-ahmed-3b336534b", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/mcopywriterspro", label: "X" },
    { icon: Instagram, href: "https://www.instagram.com/mahmoudcontentpro", label: "Instagram" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-black pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <span
              className="text-3xl font-bold text-white block mb-3"
              style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
            >
              {t(lang, "brand")}
            </span>
            <p
              className="text-sm text-white/60"
              style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
            >
              {t(lang, "footerTagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm text-white/40 uppercase tracking-wider mb-4"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              {t(lang, "footerLinks")}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => scrollTo(link.target)}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              className="text-sm text-white/40 uppercase tracking-wider mb-4"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              {t(lang, "footerSocial")}
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#848B7D]/15 mb-6" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-white/40"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            {t(lang, "footerCopyright")}
          </p>
          <p
            className="text-xs text-white/40"
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
          >
            {t(lang, "footerMadeIn")}
          </p>
        </div>
      </div>
    </footer>
  );
}
