import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiFileText,
  FiBook,
  FiLoader,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiAward,
  FiUpload,
  FiX,
  FiChevronRight,
  FiPaperclip,
  FiMessageSquare,
} from "react-icons/fi";

const BASE = "https://helwalrabee.com/api";
const TOKEN = "M70Z9OBzZDz9JryoZJSj2xyP02VvpqR9PQli4aN48a08a757";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};
const AUTH_ONLY = { Authorization: `Bearer ${TOKEN}` };

const SUBJECT_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

function daysUntil(d) {
  return Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
}

// ── Submit Modal ─────────────────────────────────────────────────────────────
// Uses POST /files/upload (to get file_path) then POST /student/assignments/{id}/submit
function SubmitModal({ assignment, onClose, onSuccess }) {
  const { register, handleSubmit } = useForm();
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const mutation = useMutation({
    mutationFn: async ({ content }) => {
      let file_path = null;

      // Step 1: POST /files/upload (only if a file was attached)
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const upRes = await fetch(`${BASE}/files/upload`, {
          method: "POST",
          headers: AUTH_ONLY,
          body: fd,
        });
        const upJson = await upRes.json();
        if (!upJson.success)
          throw new Error(upJson.message ?? "File upload failed");
        file_path = upJson?.data?.file_path ?? null;
      }

      // Step 2: POST /student/assignments/{id}/submit
      const body = {};
      if (content) body.content = content;
      if (file_path) body.file_path = file_path;

      const res = await fetch(
        `${BASE}/student/assignments/${assignment.id}/submit`,
        {
          method: "POST",
          headers: HEADERS,
          body: JSON.stringify(body),
        },
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? "Submission failed");
      return json;
    },
    onSuccess: () => {
      toast.success("Submission recorded!");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="font-semibold text-slate-800">Submit Assignment</p>
            <p className="text-xs text-slate-400 mt-0.5">{assignment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Your Answer
            </label>
            <textarea
              {...register("content")}
              rows={3}
              placeholder="Write your answer here..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Attach File (optional)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${file ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
            >
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <>
                  <FiCheckCircle className="text-blue-500 text-xl mx-auto mb-1" />
                  <p className="text-sm font-medium text-blue-600">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <FiUpload className="text-slate-400 text-xl mx-auto mb-1" />
                  <p className="text-sm text-slate-500">
                    Click to attach a file
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <FiLoader className="animate-spin" size={14} />
              ) : (
                <FiUpload size={14} />
              )}
              {mutation.isPending ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Assignment Detail Drawer ──────────────────────────────────────────────────
// Uses GET /student/assignments/{id}
function DetailDrawer({ assignmentId, onClose, onSubmit }) {
  const { data, isLoading } = useQuery({
    queryKey: ["student-assignment-detail", assignmentId],
    queryFn: () =>
      fetch(`${BASE}/student/assignments/${assignmentId}`, {
        headers: HEADERS,
      }).then((r) => r.json()),
  });
  const a = data?.data ?? null;
  const sub = a?.submission ?? null;

  const days = a ? daysUntil(a.due_at) : null;
  const isLate = days !== null && days < 0;
  const pct =
    sub?.score != null && a?.points
      ? Math.round((sub.score / a.points) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-slate-100 w-full max-w-lg h-full overflow-y-auto shadow-2xl">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <p className="font-semibold text-slate-800">Assignment Details</p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {isLoading || !a ? (
          <div className="flex items-center justify-center py-24">
            <FiLoader className="text-blue-500 text-3xl animate-spin" />
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
              <p className="text-white/70 text-xs mb-1">
                {a.subject?.name ?? "—"}
              </p>
              <h2 className="text-xl font-bold mb-2">{a.title}</h2>
              <p className="text-white/80 text-sm">
                {a.description || "No description provided."}
              </p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Due Date",
                  value: new Date(a.due_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                  icon: <FiCalendar />,
                },
                {
                  label: "Points",
                  value: `${a.points} pts`,
                  icon: <FiAward />,
                },
                {
                  label: "Teacher",
                  value: a.teacher?.user?.name ?? "—",
                  icon: <FiUser />,
                },
                {
                  label: "Classroom",
                  value: a.classroom?.name ?? "—",
                  icon: <FiBook />,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">
                      {c.label}
                    </p>
                    <p className="text-slate-800 font-semibold text-xs mt-0.5 truncate">
                      {c.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Submission / result */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <p className="font-semibold text-slate-800 mb-4">
                Submission & Result
              </p>
              {sub ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium">
                      Submitted
                    </span>
                    <span className="text-slate-700 text-sm font-medium">
                      {new Date(sub.submitted_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {sub.content && (
                    <div>
                      <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-1">
                        Your Answer
                      </p>
                      <p className="text-slate-700 text-sm bg-slate-50 rounded-xl p-3">
                        {sub.content}
                      </p>
                    </div>
                  )}

                  {sub.file_path && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FiPaperclip size={14} />{" "}
                      <span className="truncate">{sub.file_path}</span>
                    </div>
                  )}

                  {sub.score != null ? (
                    <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                      <div>
                        <p className="text-green-600 text-[11px] font-semibold uppercase tracking-wide">
                          Score
                        </p>
                        <p className="text-green-700 text-xl font-bold">
                          {sub.score}/{a.points}
                        </p>
                      </div>
                      {pct !== null && (
                        <div className="text-right">
                          <p className="text-green-700 text-2xl font-bold">
                            {pct}%
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-yellow-50 text-yellow-600 rounded-xl p-3 text-sm font-medium">
                      <FiClock size={14} /> Awaiting grading
                    </div>
                  )}

                  {sub.feedback && (
                    <div>
                      <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-1 flex items-center gap-1.5">
                        <FiMessageSquare size={11} /> Teacher Feedback
                      </p>
                      <p className="text-slate-700 text-sm bg-blue-50 rounded-xl p-3">
                        {sub.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center">
                  {isLate ? (
                    <>
                      <FiAlertCircle className="text-red-400 text-3xl mb-2" />
                      <p className="text-slate-600 font-semibold text-sm">
                        Deadline Passed
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Due {Math.abs(days)} day
                        {Math.abs(days) !== 1 ? "s" : ""} ago
                      </p>
                    </>
                  ) : (
                    <>
                      <FiUpload className="text-blue-400 text-3xl mb-2" />
                      <p className="text-slate-600 font-semibold text-sm">
                        Not Submitted Yet
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Due in {days} day{days !== 1 ? "s" : ""}
                      </p>
                      <button
                        onClick={onSubmit}
                        className="mt-4 px-5 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <FiUpload size={13} /> Submit Now
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudentAssignments() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [detailId, setDetailId] = useState(null); // GET /student/assignments/{id}
  const [submitModal, setSubmitModal] = useState(null); // POST /student/assignments/{id}/submit

  // 1) GET /student/assignments — the list, each with `submitted` boolean
  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["student-assignments"],
    queryFn: () =>
      fetch(`${BASE}/student/assignments`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const assignments = assignmentsData?.data?.data ?? [];

  // 2) GET /student/submissions — graded feedback list (for the "Graded Feedback" panel)
  const { data: submissionsData, isLoading: submissionsLoading } = useQuery({
    queryKey: ["student-submissions"],
    queryFn: () =>
      fetch(`${BASE}/student/submissions`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });
  const submissions = submissionsData?.data?.data ?? [];

  // Color map by subject
  const subjectColorMap = {};
  let ci = 0;
  assignments.forEach((a) => {
    const k = a.subject?.name ?? `s${a.id}`;
    if (!(k in subjectColorMap))
      subjectColorMap[k] = SUBJECT_COLORS[ci++ % SUBJECT_COLORS.length];
  });

  const enriched = assignments.map((a) => {
    const days = daysUntil(a.due_at);
    const status = a.submitted ? "submitted" : days < 0 ? "missed" : "pending";
    return {
      a,
      days,
      status,
      color:
        subjectColorMap[a.subject?.name ?? `s${a.id}`] ?? SUBJECT_COLORS[0],
    };
  });

  const pendingCount = enriched.filter((e) => e.status === "pending").length;
  const submittedCount = enriched.filter(
    (e) => e.status === "submitted",
  ).length;
  const missedCount = enriched.filter((e) => e.status === "missed").length;
  const gradedCount = submissions.filter((s) => s.score != null).length;

  const filtered = enriched.filter(({ status }) =>
    filter === "all" ? true : status === filter,
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isLoading = assignmentsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <main className="flex-1 overflow-y-auto">
        {/* top bar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">My Assignments</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
        </div>

        <div className="p-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: assignments.length,
                bg: "bg-blue-50",
                text: "text-blue-500",
                icon: <FiFileText />,
              },
              {
                label: "Pending",
                value: pendingCount,
                bg: "bg-yellow-50",
                text: "text-yellow-500",
                icon: <FiClock />,
              },
              {
                label: "Submitted",
                value: submittedCount,
                bg: "bg-green-50",
                text: "text-green-500",
                icon: <FiCheckCircle />,
              },
              {
                label: "Missed",
                value: missedCount,
                bg: "bg-red-50",
                text: "text-red-500",
                icon: <FiAlertCircle />,
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}
                >
                  <span className={`${c.text} text-xl`}>{c.icon}</span>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                    {c.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 mt-0.5">
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FILTER TABS */}
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 mb-5 w-fit">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "submitted", label: "Submitted" },
              { key: "missed", label: "Missed" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === f.key ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* ASSIGNMENTS TABLE (from GET /student/assignments) */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-5">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">All Assignments</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {filtered.length} shown
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-14 text-slate-400 text-sm">
                No assignments match this filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {[
                        "Title",
                        "Subject",
                        "Teacher",
                        "Due Date",
                        "Points",
                        "Status",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map(({ a, days, status, color }) => (
                      <tr
                        key={a.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                        onClick={() => setDetailId(a.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-8 rounded-full ${color} shrink-0`}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate">
                                {a.title}
                              </p>
                              {!a.is_active && (
                                <span className="text-[10px] text-slate-400">
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {a.subject?.name ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {a.teacher?.user?.name ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(a.due_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {status === "pending" && (
                            <p
                              className={`text-[10px] font-semibold mt-0.5 ${days <= 2 ? "text-red-500" : days <= 5 ? "text-yellow-600" : "text-slate-400"}`}
                            >
                              {days === 0 ? "Due today" : `${days}d left`}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {a.points} pts
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                            ${status === "submitted" ? "bg-green-50 text-green-600" : status === "pending" ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-500"}`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {status === "pending" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSubmitModal(a);
                              }}
                              className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold hover:underline"
                            >
                              <FiUpload size={12} /> Submit
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                              Details <FiChevronRight size={12} />
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* GRADED FEEDBACK PANEL (from GET /student/submissions) */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Graded Feedback</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {gradedCount} of {submissions.length} submissions graded
                </p>
              </div>
              <FiMessageSquare className="text-slate-400" size={16} />
            </div>
            {submissionsLoading ? (
              <div className="flex justify-center py-10">
                <FiLoader className="text-blue-500 text-2xl animate-spin" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No submissions yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {submissions.map((s) => {
                  const pct =
                    s.score != null && s.assignment?.points
                      ? Math.round((s.score / s.assignment.points) * 100)
                      : null;
                  return (
                    <div
                      key={s.id}
                      className="px-6 py-4 flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {s.assignment?.title ?? "—"}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {s.assignment?.subject?.name ?? "—"} · Graded by{" "}
                          {s.grader?.name ?? "—"}
                        </p>
                        {s.feedback && (
                          <p className="text-slate-500 text-xs mt-1 italic truncate">
                            "{s.feedback}"
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        {s.score != null ? (
                          <>
                            <p className="font-bold text-slate-800 text-sm">
                              {s.score}/{s.assignment?.points ?? "—"}
                            </p>
                            {pct !== null && (
                              <p className="text-[11px] text-green-600 font-semibold">
                                {pct}%
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-yellow-500 text-xs font-semibold">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {detailId && (
        <DetailDrawer
          assignmentId={detailId}
          onClose={() => setDetailId(null)}
          onSubmit={() => {
            const a = assignments.find((x) => x.id === detailId);
            setSubmitModal(a);
          }}
        />
      )}

      {submitModal && (
        <SubmitModal
          assignment={submitModal}
          onClose={() => setSubmitModal(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["student-assignments"],
            });
            queryClient.invalidateQueries({
              queryKey: ["student-assignment-detail", submitModal.id],
            });
            queryClient.invalidateQueries({
              queryKey: ["student-submissions"],
            });
          }}
        />
      )}
    </div>
  );
}
