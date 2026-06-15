import { useState } from "react";
import { Link } from "react-router";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";
import { trpc } from "@/providers/trpc";
import { LogIn, ArrowLeft, User, Lock, Mail, UserCircle } from "lucide-react";

function getOAuthUrl() {
  const authUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${authUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register form
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDisplayName, setRegDisplayName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regError, setRegError] = useState("");

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => {
      setLoginError(err.message);
    },
  });

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => {
      setRegError(err.message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    loginMutation.mutate({
      username: loginUsername,
      password: loginPassword,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    registerMutation.mutate({
      username: regUsername,
      password: regPassword,
      displayName: regDisplayName || undefined,
      email: regEmail || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#848B7D] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span
            className="text-sm"
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
          >
            {t(lang, "loginBack")}
          </span>
        </Link>

        {/* Brand */}
        <div className="text-center mb-10">
          <span
            className="text-3xl font-bold text-white"
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
          >
            {t(lang, "brand")}
          </span>
        </div>

        {/* OAuth Login */}
        <a
          href={getOAuthUrl()}
          className="w-full py-3.5 bg-white/5 border border-white/10 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors mb-6"
          style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
        >
          <LogIn size={18} />
          {t(lang, "loginOAuth")}
        </a>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-[#848B7D] uppercase tracking-wider">
            {t(lang, "loginLocalTitle")}
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Mode Toggle */}
        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => { setMode("login"); setLoginError(""); }}
            className={`flex-1 py-2 text-sm rounded-md transition-all ${
              mode === "login"
                ? "bg-[#FF5252] text-white"
                : "text-[#848B7D] hover:text-white"
            }`}
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
          >
            {t(lang, "loginTitle")}
          </button>
          <button
            onClick={() => { setMode("register"); setRegError(""); }}
            className={`flex-1 py-2 text-sm rounded-md transition-all ${
              mode === "register"
                ? "bg-[#FF5252] text-white"
                : "text-[#848B7D] hover:text-white"
            }`}
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
          >
            {t(lang, "registerTitle")}
          </button>
        </div>

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848B7D]" />
              <input
                type="text"
                placeholder={t(lang, "loginUsername")}
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5252]/50 transition-colors"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848B7D]" />
              <input
                type="password"
                placeholder={t(lang, "loginPassword")}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5252]/50 transition-colors"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              />
            </div>

            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3.5 bg-[#FF5252] text-white rounded-lg font-bold hover:bg-[#FF6B6B] transition-colors disabled:opacity-50"
              style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
            >
              {loginMutation.isPending ? "..." : t(lang, "loginButton")}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848B7D]" />
              <input
                type="text"
                placeholder={t(lang, "loginUsername")}
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5252]/50 transition-colors"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848B7D]" />
              <input
                type="password"
                placeholder={t(lang, "loginPassword")}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5252]/50 transition-colors"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              />
            </div>
            <div className="relative">
              <UserCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848B7D]" />
              <input
                type="text"
                placeholder={t(lang, "registerDisplayName")}
                value={regDisplayName}
                onChange={(e) => setRegDisplayName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5252]/50 transition-colors"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848B7D]" />
              <input
                type="email"
                placeholder={t(lang, "registerEmail")}
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF5252]/50 transition-colors"
                style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
              />
            </div>

            {regError && (
              <p className="text-sm text-red-400">{regError}</p>
            )}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3.5 bg-[#FF5252] text-white rounded-lg font-bold hover:bg-[#FF6B6B] transition-colors disabled:opacity-50"
              style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
            >
              {registerMutation.isPending ? "..." : t(lang, "registerButton")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
