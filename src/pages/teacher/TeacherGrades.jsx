import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiAward,
  FiPlus,
  FiSearch,
  FiLoader,
  FiAlertCircle,
  FiX,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
  FiUser,
  FiBook,
  FiFileText,
  FiSave,
  FiTrendingUp,
  FiBarChart2,
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

const GRADE_COLOR = {
  "A+": { bg: "bg-green-50", text: "text-green-600" },
  A: { bg: "bg-green-50", text: "text-green-500" },
  "A-": { bg: "bg-green-50", text: "text-green-500" },
  "B+": { bg: "bg-blue-50", text: "text-blue-600" },
  B: { bg: "bg-blue-50", text: "text-blue-500" },
  "B-": { bg: "bg-blue-50", text: "text-blue-500" },
  "C+": { bg: "bg-yellow-50", text: "text-yellow-600" },
  C: { bg: "bg-yellow-50", text: "text-yellow-500" },
  D: { bg: "bg-orange-50", text: "text-orange-500" },
  F: { bg: "bg-red-50", text: "text-red-500" },
};
function gradeColor(g) {
  return GRADE_COLOR[g] ?? { bg: "bg-slate-50", text: "text-slate-500" };
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Grade Form (create / edit) ──────────────────────────────────────────────────
function GradeFormModal({ grade, exams, students, onClose, onSuccess }) {
  const isEdit = !!grade;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? {
          exam_id: grade.exam_id ?? "",
          student_id: grade.student_id ?? "",
          score: grade.score !== null ? Number(grade.score) : "",
          remarks: grade.remarks ?? "",
        }
      : {},
  });

  const selectedExamId = watch("exam_id");
  const selectedExam = exams.find(
    (e) => String(e.id) === String(selectedExamId),
  );

  const mutation = useMutation({
    mutationFn: (formData) => {
      const body = {
        exam_id: Number(formData.exam_id),
        student_id: Number(formData.student_id),
        score: Number(formData.score),
        remarks: formData.remarks ?? "",
      };
      if (isEdit) {
        // Only score + remarks are editable per the doc
        return authedFetch(`${BASE}/teacher/grades/${grade.id}`, {
          method: "PUT",
          body: JSON.stringify({ score: body.score, remarks: body.remarks }),
        });
      }
      return authedFetch(`${BASE}/teacher/grades`, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Grade updated" : "Grade recorded");
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error(e.message, { duration: 6000 }),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <p className="font-semibold text-slate-800">
            {isEdit ? "Edit Grade" : "Record Grade"}
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
              Exam
            </label>
            <select
              {...register("exam_id", { required: true })}
              disabled={isEdit}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Select exam</option>
              {exams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} · {e.classroom?.name ?? "—"}
                </option>
              ))}
            </select>
            {isEdit && (
              <p className="text-slate-400 text-[11px] mt-1">
                Exam can't be changed after grading.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Student
            </label>
            <select
              {...register("student_id", { required: true })}
              disabled={isEdit}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user?.name ?? `Student #${s.id}`} ({s.student_id})
                </option>
              ))}
            </select>
            {isEdit && (
              <p className="text-slate-400 text-[11px] mt-1">
                Student can't be changed after grading.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Score{" "}
              {selectedExam?.max_score
                ? `(out of ${selectedExam.max_score})`
                : ""}
            </label>
            <input
              type="number"
              step="0.01"
              {...register("score", { required: true, min: 0 })}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Remarks
            </label>
            <textarea
              {...register("remarks")}
              rows={3}
              placeholder="Excellent performance in the exam..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all"
            />
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
                <FiSave size={14} />
              ) : (
                <FiPlus size={14} />
              )}
              {mutation.isPending
                ? "Saving…"
                : isEdit
                  ? "Save Changes"
                  : "Record Grade"}
            </button>
          </div>
          {mutation.isError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                {mutation.error?.message}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm ───────────────────────────────────────────────────────────────
function DeleteConfirmModal({ grade, studentName, onClose, onSuccess }) {
  const mutation = useMutation({
    mutationFn: () =>
      authedFetch(`${BASE}/teacher/grades/${grade.id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Grade deleted");
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
          <p className="font-semibold text-slate-800">Delete this grade?</p>
        </div>
        <p className="text-slate-500 text-sm mb-5">
          {studentName}'s grade of <strong>{grade.score}</strong> will be
          permanently removed. This can't be undone.
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

// ── Student Grade History Drawer ────────────────────────────────────────────────
function StudentGradesDrawer({ student, onClose }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teacher-grades-by-student", student?.id],
    queryFn: () => authedFetch(`${BASE}/teacher/grades/student/${student.id}`),
    enabled: !!student?.id,
  });
  const grades = safeArr(data?.data);
  const avg =
    grades.length > 0
      ? Math.round(
          grades.reduce((s, g) => s + Number(g.score), 0) / grades.length,
        )
      : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="bg-slate-100 w-full max-w-lg h-full overflow-y-auto shadow-2xl">
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <p className="font-semibold text-slate-800 text-sm">Grade History</p>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Hero */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0">
                {student?.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="text-white/70 text-xs">
                  {student?.student_id ?? "—"}
                </p>
                <h2 className="text-lg font-bold truncate">
                  {student?.user?.name ?? "—"}
                </h2>
              </div>
              {avg !== null && (
                <div className="ml-auto text-right shrink-0">
                  <p className="text-2xl font-bold">{avg}</p>
                  <p className="text-white/70 text-[10px] uppercase tracking-wide">
                    Average
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="font-semibold text-slate-800 text-sm mb-4">
              All Grades
            </p>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <FiLoader className="text-blue-500 text-2xl animate-spin" />
              </div>
            ) : isError ? (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-red-600 text-[11px] font-mono break-words leading-relaxed">
                  {error?.message}
                </p>
              </div>
            ) : grades.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">
                No grades recorded for this student yet.
              </p>
            ) : (
              <div className="space-y-2">
                {grades.map((g, i) => {
                  const gc = gradeColor(g.grade);
                  return (
                    <div
                      key={g.id ?? i}
                      className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {g.exam_name ?? `Exam #${g.exam_id}`}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          {fmtDate(g.graded_at)}
                        </p>
                        {g.remarks && (
                          <p className="text-slate-500 text-xs mt-1 truncate">
                            {g.remarks}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-800 shrink-0">
                        {g.score}
                      </p>
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${gc.bg} ${gc.text}`}
                      >
                        {g.grade ?? "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherGrades() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [formModal, setFormModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [studentDrawer, setStudentDrawer] = useState(null);

  // 1) All grades the teacher has recorded
  const {
    data: gradesData,
    isLoading: gradesLoading,
    isError: gradesError,
    error: gradesErrorObj,
  } = useQuery({
    queryKey: ["teacher-grades-list"],
    queryFn: () => authedFetch(`${BASE}/teacher/grades`),
  });
  const rawGrades = safeArr(gradesData?.data);

  // 2) Students list — submissions/grades don't reliably include a student object,
  // so we join names ourselves the same way we fixed the assignments-grading page.
  const { data: studentsData } = useQuery({
    queryKey: ["teacher-students-for-grades"],
    queryFn: () => authedFetch(`${BASE}/teacher/students`),
  });
  const students = safeArr(studentsData?.data);
  const studentById = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [students]);

  // 3) Exams — for the create-grade dropdown and exam filter
  const { data: examsData } = useQuery({
    queryKey: ["teacher-exams-for-grades"],
    queryFn: () => authedFetch(`${BASE}/teacher/exams`),
  });
  const exams = safeArr(examsData?.data);
  const examById = useMemo(() => {
    const map = {};
    exams.forEach((e) => {
      map[e.id] = e;
    });
    return map;
  }, [exams]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["teacher-grades-list"] });
    queryClient.invalidateQueries({ queryKey: ["teacher-grades-by-student"] });
  };

  // Join student name + exam name onto each grade, preferring the grade's own
  // embedded objects but falling back to our joined lookups (matches the
  // pattern that fixed the assignments page — the API's nested objects are
  // not reliably present).
  const enriched = rawGrades.map((g) => {
    const student = studentById[g.student_id] ?? null;
    const exam = examById[g.exam_id] ?? null;
    return {
      ...g,
      studentName:
        g.student?.name ?? student?.user?.name ?? `Student #${g.student_id}`,
      studentObj: student,
      examName: g.exam?.name ?? exam?.name ?? `Exam #${g.exam_id}`,
      examObj: exam,
    };
  });

  const avgScore =
    enriched.length > 0
      ? Math.round(
          enriched.reduce((s, g) => s + Number(g.score), 0) / enriched.length,
        )
      : null;
  const highestGrade =
    enriched.length > 0
      ? enriched.reduce(
          (b, g) => (Number(g.score) > Number(b.score) ? g : b),
          enriched[0],
        )
      : null;

  const filtered = useMemo(
    () =>
      enriched
        .filter((g) =>
          examFilter === "all"
            ? true
            : String(g.exam_id) === String(examFilter),
        )
        .filter((g) =>
          g.studentName.toLowerCase().includes(search.toLowerCase()),
        )
        .sort((a, b) => new Date(b.graded_at) - new Date(a.graded_at)),
    [enriched, examFilter, search],
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (gradesLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading grades...</p>
        </div>
      </div>
    );
  }

  if (gradesError) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center max-w-sm">
          <FiAlertCircle className="text-red-400 text-4xl mx-auto mb-4" />
          <p className="text-slate-800 font-semibold mb-1">
            Couldn't load grades
          </p>
          <p className="text-slate-500 text-sm">{gradesErrorObj?.message}</p>
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
            <h1 className="text-xl font-bold text-slate-800">Grades</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
          <button
            onClick={() => setFormModal("create")}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiPlus size={14} /> Record Grade
          </button>
        </div>

        <div className="p-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Grades",
                value: enriched.length,
                bg: "bg-blue-50",
                text: "text-blue-500",
                icon: <FiFileText />,
              },
              {
                label: "Average Score",
                value: avgScore !== null ? avgScore : "—",
                bg: "bg-purple-50",
                text: "text-purple-500",
                icon: <FiTrendingUp />,
              },
              {
                label: "Highest Score",
                value: highestGrade ? highestGrade.score : "—",
                bg: "bg-green-50",
                text: "text-green-500",
                icon: <FiAward />,
              },
              {
                label: "Exams Graded",
                value: new Set(enriched.map((g) => g.exam_id)).size,
                bg: "bg-orange-50",
                text: "text-orange-500",
                icon: <FiBarChart2 />,
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

          {/* SEARCH + EXAM FILTER */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            >
              <option value="all">All Exams</option>
              {exams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* GRADES TABLE */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">All Grades</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {filtered.length} shown
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-14 text-slate-400 text-sm">
                {enriched.length === 0
                  ? 'No grades recorded yet. Click "Record Grade" to get started.'
                  : "No grades match this filter."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {[
                        "Student",
                        "Exam",
                        "Score",
                        "Grade",
                        "Remarks",
                        "Graded",
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
                    {filtered.map((g) => {
                      const gc = gradeColor(g.grade);
                      return (
                        <tr
                          key={g.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                setStudentDrawer(
                                  g.studentObj ?? {
                                    id: g.student_id,
                                    user: { name: g.studentName },
                                  },
                                )
                              }
                              className="flex items-center gap-3 hover:underline text-left"
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
                                {g.studentName?.[0]?.toUpperCase() ?? "?"}
                              </div>
                              <span className="font-medium text-slate-800">
                                {g.studentName}
                              </span>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {g.examName}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800">
                              {g.score}
                            </span>
                            {g.examObj?.max_score && (
                              <span className="text-slate-400 text-xs">
                                {" "}
                                / {g.examObj.max_score}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex w-8 h-8 rounded-lg items-center justify-center text-xs font-bold ${gc.bg} ${gc.text}`}
                            >
                              {g.grade ?? "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs max-w-[200px] truncate">
                            {g.remarks ?? "—"}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {fmtDate(g.graded_at)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 justify-end">
                              <button
                                onClick={() => setFormModal(g)}
                                className="text-slate-400 hover:text-blue-500 transition-colors"
                              >
                                <FiEdit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(g)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 size={14} />
                              </button>
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
        <GradeFormModal
          grade={typeof formModal === "object" ? formModal : null}
          exams={exams}
          students={students}
          onClose={() => setFormModal(null)}
          onSuccess={refresh}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          grade={deleteTarget}
          studentName={deleteTarget.studentName}
          onClose={() => setDeleteTarget(null)}
          onSuccess={refresh}
        />
      )}

      {studentDrawer && (
        <StudentGradesDrawer
          student={studentDrawer}
          onClose={() => setStudentDrawer(null)}
        />
      )}
    </div>
  );
}
