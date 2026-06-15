import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/data/translations";
import { trpc } from "@/providers/trpc";
import {
  Users,
  Mail,
  BookOpen,
  MessageSquare,
  Trash2,
  CheckCircle,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Link } from "react-router";

export default function Admin() {
  const { lang } = useLanguage();
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [isLoading, user, isAdmin, navigate]);

  const { data: stats } = trpc.admin.stats.useQuery(undefined, {
    enabled: isAdmin,
  });

  const { data: contacts } = trpc.contact.list.useQuery(undefined, {
    enabled: isAdmin,
  });

  const { data: guestbookMessages } = trpc.guestbook.list.useQuery(undefined, {
    enabled: isAdmin,
  });

  const utils = trpc.useUtils();

  const deleteContactMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      utils.contact.stats.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  const updateContactStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      utils.contact.list.invalidate();
      utils.contact.stats.invalidate();
    },
  });

  const deleteGuestbookMutation = trpc.guestbook.delete.useMutation({
    onSuccess: () => {
      utils.guestbook.list.invalidate();
      utils.admin.stats.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF5252] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const statCards = [
    {
      label: t(lang, "adminTotalUsers"),
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "#FF5252",
    },
    {
      label: t(lang, "adminTotalContacts"),
      value: stats?.totalContacts ?? 0,
      icon: Mail,
      color: "#848B7D",
    },
    {
      label: t(lang, "adminTotalGuestbook"),
      value: stats?.totalMessages ?? 0,
      icon: BookOpen,
      color: "#F2EFE6",
    },
    {
      label: t(lang, "adminTotalChats"),
      value: stats?.totalChatSessions ?? 0,
      icon: MessageSquare,
      color: "#FF5252",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#848B7D] hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#FF5252]" />
            <h1
              className="text-lg font-bold"
              style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
            >
              {t(lang, "adminTitle")}
            </h1>
          </div>
        </div>
        <span className="text-xs text-[#848B7D]">
          {user?.name}
        </span>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-xl p-5 border border-white/5"
            >
              <div className="flex items-center justify-between mb-3">
                <card.icon size={20} style={{ color: card.color }} />
                <span
                  className="text-2xl font-bold"
                  style={{ color: card.color, fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
                >
                  {card.value}
                </span>
              </div>
              <span
                className="text-xs text-[#848B7D] uppercase tracking-wider"
                style={{ fontFamily: "Plus Jakarta Sans" }}
              >
                {card.label}
              </span>
            </div>
          ))}
        </div>

        {/* Contact Messages Table */}
        <div className="mb-10">
          <h2
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
          >
            <Mail size={18} className="text-[#FF5252]" />
            {t(lang, "adminContacts")}
          </h2>

          <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
            {contacts && contacts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">{t(lang, "formName")}</th>
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">{t(lang, "formService")}</th>
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">Message</th>
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">{t(lang, "adminActions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-b border-white/5 hover:bg-[#FF5252]/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">{contact.name}</td>
                        <td className="px-4 py-3 text-sm text-[#848B7D]">{contact.email}</td>
                        <td className="px-4 py-3 text-sm text-[#848B7D]">{contact.service || "-"}</td>
                        <td className="px-4 py-3 text-sm text-[#848B7D] max-w-[200px] truncate">{contact.message}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                              contact.status === "new"
                                ? "bg-[#FF5252]/20 text-[#FF5252]"
                                : "bg-[#848B7D]/20 text-[#848B7D]"
                            }`}
                          >
                            {contact.status === "new" ? t(lang, "adminStatusNew") : t(lang, "adminStatusReplied")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {contact.status === "new" && (
                              <button
                                onClick={() =>
                                  updateContactStatusMutation.mutate({
                                    id: contact.id,
                                    status: "replied",
                                  })
                                }
                                className="text-[#848B7D] hover:text-[#FF5252] transition-colors"
                                title="Mark as replied"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteContactMutation.mutate({ id: contact.id })}
                              className="text-[#848B7D] hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-[#848B7D]">
                {t(lang, "adminNoData")}
              </div>
            )}
          </div>
        </div>

        {/* Guestbook Messages Table */}
        <div>
          <h2
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ fontFamily: lang === "ar" ? "Almarai" : "Plus Jakarta Sans" }}
          >
            <BookOpen size={18} className="text-[#FF5252]" />
            {t(lang, "adminGuestbook")}
          </h2>

          <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
            {guestbookMessages && guestbookMessages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">{t(lang, "guestbookName")}</th>
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">{t(lang, "guestbookMessage")}</th>
                      <th className="px-4 py-3 text-left text-xs text-[#848B7D] uppercase tracking-wider">{t(lang, "adminActions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestbookMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        className="border-b border-white/5 hover:bg-[#FF5252]/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm">{msg.name}</td>
                        <td className="px-4 py-3 text-sm text-[#848B7D]">{msg.email}</td>
                        <td className="px-4 py-3 text-sm text-[#848B7D] max-w-[300px] truncate">{msg.content}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteGuestbookMutation.mutate({ id: msg.id })}
                            className="text-[#848B7D] hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-[#848B7D]">
                {t(lang, "adminNoData")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
