import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiMail,
  FiSend,
  FiSearch,
  FiPlus,
  FiX,
  FiTrash2,
  FiLoader,
  FiArrowLeft,
  FiUser,
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiCornerUpLeft,
  FiInbox,
} from "react-icons/fi";

const BASE = "https://helwalrabee.com/api";
const TOKEN = "LgIX4I1w7eGBy0nyIwQH2tZs6pyBHqRxxMLG0FnZfe32d748";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

function safeArr(v) {
  return Array.isArray(v)
    ? v
    : Array.isArray(v?.data)
      ? v.data
      : Array.isArray(v?.data?.data)
        ? v.data.data
        : [];
}

async function authedFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...HEADERS, ...(options.headers ?? {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const msg = json.message ?? `Request failed (${res.status})`;
    const errs = json.errors ? Object.values(json.errors).flat().join(" ") : "";
    throw new Error(errs ? `${msg}: ${errs}` : msg);
  }
  return json;
}

function fmtDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
function fmtRelative(d) {
  if (!d) return "—";
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return fmtDateTime(d);
}

const TYPE_CONFIG = {
  general: { label: "General", color: "text-slate-600", bg: "bg-slate-100" },
  academic: { label: "Academic", color: "text-blue-600", bg: "bg-blue-50" },
  behavioral: {
    label: "Behavioral",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  attendance: {
    label: "Attendance",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  urgent: { label: "Urgent", color: "text-red-600", bg: "bg-red-50" },
};
const TYPES = Object.keys(TYPE_CONFIG);

const STATUS_CONFIG = {
  sent: { label: "Sent", color: "text-slate-500", bg: "bg-slate-100" },
  unread: { label: "Unread", color: "text-blue-600", bg: "bg-blue-50" },
  read: { label: "Read", color: "text-green-600", bg: "bg-green-50" },
  replied: { label: "Replied", color: "text-purple-600", bg: "bg-purple-50" },
};

// ── Compose Modal ────────────────────────────────────────────────────────────
function ComposeModal({ onClose, onSent, replyTo }) {
  const [parentSearch, setParentSearch] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: replyTo
      ? {
          receiver_id: replyTo.sender?.id ?? "",
          subject: `Re: ${replyTo.subject ?? ""}`,
          type: replyTo.type ?? "general",
          reply_to: replyTo.id,
        }
      : { type: "general" },
  });

  const receiverId = watch("receiver_id");

  const { data: parentsData, isLoading: parentsLoading } = useQuery({
    queryKey: ["available-parents", parentSearch],
    queryFn: () =>
      authedFetch(
        `${BASE}/teacher/messages/parents/available${parentSearch ? `?search=${encodeURIComponent(parentSearch)}` : ""}`,
      ),
    enabled: !replyTo,
  });
  const parents = safeArr(parentsData?.data);

  const sendMutation = useMutation({
    mutationFn: (formData) =>
      authedFetch(`${BASE}/teacher/messages`, {
        method: "POST",
        body: JSON.stringify({
          receiver_id: Number(formData.receiver_id),
          student_id: formData.student_id ? Number(formData.student_id) : null,
          subject: formData.subject,
          content: formData.content,
          type: formData.type,
          reply_to: formData.reply_to ?? null,
        }),
      }),
    onSuccess: () => {
      toast.success("Message sent");
      onSent();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="font-bold text-slate-800">
            {replyTo ? "Reply to Message" : "New Message"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((d) => sendMutation.mutate(d))}
          className="p-6 space-y-4"
        >
          {!replyTo && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                To (Parent)
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  value={parentSearch}
                  onChange={(e) => setParentSearch(e.target.value)}
                  placeholder="Search parents by name or email..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
              <div className="mt-2 max-h-40 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                {parentsLoading ? (
                  <div className="py-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" size={12} /> Loading
                    parents...
                  </div>
                ) : parents.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-xs">
                    No parents found.
                  </div>
                ) : (
                  parents.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setValue("receiver_id", p.id)}
                      className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors
                        ${Number(receiverId) === p.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {p.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {p.email}
                        </p>
                      </div>
                      {Number(receiverId) === p.id && (
                        <FiCheck className="text-blue-500 shrink-0" size={16} />
                      )}
                    </button>
                  ))
                )}
              </div>
              <input
                type="hidden"
                {...register("receiver_id", { required: true })}
              />
              {errors.receiver_id && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a parent
                </p>
              )}
            </div>
          )}

          {replyTo && (
            <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                {replyTo.sender?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {replyTo.sender?.name}
                </p>
                <p className="text-xs text-slate-400">
                  Replying to this conversation
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Student ID (optional)
            </label>
            <input
              type="number"
              {...register("student_id")}
              placeholder="Link this message to a student"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_CONFIG[t].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Subject
            </label>
            <input
              {...register("subject", { required: true })}
              placeholder="Message subject"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">Subject is required</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Message
            </label>
            <textarea
              {...register("content", { required: true })}
              rows={5}
              placeholder="Write your message..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">
                Message content is required
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sendMutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sendMutation.isPending ? (
                <FiLoader className="animate-spin" size={14} />
              ) : (
                <FiSend size={14} />
              )}
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Thread Detail ────────────────────────────────────────────────────────────
function MessageThread({ messageId, onBack, onChanged }) {
  const queryClient = useQueryClient();
  const [showReply, setShowReply] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["message-detail", messageId],
    queryFn: () => authedFetch(`${BASE}/teacher/messages/${messageId}`),
  });
  const message = data?.data ?? null;

  const markReadMutation = useMutation({
    mutationFn: () =>
      authedFetch(`${BASE}/teacher/messages/${messageId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "read" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      onChanged();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      authedFetch(`${BASE}/teacher/messages/${messageId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Message deleted");
      queryClient.invalidateQueries({ queryKey: ["teacher-messages"] });
      onChanged();
      onBack();
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <FiLoader className="text-blue-500 text-3xl animate-spin" />
      </div>
    );
  }

  const typeCfg = TYPE_CONFIG[message?.type] ?? TYPE_CONFIG.general;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Inbox
        </button>
        <div className="flex items-center gap-2">
          {message?.status !== "read" && (
            <button
              onClick={() => markReadMutation.mutate()}
              disabled={markReadMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100 transition-colors"
            >
              <FiCheckCircle size={12} /> Mark as Read
            </button>
          )}
          <button
            onClick={() => {
              if (confirm("Delete this message?")) deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors"
          >
            {deleteMutation.isPending ? (
              <FiLoader className="animate-spin" size={12} />
            ) : (
              <FiTrash2 size={12} />
            )}
            Delete
          </button>
        </div>
      </div>

      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                {message?.sender?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {message?.sender?.name}
                </p>
                <p className="text-xs text-slate-400">
                  to {message?.receiver?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeCfg.bg} ${typeCfg.color}`}
              >
                {typeCfg.label}
              </span>
              <span className="text-xs text-slate-400">
                {fmtDateTime(message?.created_at)}
              </span>
            </div>
          </div>
          <h1 className="text-lg font-bold text-slate-800 mb-3">
            {message?.subject}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
            {message?.content}
          </p>
        </div>

        {(message?.replies ?? []).length > 0 && (
          <div className="space-y-3 mb-4">
            {message.replies.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-sm p-5 ml-8 border-l-4 border-blue-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                      {r.sender?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <p className="text-sm font-medium text-slate-800">
                      {r.sender?.name}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {fmtDateTime(r.created_at)}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {r.content}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowReply(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <FiCornerUpLeft size={14} /> Reply
        </button>
      </div>

      {showReply && (
        <ComposeModal
          replyTo={message}
          onClose={() => setShowReply(false)}
          onSent={() => {
            queryClient.invalidateQueries({
              queryKey: ["message-detail", messageId],
            });
            queryClient.invalidateQueries({ queryKey: ["teacher-messages"] });
          }}
        />
      )}
    </div>
  );
}

// ── Inbox List Row ───────────────────────────────────────────────────────────
function MessageRow({ message, onOpen }) {
  const typeCfg = TYPE_CONFIG[message.type] ?? TYPE_CONFIG.general;
  const statusCfg = STATUS_CONFIG[message.status] ?? STATUS_CONFIG.sent;
  const unread = message.status === "unread" || message.status === "sent";

  return (
    <button
      onClick={() => onOpen(message.id)}
      className={`w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-slate-50/70 transition-colors border-b border-slate-50 last:border-0
        ${unread ? "bg-blue-50/30" : ""}`}
    >
      {unread && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
      {!unread && <div className="w-2 h-2 shrink-0" />}

      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
        {(message.sender?.name ?? message.receiver?.name)?.[0]?.toUpperCase() ??
          "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm truncate ${unread ? "font-bold text-slate-800" : "font-medium text-slate-700"}`}
          >
            {message.sender?.name ?? message.receiver?.name ?? "—"}
          </p>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${typeCfg.bg} ${typeCfg.color}`}
          >
            {typeCfg.label}
          </span>
        </div>
        <p
          className={`text-sm truncate ${unread ? "text-slate-700 font-medium" : "text-slate-500"}`}
        >
          {message.subject}
        </p>
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {message.content}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs text-slate-400">
          {fmtRelative(message.created_at)}
        </p>
        <span
          className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}
        >
          {statusCfg.label}
        </span>
      </div>
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherMessages() {
  const queryClient = useQueryClient();
  const [openMessageId, setOpenMessageId] = useState(null);
  const [compose, setCompose] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: unreadData } = useQuery({
    queryKey: ["unread-count"],
    queryFn: () => authedFetch(`${BASE}/teacher/messages/count/unread`),
    refetchInterval: 30000,
  });
  const unreadCount = unreadData?.data?.unread_count ?? 0;

  const { data, isLoading } = useQuery({
    queryKey: ["teacher-messages", statusFilter, typeFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      params.set("per_page", "50");
      return authedFetch(`${BASE}/teacher/messages?${params.toString()}`);
    },
  });
  const messages = safeArr(data?.data);

  const filtered = useMemo(() => {
    if (!search) return messages;
    const q = search.toLowerCase();
    return messages.filter(
      (m) =>
        (m.subject ?? "").toLowerCase().includes(q) ||
        (m.content ?? "").toLowerCase().includes(q) ||
        (m.sender?.name ?? "").toLowerCase().includes(q) ||
        (m.receiver?.name ?? "").toLowerCase().includes(q),
    );
  }, [messages, search]);

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["teacher-messages"] });
    queryClient.invalidateQueries({ queryKey: ["unread-count"] });
  };

  if (openMessageId) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <MessageThread
          messageId={openMessageId}
          onBack={() => setOpenMessageId(null)}
          onChanged={refreshAll}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <FiInbox className="text-blue-500" size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Messages</h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread message${unreadCount !== 1 ? "s" : ""}`
                  : "All caught up"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCompose(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiPlus size={15} /> New Message
          </button>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-5 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            >
              <option value="all">All Types</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_CONFIG[t].label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <FiLoader className="text-2xl animate-spin" />
                <span className="text-sm">Loading messages...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <FiMail className="text-4xl text-slate-300" />
                <p className="text-sm">
                  {messages.length === 0
                    ? "No messages yet."
                    : "No messages match your filters."}
                </p>
              </div>
            ) : (
              <div>
                {filtered.map((m) => (
                  <MessageRow
                    key={m.id}
                    message={m}
                    onOpen={setOpenMessageId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {compose && (
        <ComposeModal onClose={() => setCompose(false)} onSent={refreshAll} />
      )}
    </div>
  );
}
