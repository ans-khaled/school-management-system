import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiFileText,
  FiPlus,
  FiSearch,
  FiCalendar,
  FiAward,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
  FiArrowLeft,
  FiUsers,
  FiBook,
  FiClock,
  FiUser,
  FiMessageSquare,
  FiSave,
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

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function toInputDate(d) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}
function daysUntil(d) {
  return Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
}

// ── Assignment Form (create / edit) ─────────────────────────────────────────────
function AssignmentFormModal({
  assignment,
  classrooms,
  teacherId,
  onClose,
  onSuccess,
}) {
  const isEdit = !!assignment;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? {
          title: assignment.title ?? "",
          description: assignment.description ?? "",
          classroom_id:
            assignment.classroom_id ?? assignment.classroom?.id ?? "",
          assigned_at:
            toInputDate(assignment.assigned_at) || toInputDate(new Date()),
          due_at: toInputDate(assignment.due_at),
          points: assignment.points ?? 100,
          is_active: assignment.is_active ?? true,
        }
      : {
          assigned_at: toInputDate(new Date()),
          points: 100,
          is_active: true,
        },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const body = {
        ...formData,
        classroom_id: Number(formData.classroom_id),
        points: Number(formData.points),
        is_active: !!formData.is_active,
      };
      if (!isEdit) {
        body.teacher_id = teacherId;
        // subject_id isn't selectable here (no dedicated endpoint), default to classroom's known subject if present
      }
      if (isEdit) {
        return authedFetch(`${BASE}/teacher/assignments/${assignment.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      }
      return authedFetch(`${BASE}/teacher/assignments`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Assignment updated" : "Assignment created");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <p className="font-semibold text-slate-800">
            {isEdit ? "Edit Assignment" : "Create Assignment"}
          </p>
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
              Title
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="Chapter 5 Exercises"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">Title is required</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Complete all odd-numbered exercises from page 150-160"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Classroom
            </label>
            <select
              {...register("classroom_id", { required: true })}
              disabled={isEdit}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Select classroom</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {isEdit && (
              <p className="text-slate-400 text-[11px] mt-1">
                Classroom can't be changed after creation.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Assigned Date
              </label>
              <input
                type="date"
                {...register("assigned_at", { required: true })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                {...register("due_at", { required: true })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Points
              </label>
              <input
                type="number"
                {...register("points", { required: true, min: 1 })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer pb-2.5">
              <input
                type="checkbox"
                {...register("is_active")}
                className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400"
              />
              <span className="text-sm text-slate-700">
                Active (open for submission)
              </span>
            </label>
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
              ) : isEdit ? (
                <FiEdit2 size={14} />
              ) : (
                <FiPlus size={14} />
              )}
              {mutation.isPending
                ? "Saving…"
                : isEdit
                  ? "Save Changes"
                  : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ───────────────────────────────────────────────────────────────
function DeleteConfirmModal({ assignment, onClose, onSuccess }) {
  const mutation = useMutation({
    mutationFn: () =>
      authedFetch(`${BASE}/teacher/assignments/${assignment.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Assignment deleted");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <FiTrash2 size={18} />
          </div>
          <p className="font-semibold text-slate-800">
            Delete this assignment?
          </p>
        </div>
        <p className="text-slate-500 text-sm mb-5">
          "{assignment.title}" and all student submissions will be permanently
          removed. This can't be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {mutation.isPending ? (
              <FiLoader className="animate-spin" size={14} />
            ) : (
              <FiTrash2 size={14} />
            )}
            {mutation.isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Grade Submission Inline Form ────────────────────────────────────────────────
function GradeRow({ submission, assignmentId, onGraded }) {
  const [editing, setEditing] = useState(false);
  const studentName =
    submission.studentInfo?.user?.name ?? `Student #${submission.student_id}`;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      score: submission.score !== null ? Number(submission.score) : "",
      feedback: submission.feedback ?? "",
    },
  });
  const isGraded = submission.score !== null && submission.score !== undefined;

  const mutation = useMutation({
    mutationFn: (formData) => {
      const body = {
        score: Number(formData.score),
        feedback: formData.feedback ?? "",
      };
      if (isGraded) {
        return authedFetch(`${BASE}/teacher/submissions/${submission.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      }
      return authedFetch(`${BASE}/teacher/submissions/${submission.id}/grade`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      toast.success("Grade saved");
      setEditing(false);
      onGraded();
    },
    onError: (e) => toast.error(e.message, { duration: 6000 }),
  });

  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
            {studentName?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-800 text-sm truncate">
              {studentName}
            </p>
            <p className="text-slate-400 text-[11px]">
              {submission.studentInfo?.student_id ?? ""}{" "}
              {submission.submitted_at
                ? `· ${fmtDate(submission.submitted_at)}`
                : ""}
            </p>
          </div>
        </div>
        {!editing && (
          <div className="flex items-center gap-2 shrink-0">
            {isGraded ? (
              <span className="text-sm font-bold text-green-600">
                {submission.score} pts
              </span>
            ) : (
              <span className="text-[11px] font-semibold bg-yellow-50 text-yellow-600 px-2.5 py-0.5 rounded-full">
                Ungraded
              </span>
            )}
            <button
              onClick={() => setEditing(true)}
              className="text-blue-500 text-xs font-semibold hover:underline"
            >
              {isGraded ? "Edit" : "Grade"}
            </button>
          </div>
        )}
      </div>

      {submission.content && !editing && (
        <p className="text-slate-500 text-xs mt-2 bg-white rounded-lg p-2.5">
          {submission.content}
        </p>
      )}
      {submission.feedback && !editing && (
        <p className="text-slate-500 text-xs mt-1.5 flex items-start gap-1.5">
          <FiMessageSquare size={10} className="mt-0.5 shrink-0" />{" "}
          {submission.feedback}
        </p>
      )}

      {editing && (
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="mt-3 space-y-2"
        >
          <input
            type="number"
            {...register("score", { required: true, min: 0 })}
            placeholder="Score"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
          <textarea
            {...register("feedback")}
            rows={2}
            placeholder="Feedback (optional)"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all"
          />
          {mutation.isError && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
              <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                {isGraded ? "PUT" : "POST"}{" "}
                {isGraded
                  ? `/teacher/submissions/${submission.id}`
                  : `/teacher/submissions/${submission.id}/grade`}
                {" → "}
                {mutation.error?.message}
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                reset();
              }}
              className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
            >
              {mutation.isPending ? (
                <FiLoader className="animate-spin" size={12} />
              ) : (
                <FiSave size={12} />
              )}
              {mutation.isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Assignment Detail Drawer (with submissions + grading) ──────────────────────
function AssignmentDetailDrawer({ assignmentId, onClose, onEdit, onDelete }) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teacher-assignment-detail", assignmentId],
    queryFn: () => authedFetch(`${BASE}/teacher/assignments/${assignmentId}`),
  });
  const a = data?.data ?? null;
  const rawSubmissions = safeArr(a?.submissions);

  // The API doesn't include a `student` object on each submission — only `student_id`.
  // GET /teacher/students works fine, so we join names onto submissions ourselves.
  const { data: studentsData } = useQuery({
    queryKey: ["teacher-students-for-grading"],
    queryFn: () => authedFetch(`${BASE}/teacher/students`),
  });
  const studentsList = safeArr(studentsData?.data);
  const studentById = {};
  studentsList.forEach((s) => {
    studentById[s.id] = s;
  });

  const submissions = rawSubmissions.map((s) => ({
    ...s,
    studentInfo: studentById[s.student_id] ?? null,
  }));

  const gradedCount = submissions.filter(
    (s) => s.score !== null && s.score !== undefined,
  ).length;

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: ["teacher-assignment-detail", assignmentId],
    });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-slate-100 w-full max-w-xl h-full overflow-y-auto shadow-2xl">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
          >
            <FiArrowLeft size={16} /> Back
          </button>
          {a && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(a)}
                className="flex items-center gap-1.5 text-blue-500 text-xs font-semibold hover:underline"
              >
                <FiEdit2 size={12} /> Edit
              </button>
              <button
                onClick={() => onDelete(a)}
                className="flex items-center gap-1.5 text-red-500 text-xs font-semibold hover:underline"
              >
                <FiTrash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <FiLoader className="text-blue-500 text-3xl animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-24 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center mb-4">
              <FiAlertCircle size={28} />
            </div>
            <p className="text-slate-800 font-bold text-base mb-2">
              This assignment couldn't load
            </p>
            <p className="text-slate-500 text-sm mb-4">
              The server returned an error fetching this record.
            </p>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left w-full max-w-sm">
              <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                {error?.message}
              </p>
            </div>
            <p className="text-slate-400 text-xs mt-4">
              This is a backend issue — send the message above to whoever
              maintains the API.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Hero */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/70 text-xs">
                  {a.subject?.name ?? "—"}
                </p>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20`}
                >
                  {a.is_active ? "Active" : "Closed"}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1">{a.title}</h2>
              <p className="text-white/80 text-xs">
                {a.classroom?.name ?? "—"}
              </p>
            </div>

            {a.description && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-1.5">
                  Description
                </p>
                <p className="text-slate-700 text-sm">{a.description}</p>
              </div>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Assigned",
                  value: fmtDate(a.assigned_at),
                  icon: <FiCalendar />,
                },
                { label: "Due", value: fmtDate(a.due_at), icon: <FiClock /> },
                {
                  label: "Points",
                  value: `${a.points} pts`,
                  icon: <FiAward />,
                },
                {
                  label: "Teacher",
                  value: a.teacher?.name ?? "—",
                  icon: <FiUser />,
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
                    <p className="text-slate-800 font-semibold text-sm mt-0.5 truncate">
                      {c.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Submissions + grading */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-purple-500" size={16} />
                  <p className="font-semibold text-slate-800 text-sm">
                    Submissions
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {gradedCount} / {submissions.length} graded
                </span>
              </div>

              {submissions.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                  No submissions yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {submissions.map((s, i) => (
                    <GradeRow
                      key={s.id ?? i}
                      submission={s}
                      assignmentId={assignmentId}
                      onGraded={refresh}
                    />
                  ))}
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
export default function TeacherAssignments() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | closed
  const [formModal, setFormModal] = useState(null); // null | "create" | assignmentObj (edit)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailId, setDetailId] = useState(null);

  // 1) Profile — needed for teacher_id when creating
  const { data: profileData } = useQuery({
    queryKey: ["teacher-profile-for-assignments"],
    queryFn: () => authedFetch(`${BASE}/teacher/profile`),
  });
  const teacherId = profileData?.data?.teacher?.id ?? null;

  // 2) Assignments list
  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
    error: assignmentsErrorObj,
  } = useQuery({
    queryKey: ["teacher-assignments-list"],
    queryFn: () => authedFetch(`${BASE}/teacher/assignments`),
  });
  const assignments = safeArr(assignmentsData?.data);

  // 3) Classrooms (for the create/edit dropdown)
  const { data: classroomsData } = useQuery({
    queryKey: ["teacher-classrooms-for-assignments"],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms`),
  });
  const classrooms = safeArr(classroomsData?.data);

  // 4) Ungraded submissions count across all assignments (for stat card)
  const { data: ungradedData } = useQuery({
    queryKey: ["teacher-ungraded-for-assignments"],
    queryFn: () => authedFetch(`${BASE}/teacher/submissions?not_graded=true`),
  });
  const ungradedCount = safeArr(ungradedData?.data).length;

  const refreshAssignments = () => {
    queryClient.invalidateQueries({ queryKey: ["teacher-assignments-list"] });
    queryClient.invalidateQueries({ queryKey: ["teacher-assignment-detail"] });
    queryClient.invalidateQueries({
      queryKey: ["teacher-ungraded-for-assignments"],
    });
  };

  const activeCount = assignments.filter((a) => a.is_active).length;
  const closedCount = assignments.length - activeCount;
  const totalSubmissions = assignments.reduce(
    (s, a) => s + (a.submission_count ?? 0),
    0,
  );

  const filtered = useMemo(
    () =>
      assignments
        .filter((a) =>
          statusFilter === "all"
            ? true
            : statusFilter === "active"
              ? a.is_active
              : !a.is_active,
        )
        .filter((a) =>
          (a.title ?? "").toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => new Date(b.due_at) - new Date(a.due_at)),
    [assignments, statusFilter, search],
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (assignmentsLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (assignmentsError) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center max-w-sm">
          <FiAlertCircle className="text-red-400 text-4xl mx-auto mb-4" />
          <p className="text-slate-800 font-semibold mb-1">
            Couldn't load assignments
          </p>
          <p className="text-slate-500 text-sm">
            {assignmentsErrorObj?.message}
          </p>
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
            <h1 className="text-xl font-bold text-slate-800">Assignments</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
          <button
            onClick={() => setFormModal("create")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiPlus size={14} /> Create Assignment
          </button>
        </div>

        <div className="p-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Assignments",
                value: assignments.length,
                bg: "bg-blue-50",
                text: "text-blue-500",
                icon: <FiFileText />,
              },
              {
                label: "Active",
                value: activeCount,
                bg: "bg-green-50",
                text: "text-green-500",
                icon: <FiCheckCircle />,
              },
              {
                label: "Total Submissions",
                value: totalSubmissions,
                bg: "bg-purple-50",
                text: "text-purple-500",
                icon: <FiUsers />,
              },
              {
                label: "Ungraded",
                value: ungradedCount,
                bg: "bg-orange-50",
                text: "text-orange-500",
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

          {/* SEARCH + FILTERS */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assignments..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1">
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "closed", label: "Closed" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${statusFilter === f.key ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ASSIGNMENTS TABLE */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">All Assignments</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {filtered.length} shown
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-14 text-slate-400 text-sm">
                {assignments.length === 0
                  ? 'No assignments created yet. Click "Create Assignment" to get started.'
                  : "No assignments match this filter."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {[
                        "Title",
                        "Classroom",
                        "Due Date",
                        "Points",
                        "Submissions",
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
                    {filtered.map((a) => {
                      const days = daysUntil(a.due_at);
                      return (
                        <tr
                          key={a.id}
                          className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                          onClick={() => setDetailId(a.id)}
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-800 truncate">
                              {a.title}
                            </p>
                            {a.is_active && days >= 0 && (
                              <p
                                className={`text-[10px] font-semibold mt-0.5 ${days <= 2 ? "text-red-500" : days <= 7 ? "text-yellow-600" : "text-slate-400"}`}
                              >
                                {days === 0 ? "Due today" : `${days}d left`}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {a.classroom?.name ?? "—"}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {fmtDate(a.due_at)}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {a.points} pts
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {a.submission_count ?? 0}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                              ${a.is_active ? "bg-green-50 text-green-500" : "bg-slate-100 text-slate-400"}`}
                            >
                              {a.is_active ? "Active" : "Closed"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 justify-end">
                              <button
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  setFormModal(a);
                                }}
                                className="text-slate-400 hover:text-blue-500 transition-colors"
                              >
                                <FiEdit2 size={14} />
                              </button>
                              <button
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  setDeleteTarget(a);
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 size={14} />
                              </button>
                              <FiChevronRight
                                size={14}
                                className="text-slate-300"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {(formModal === "create" ||
        (formModal && typeof formModal === "object")) && (
        <AssignmentFormModal
          assignment={typeof formModal === "object" ? formModal : null}
          classrooms={classrooms}
          teacherId={teacherId}
          onClose={() => setFormModal(null)}
          onSuccess={refreshAssignments}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          assignment={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={refreshAssignments}
        />
      )}

      {detailId && (
        <AssignmentDetailDrawer
          assignmentId={detailId}
          onClose={() => setDetailId(null)}
          onEdit={(a) => {
            setDetailId(null);
            setFormModal(a);
          }}
          onDelete={(a) => {
            setDetailId(null);
            setDeleteTarget(a);
          }}
        />
      )}
    </div>
  );
}
