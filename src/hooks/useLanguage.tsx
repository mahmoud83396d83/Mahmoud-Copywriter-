import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  dir: "rtl" | "ltr";
  toggle: () => void;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  dir: "rtl",
  toggle: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("mahmoud-lang");
    return (saved as Language) || "ar";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("mahmoud-lang", lang);
  }, [lang, dir]);

  const toggle = useCallback(() => {
    setLangState((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, dir, toggle, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
