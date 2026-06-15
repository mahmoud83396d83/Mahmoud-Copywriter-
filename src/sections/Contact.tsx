import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";
import { trpc } from "@/providers/trpc";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, Send, BookOpen } from "lucide-react";

export default function Contact() {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showGuestbook, setShowGuestbook] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formService, setFormService] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Guestbook state
  const [gbName, setGbName] = useState("");
  const [gbEmail, setGbEmail] = useState("");
  const [gbContent, setGbContent] = useState("");
  const [gbSuccess, setGbSuccess] = useState(false);

  const contactMutation = trpc.contact.submit.useMutation();
  const guestbookMutation = trpc.guestbook.create.useMutation();
  const utils = trpc.useUtils();

  const { data: guestbookMessages } = trpc.guestbook.list.useQuery();

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await contactMutation.mutateAsync({
        name: formName,
        email: formEmail,
        service: formService || undefined,
        message: formMessage,
      });
      setFormSuccess(true);
      setFormName("");
      setFormEmail("");
      setFormService("");
      setFormMessage("");
      setTimeout(() => setFormSuccess(false), 3000);
    } catch {
      // Error handling
    } finally {
      setFormLoading(false);
    }
  };

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await guestbookMutation.mutateAsync({
        name: gbName,
        email: gbEmail,
        content: gbContent,
      });
      setGbSuccess(true);
      setGbName("");
      setGbEmail("");
      setGbContent("");
      utils.guestbook.list.invalidate();
      setTimeout(() => setGbSuccess(false), 3000);
    } catch {
      // Error handling
    }
  };

  const contactInfo = [
    { icon: Mail, label: t(lang, "contactEmail"), value: "mahmoudbedox@gmail.com", href: "mailto:mahmoudbedox@gmail.com" },
    { icon: Phone, label: t(lang, "contactPhone"), value: "+201211303375", href: "tel:+201211303375" },
    { icon: MapPin, label: t(lang, "contactLocation"), value: t(lang, "locationValue"), href: undefined },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/mahmoud-ahmed-3b336534b", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/mcopywriterspro", label: "X" },
    { icon: Instagram, href: "https://www.instagram.com/mahmoudcontentpro", label: "Instagram" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-[#F2EFE6]"
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
            {t(lang, "contactLabel")}
          </span>
          <h2
            className="text-5xl lg:text-6xl font-bold text-black tracking-tight"
            style={{
              fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans",
              letterSpacing: "-1.5px",
            }}
          >
            {t(lang, "contactHeading")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div
            className={`transition-all duration-800 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Contact Info */}
            <div className="space-y-6 mb-10">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                    <item.icon size={18} className="text-[#848B7D]" />
                  </div>
                  <div>
                    <span
                      className="text-xs text-[#848B7D] uppercase tracking-wider block"
                      style={{ fontFamily: "Plus Jakarta Sans" }}
                    >
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-base text-black font-medium hover:text-[#FF5252] transition-colors"
                        style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span
                        className="text-base text-black font-medium"
                        style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                      >
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mb-10">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/60 hover:text-[#FF5252] hover:bg-[#FF5252]/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>

            {/* Guestbook Toggle */}
            <button
              onClick={() => setShowGuestbook(!showGuestbook)}
              className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#FF6B6B] transition-colors"
            >
              <BookOpen size={16} />
              {t(lang, "guestbookTitle")}
            </button>

            {/* Guestbook Form */}
            {showGuestbook && (
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <h3
                  className="text-lg font-bold text-black mb-4"
                  style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                >
                  {t(lang, "guestbookTitle")}
                </h3>

                <form onSubmit={handleGuestbookSubmit} className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder={t(lang, "guestbookName")}
                    value={gbName}
                    onChange={(e) => setGbName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#848B7D]/30 rounded-lg text-sm text-black bg-transparent focus:border-[#FF5252] focus:outline-none focus:ring-2 focus:ring-[#FF5252]/15 transition-all"
                  />
                  <input
                    type="email"
                    placeholder={t(lang, "guestbookEmail")}
                    value={gbEmail}
                    onChange={(e) => setGbEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#848B7D]/30 rounded-lg text-sm text-black bg-transparent focus:border-[#FF5252] focus:outline-none focus:ring-2 focus:ring-[#FF5252]/15 transition-all"
                  />
                  <textarea
                    placeholder={t(lang, "guestbookMessage")}
                    value={gbContent}
                    onChange={(e) => setGbContent(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-[#848B7D]/30 rounded-lg text-sm text-black bg-transparent focus:border-[#FF5252] focus:outline-none focus:ring-2 focus:ring-[#FF5252]/15 transition-all resize-none"
                  />
                  <button
                    type="submit"
                    disabled={guestbookMutation.isPending}
                    className="w-full py-3 bg-[#FF5252] text-white rounded-lg font-medium text-sm hover:bg-[#FF6B6B] transition-colors disabled:opacity-50"
                  >
                    {guestbookMutation.isPending ? "..." : t(lang, "guestbookSubmit")}
                  </button>
                  {gbSuccess && (
                    <p className="text-sm text-[#FF5252]">{t(lang, "guestbookSuccess")}</p>
                  )}
                </form>

                {/* Messages List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {guestbookMessages?.map((msg) => (
                    <div key={msg.id} className="p-3 bg-[#F2EFE6] rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-black">{msg.name}</span>
                        <span className="text-xs text-[#848B7D]">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-black/70">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Form */}
          <div
            className={`transition-all duration-800 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label
                    className="text-xs text-[#848B7D] uppercase tracking-wider mb-2 block"
                    style={{ fontFamily: "Plus Jakarta Sans" }}
                  >
                    {t(lang, "formName")}
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 border border-[#848B7D]/30 rounded-lg text-base text-black bg-transparent focus:border-[#FF5252] focus:outline-none focus:ring-[3px] focus:ring-[#FF5252]/15 transition-all"
                    style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                  />
                </div>

                <div>
                  <label
                    className="text-xs text-[#848B7D] uppercase tracking-wider mb-2 block"
                    style={{ fontFamily: "Plus Jakarta Sans" }}
                  >
                    {t(lang, "formEmail")}
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 border border-[#848B7D]/30 rounded-lg text-base text-black bg-transparent focus:border-[#FF5252] focus:outline-none focus:ring-[3px] focus:ring-[#FF5252]/15 transition-all"
                    style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                  />
                </div>

                <div>
                  <label
                    className="text-xs text-[#848B7D] uppercase tracking-wider mb-2 block"
                    style={{ fontFamily: "Plus Jakarta Sans" }}
                  >
                    {t(lang, "formService")}
                  </label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full px-4 py-3.5 border border-[#848B7D]/30 rounded-lg text-base text-black bg-transparent focus:border-[#FF5252] focus:outline-none focus:ring-[3px] focus:ring-[#FF5252]/15 transition-all"
                    style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                  >
                    <option value="">{t(lang, "formSelectService")}</option>
                    <option value="content">{t(lang, "serviceOptionContent")}</option>
                    <option value="marketing">{t(lang, "serviceOptionMarketing")}</option>
                    <option value="ai">{t(lang, "serviceOptionAI")}</option>
                    <option value="script">{t(lang, "serviceOptionScript")}</option>
                    <option value="other">{t(lang, "serviceOptionOther")}</option>
                  </select>
                </div>

                <div>
                  <label
                    className="text-xs text-[#848B7D] uppercase tracking-wider mb-2 block"
                    style={{ fontFamily: "Plus Jakarta Sans" }}
                  >
                    {t(lang, "formMessage")}
                  </label>
                  <textarea
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3.5 border border-[#848B7D]/30 rounded-lg text-base text-black bg-transparent focus:border-[#FF5252] focus:outline-none focus:ring-[3px] focus:ring-[#FF5252]/15 transition-all resize-none"
                    style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-4 bg-[#FF5252] text-white rounded-lg font-bold text-base hover:bg-[#FF6B6B] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                >
                  {formLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      {t(lang, "formSubmit")}
                    </>
                  )}
                </button>

                {formSuccess && (
                  <p
                    className="text-center text-[#FF5252] font-medium"
                    style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                  >
                    {t(lang, "formSuccess")}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
