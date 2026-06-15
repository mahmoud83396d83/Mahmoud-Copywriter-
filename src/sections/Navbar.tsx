import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/data/translations";
import { Menu, X, Shield } from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  const { lang, toggle } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = ["hero", "about", "works", "services", "testimonials", "contact"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { key: "navWorks" as const, target: "works" },
    { key: "navServices" as const, target: "services" },
    { key: "navContact" as const, target: "contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-[#848B7D]/15"
            : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => scrollTo("hero")}
            className="font-bold text-xl text-white hover:text-[#FF5252] transition-colors duration-300"
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
          >
            {t(lang, "brand")}
          </button>

          {/* Center Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className={`relative text-sm font-medium transition-colors duration-300 pb-1 ${
                  activeSection === link.target ? "text-white" : "text-[#848B7D] hover:text-white"
                }`}
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              >
                {t(lang, link.key)}
                {activeSection === link.target && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5252] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Admin Link */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 text-xs text-[#848B7D] hover:text-[#FF5252] transition-colors duration-300"
              >
                <Shield size={14} />
                {t(lang, "navAdmin")}
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <button
                onClick={logout}
                className="hidden md:block text-xs text-[#848B7D] hover:text-white transition-colors duration-300"
              >
                {t(lang, "navLogout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-xs text-[#848B7D] hover:text-white transition-colors duration-300"
              >
                {t(lang, "navLogin")}
              </Link>
            )}

            {/* Language Toggle */}
            <button
              onClick={toggle}
              className="px-4 py-1.5 text-xs border border-[#848B7D] rounded-full text-[#848B7D] hover:text-white hover:border-white transition-all duration-300"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            >
              {t(lang, "langToggle")}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#1A1A1A]">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6 text-white"
            >
              <X size={32} />
            </button>

            {navLinks.map((link, i) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="text-3xl font-bold text-white hover:text-[#FF5252] transition-colors duration-300"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              >
                <span className="text-[#848B7D] text-sm mr-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(lang, link.key)}
              </button>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-lg text-[#FF5252]"
              >
                <Shield size={18} />
                {t(lang, "navAdmin")}
              </Link>
            )}

            <button
              onClick={toggle}
              className="mt-8 px-6 py-2 border border-[#848B7D] rounded-full text-[#848B7D] hover:text-white hover:border-white transition-all duration-300"
            >
              {t(lang, "langToggle")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
