import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FiGrid, FiUsers, FiBook, FiBarChart2, FiCreditCard,
  FiTruck, FiBell, FiLogOut, FiUser, FiFileText,
  FiSearch, FiPlus, FiTrash2, FiX, FiLoader,
  FiAward, FiTrendingUp, FiFilter,
} from "react-icons/fi";

const BASE    = "https://helwalrabee.com/api";
const TOKEN   = "pzi5Ut0fti3GJtX5SnpxaNdfgA1763wtucmim10R25731816";
const HEADERS = { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` };
const PER     = 10;
const EMPTY   = { student_id: "", exam_id: "", marks_obtained: "", remarks: "" };

const GRADE_COLOR = {
  "A+": "bg-green-50 text-green-600",
  "A":  "bg-green-50 text-green-500",
  "B+": "bg-blue-50 text-blue-600",
  "B":  "bg-blue-50 text-blue-500",
  "C+": "bg-yellow-50 text-yellow-600",
  "C":  "bg-yellow-50 text-yellow-500",
  "D":  "bg-orange-50 text-orange-500",
  "F":  "bg-red-50 text-red-500",
};

export default function GradesPage() {
  const qc = useQueryClient();

  const [search,      setSearch]      = useState("");
  const [page,        setPage]        = useState(1);
  const [modal,       setModal]       = useState(false);
  const [delTarget,   setDelTarget]   = useState(null);
  const [form,        setForm]        = useState(EMPTY);
  const [filterGrade, setFilterGrade] = useState("all");

  // fetch grades
  const { data, isLoading, isError } = useQuery({
    queryKey: ["grades"],
    queryFn: () =>
      fetch(`${BASE}/grades`, { headers: HEADERS })
        .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); }),
  });

  // fetch students for dropdown
  const { data: studentsData } = useQuery({
    queryKey: ["students-for-grades"],
    queryFn: () => fetch(`${BASE}/students`, { headers: HEADERS }).then(r => r.json()),
  });

  // fetch exams for dropdown
  const { data: examsData } = useQuery({
    queryKey: ["exams-for-grades"],
    queryFn: () => fetch(`${BASE}/exams`, { headers: HEADERS }).then(r => r.json()),
  });

  const grades   = Array.isArray(data?.data) ? data.data : Array.isArray(data?.data?.data) ? data.data.data : [];
  const students = (studentsData?.data?.data ?? []).map(s => ({ id: s.id, name: s.user?.name ?? "", student_id: s.student_id ?? "" }));
  const exams    = Array.isArray(examsData?.data) ? examsData.data : Array.isArray(examsData?.data?.data) ? examsData.data.data : [];

  // stats
  const avgPct    = grades.length ? Math.round(grades.reduce((a, g) => a + (g.percentage ?? 0), 0) / grades.length) : 0;
  const passing   = grades.filter(g => (g.percentage ?? 0) >= 60).length;
  const failing   = grades.filter(g => (g.percentage ?? 0) < 60).length;
  const topGrade  = grades.reduce((best, g) => (g.percentage ?? 0) > (best?.percentage ?? 0) ? g : best, null);

  // filter + search
  const filtered = grades.filter(g => {
    const name   = g.student?.name ?? "";
    const exam   = g.exam?.title ?? "";
    const matchS = name.toLowerCase().includes(search.toLowerCase()) || exam.toLowerCase().includes(search.toLowerCase());
    const matchF = filterGrade === "all" || g.grade === filterGrade;
    return matchS && matchF;
  });

  const pages = Math.max(1, Math.ceil(filtered.length / PER));
  const rows  = filtered.slice((page - 1) * PER, page * PER);

  const refresh = () => qc.invalidateQueries({ queryKey: ["grades"] });

  const createM = useMutation({
    mutationFn: body => fetch(`${BASE}/grades`, {
      method: "POST", headers: HEADERS,
      body: JSON.stringify({ ...body, student_id: Number(body.student_id), exam_id: Number(body.exam_id), marks_obtained: Number(body.marks_obtained) }),
    }).then(r => r.json().then(d => { if (!r.ok) { console.error("GRADE ERR:", JSON.stringify(d)); throw new Error(JSON.stringify(d?.errors ?? d?.message)); } return d; })),
    onSuccess: () => { refresh(); toast.success("Grade added!"); setModal(false); setForm(EMPTY); },
    onError:   e => toast.error(e.message),
  });

  const deleteM = useMutation({
    mutationFn: id => fetch(`${BASE}/grades/${id}`, { method: "DELETE", headers: HEADERS })
      .then(r => { if (!r.ok) throw new Error("delete failed"); return r.json(); }),
    onSuccess: () => { refresh(); toast.success("Grade deleted."); setDelTarget(null); },
    onError:   e => toast.error(e.message),
  });

  const submitForm = e => {
    e.preventDefault();
    if (!form.student_id || !form.exam_id || !form.marks_obtained) { toast.error("Student, exam and marks are required"); return; }
    createM.mutate(form);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* MAIN */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Grades</h1>
            <p className="text-slate-400 text-sm mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={() => setModal(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-200">
            <FiPlus size={15} /> Add Grade
          </button>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          {[
            { label: "Total Records", value: grades.length,   bg: "bg-blue-50",   text: "text-blue-500",   icon: <FiFileText /> },
            { label: "Average Score", value: `${avgPct}%`,    bg: "bg-purple-50", text: "text-purple-500", icon: <FiBarChart2 /> },
            { label: "Passing",       value: passing,          bg: "bg-green-50",  text: "text-green-500",  icon: <FiTrendingUp /> },
            { label: "Failing",       value: failing,          bg: "bg-red-50",    text: "text-red-400",    icon: <FiAward /> },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
                <span className={`${c.text} text-xl`}>{c.icon}</span>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">{c.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-0.5">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* table card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-slate-800">Grade Records</p>
              <p className="text-slate-400 text-xs mt-0.5">{filtered.length} total records</p>
            </div>
            <div className="flex items-center gap-3">
              {/* grade filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {["all", "A+", "A", "B+", "B", "C+", "C", "D", "F"].map(g => (
                  <button key={g} onClick={() => { setFilterGrade(g); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                      ${filterGrade === g ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                    {g === "all" ? "All" : g}
                  </button>
                ))}
              </div>
              {/* search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search student or exam..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-52 transition-all" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
              <FiLoader className="text-2xl animate-spin" />
              <span className="text-sm">Loading grades…</span>
            </div>
          ) : isError ? (
            <div className="text-center py-24 text-red-400 text-sm">Failed to load. Check API or network.</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-24 text-slate-400 text-sm">No grade records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Student", "Exam", "Marks", "Percentage", "Grade", "Remarks", "Date", "Actions"].map(h => (
                      <th key={h} className="px-6 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.map(g => (
                    <tr key={g.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
                            {g.student?.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{g.student?.name ?? "—"}</p>
                            <p className="text-slate-400 text-[11px]">{g.student?.student_id ?? ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">{g.exam?.title ?? "—"}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{g.marks_obtained}</span>
                        <span className="text-slate-400 text-xs"> / {g.total_marks ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${(g.percentage ?? 0) >= 85 ? "bg-green-500" : (g.percentage ?? 0) >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                              style={{ width: `${Math.min(g.percentage ?? 0, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{g.percentage ?? 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${GRADE_COLOR[g.grade] ?? "bg-slate-50 text-slate-500"}`}>
                          {g.grade ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">{g.remarks || "—"}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {g.created_at ? new Date(g.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setDelTarget(g)} className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100">
                          <FiTrash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Page {page} of {pages}</span>
              <div className="flex gap-1.5">
                {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors
                      ${n === page ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ADD GRADE MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#1a2332] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-base">Add Grade Record</p>
                <p className="text-slate-400 text-xs mt-1">Fill in the details below</p>
              </div>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={submitForm} className="p-6 space-y-4">
              {/* student */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Student *</label>
                <select value={form.student_id} onChange={e => setForm(p => ({ ...p, student_id: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white">
                  <option value="">Select student...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>)}
                </select>
              </div>
              {/* exam */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Exam *</label>
                <select value={form.exam_id} onChange={e => setForm(p => ({ ...p, exam_id: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-white">
                  <option value="">Select exam...</option>
                  {exams.map(e => <option key={e.id} value={e.id}>{e.title ?? e.name}</option>)}
                </select>
              </div>
              {/* marks */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Marks Obtained *</label>
                <input type="number" min="0" value={form.marks_obtained}
                  onChange={e => setForm(p => ({ ...p, marks_obtained: e.target.value }))}
                  placeholder="e.g. 85"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
              </div>
              {/* remarks */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Remarks</label>
                <input type="text" value={form.remarks}
                  onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))}
                  placeholder="e.g. Excellent work"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={createM.isPending} className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {createM.isPending && <FiLoader size={13} className="animate-spin" />}
                  Add Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {delTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDelTarget(null)} />
          <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-400 text-xl" />
            </div>
            <p className="text-slate-800 font-bold text-lg mb-2">Delete Grade</p>
            <p className="text-slate-500 text-sm mb-6">
              Delete grade record for <strong className="text-slate-800">{delTarget.student?.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDelTarget(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteM.mutate(delTarget.id)} disabled={deleteM.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {deleteM.isPending ? <FiLoader size={13} className="animate-spin" /> : <FiTrash2 size={13} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
