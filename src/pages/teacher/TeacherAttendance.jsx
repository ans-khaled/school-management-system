import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiCalendar, FiUsers, FiCheckCircle, FiXCircle, FiClock,
  FiAlertCircle, FiLoader, FiSave, FiChevronLeft, FiChevronRight,
  FiBarChart2, FiSearch, FiEdit3, FiCheck, FiX,
} from "react-icons/fi";

const BASE    = "https://helwalrabee.com/api";
const TOKEN   = "LgIX4I1w7eGBy0nyIwQH2tZs6pyBHqRxxMLG0FnZfe32d748";
const HEADERS = { "Content-Type": "application/json", "Authorization": `Bearer ${TOKEN}` };

function safeArr(v) {
  return Array.isArray(v) ? v
    : Array.isArray(v?.data) ? v.data
    : Array.isArray(v?.data?.data) ? v.data.data
    : [];
}

async function authedFetch(url, options = {}) {
  const res  = await fetch(url, { ...options, headers: { ...HEADERS, ...(options.headers ?? {}) } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const msg = json.message ?? `Request failed (${res.status})`;
    const errs = json.errors ? Object.values(json.errors).flat().join(" ") : "";
    throw new Error(errs ? `${msg}: ${errs}` : msg);
  }
  return json;
}

function toInputDate(d) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
function shiftDate(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toInputDate(d);
}
function isToday(dateStr) {
  return dateStr === toInputDate(new Date());
}

const STATUS_CONFIG = {
  present: { label: "Present", color: "text-green-600",  bg: "bg-green-50",  ring: "ring-green-500",  dot: "bg-green-500",  icon: <FiCheckCircle /> },
  absent:  { label: "Absent",  color: "text-red-500",    bg: "bg-red-50",    ring: "ring-red-500",    dot: "bg-red-500",    icon: <FiXCircle /> },
  late:    { label: "Late",    color: "text-yellow-600",  bg: "bg-yellow-50", ring: "ring-yellow-500", dot: "bg-yellow-500", icon: <FiClock /> },
  excused: { label: "Excused", color: "text-blue-500",    bg: "bg-blue-50",   ring: "ring-blue-500",   dot: "bg-blue-500",   icon: <FiAlertCircle /> },
};
const STATUS_ORDER = ["present", "absent", "late", "excused"];

// ── Mark/Edit note popover ──────────────────────────────────────────────────────
function NoteEditor({ value, onSave, onClose }) {
  const [note, setNote] = useState(value ?? "");
  return (
    <div className="absolute right-0 top-full mt-2 z-20 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-3">
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a note (optional)..."
        rows={3}
        autoFocus
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-all"
      />
      <div className="flex gap-2 mt-2">
        <button onClick={onClose} className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button onClick={() => onSave(note)} className="flex-1 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors">
          Save Note
        </button>
      </div>
    </div>
  );
}

// ── Roster row ────────────────────────────────────────────────────────────────
function RosterRow({ student, record, onMark, busy }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const status = record?.status ?? null;
  const cfg    = status ? STATUS_CONFIG[status] : null;

  return (
    <div className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/70 transition-colors relative">
      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-sm shrink-0">
        {student.user?.name?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">{student.user?.name ?? "—"}</p>
        <p className="text-slate-400 text-xs">{student.student_id ?? "—"}</p>
      </div>

      {record?.notes && (
        <span className="text-slate-400 text-[11px] italic max-w-[140px] truncate hidden md:block" title={record.notes}>
          "{record.notes}"
        </span>
      )}

      {/* status buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {STATUS_ORDER.map(s => {
          const c = STATUS_CONFIG[s];
          const active = status === s;
          return (
            <button
              key={s}
              disabled={busy}
              onClick={() => onMark(student, s, record)}
              title={c.label}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all
                ${active ? `${c.bg} ${c.color} ring-2 ${c.ring}` : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
            >
              {c.icon}
            </button>
          );
        })}
      </div>

      {/* note button */}
      <button onClick={() => setNoteOpen(v => !v)} disabled={!record}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed">
        <FiEdit3 size={13} />
      </button>

      {noteOpen && record && (
        <NoteEditor
          value={record.notes}
          onClose={() => setNoteOpen(false)}
          onSave={(note) => { onMark(student, status, record, note); setNoteOpen(false); }}
        />
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TeacherAttendance() {
  const queryClient = useQueryClient();

  const [selectedClassroomId, setSelectedClassroomId] = useState(null);
  const [date,   setDate]   = useState(toInputDate(new Date()));
  const [search, setSearch] = useState("");
  const [tab,    setTab]    = useState("mark"); // mark | history

  // 1) Classrooms
  const { data: classroomsData, isLoading: classroomsLoading } = useQuery({
    queryKey: ["attendance-classrooms"],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms`),
  });
  const classrooms = safeArr(classroomsData?.data);
  const classroomId = selectedClassroomId ?? classrooms[0]?.id ?? null;

  // 2) Classroom detail (roster)
  const { data: classroomDetailData, isLoading: rosterLoading } = useQuery({
    queryKey: ["attendance-classroom-detail", classroomId],
    queryFn: () => authedFetch(`${BASE}/teacher/classrooms/${classroomId}`),
    enabled: !!classroomId,
  });
  const classroom = classroomDetailData?.data ?? null;
  const roster    = safeArr(classroom?.students);

  // 3) Attendance records for this classroom + date
  const { data: attendanceData, isLoading: attLoading } = useQuery({
    queryKey: ["attendance-records", classroomId, date],
    queryFn: () => authedFetch(`${BASE}/teacher/attendance?classroom_id=${classroomId}&date=${date}`),
    enabled: !!classroomId && !!date,
  });
  const records = safeArr(attendanceData?.data);
  const recordByStudent = useMemo(() => {
    const map = new Map();
    records.forEach(r => map.set(r.student_id, r));
    return map;
  }, [records]);

  // 4) Classroom attendance summary
  const { data: summaryData } = useQuery({
    queryKey: ["attendance-summary", classroomId],
    queryFn: () => authedFetch(`${BASE}/teacher/attendance/classroom/${classroomId}/summary`),
    enabled: !!classroomId,
  });
  const summary = summaryData?.data ?? null;

  // 5) Attendance history (last 30 days, this classroom)
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["attendance-history", classroomId],
    queryFn: () => authedFetch(`${BASE}/teacher/attendance?classroom_id=${classroomId}&per_page=100`),
    enabled: !!classroomId && tab === "history",
  });
  const history = safeArr(historyData?.data);
  const historyByDate = useMemo(() => {
    const map = new Map();
    history.forEach(r => {
      if (!map.has(r.date)) map.set(r.date, []);
      map.get(r.date).push(r);
    });
    return Array.from(map.entries()).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [history]);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
    queryClient.invalidateQueries({ queryKey: ["attendance-summary"] });
    queryClient.invalidateQueries({ queryKey: ["attendance-history"] });
  };

  // create or update a record
  const markMutation = useMutation({
    mutationFn: async ({ student, status, existing, notes }) => {
      if (existing) {
        return authedFetch(`${BASE}/teacher/attendance/${existing.id}`, {
          method: "PUT",
          body: JSON.stringify({ status, notes: notes ?? existing.notes ?? "" }),
        });
      }
      return authedFetch(`${BASE}/teacher/attendance`, {
        method: "POST",
        body: JSON.stringify({
          student_id: student.id,
          classroom_id: classroomId,
          date,
          status,
          notes: notes ?? "",
        }),
      });
    },
    onSuccess: () => refresh(),
    onError: (e) => toast.error(e.message),
  });

  const handleMark = (student, status, existing, notes) => {
    markMutation.mutate({ student, status, existing, notes });
  };

  // bulk mark all unmarked as present
  const markAllPresentMutation = useMutation({
    mutationFn: async () => {
      const unmarked = roster.filter(s => !recordByStudent.has(s.id));
      await Promise.all(unmarked.map(s =>
        authedFetch(`${BASE}/teacher/attendance`, {
          method: "POST",
          body: JSON.stringify({ student_id: s.id, classroom_id: classroomId, date, status: "present", notes: "" }),
        })
      ));
    },
    onSuccess: () => { toast.success("Marked remaining students present"); refresh(); },
    onError: (e) => toast.error(e.message),
  });

  const filteredRoster = roster.filter(s =>
    (s.user?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (s.student_id ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const markedCount   = records.length;
  const presentCount  = records.filter(r => r.status === "present").length;
  const absentCount   = records.filter(r => r.status === "absent").length;
  const lateCount     = records.filter(r => r.status === "late").length;
  const excusedCount  = records.filter(r => r.status === "excused").length;
  const unmarkedCount = roster.length - markedCount;

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (classroomsLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading classrooms...</p>
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
            <h1 className="text-xl font-bold text-slate-800">Attendance</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>

          {/* classroom selector */}
          <select
            value={classroomId ?? ""}
            onChange={e => setSelectedClassroomId(Number(e.target.value))}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all min-w-[200px]"
          >
            {classrooms.length === 0 && <option>No classrooms assigned</option>}
            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="p-8">

          {!classroomId ? (
            <div className="bg-white rounded-2xl p-14 text-center shadow-sm">
              <FiUsers className="text-slate-300 text-5xl mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No classrooms assigned to your account yet.</p>
            </div>
          ) : (
            <>
              {/* STAT CARDS */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                {[
                  { label: "Total Students", value: roster.length,  bg: "bg-blue-50",   text: "text-blue-500",   icon: <FiUsers /> },
                  { label: "Present",        value: presentCount,    bg: "bg-green-50",  text: "text-green-500",  icon: <FiCheckCircle /> },
                  { label: "Absent",         value: absentCount,     bg: "bg-red-50",    text: "text-red-500",    icon: <FiXCircle /> },
                  { label: "Late",           value: lateCount,       bg: "bg-yellow-50", text: "text-yellow-600", icon: <FiClock /> },
                  { label: "Unmarked",       value: unmarkedCount,   bg: "bg-slate-100", text: "text-slate-500",  icon: <FiAlertCircle /> },
                ].map(c => (
                  <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                      <span className={`${c.text} text-lg`}>{c.icon}</span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">{c.label}</p>
                      <p className="text-xl font-bold text-slate-800 mt-0.5">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* overall summary banner */}
              {summary && (
                <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                      <FiBarChart2 className="text-purple-500 text-xl" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold text-sm">{summary.classroom_name}</p>
                      <p className="text-slate-400 text-xs">Overall attendance rate across {summary.total_students} students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {STATUS_ORDER.map(s => (
                      <div key={s} className="text-center">
                        <p className={`text-lg font-bold ${STATUS_CONFIG[s].color}`}>{summary.attendance_stats?.[s] ?? 0}</p>
                        <p className="text-slate-400 text-[10px] uppercase tracking-wide">{STATUS_CONFIG[s].label}</p>
                      </div>
                    ))}
                    <div className="text-center pl-6 border-l border-slate-100">
                      <p className="text-2xl font-bold text-blue-500">{summary.attendance_percentage}%</p>
                      <p className="text-slate-400 text-[10px] uppercase tracking-wide">Rate</p>
                    </div>
                  </div>
                </div>
              )}

              {/* tabs */}
              <div className="flex bg-white rounded-xl border border-slate-200 p-1 gap-1 mb-5 w-fit">
                {[
                  { key: "mark",    label: "Mark Attendance" },
                  { key: "history", label: "History" },
                ].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors
                      ${tab === t.key ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── MARK TAB ── */}
              {tab === "mark" && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      {/* date nav */}
                      <button onClick={() => setDate(d => shiftDate(d, -1))}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <FiChevronLeft size={14} />
                      </button>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                        <FiCalendar className="text-slate-400" size={14} />
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                          className="bg-transparent text-sm text-slate-700 focus:outline-none" />
                        {isToday(date) && <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Today</span>}
                      </div>
                      <button onClick={() => setDate(d => shiftDate(d, 1))}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <FiChevronRight size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
                          className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-52 transition-all" />
                      </div>
                      {unmarkedCount > 0 && (
                        <button onClick={() => markAllPresentMutation.mutate()} disabled={markAllPresentMutation.isPending}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-60">
                          {markAllPresentMutation.isPending ? <FiLoader className="animate-spin" size={13} /> : <FiCheck size={13} />}
                          Mark Rest Present
                        </button>
                      )}
                    </div>
                  </div>

                  {rosterLoading || attLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                      <FiLoader className="text-2xl animate-spin" />
                      <span className="text-sm">Loading roster...</span>
                    </div>
                  ) : filteredRoster.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 text-sm">
                      {roster.length === 0 ? "No students enrolled in this classroom." : "No students match your search."}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {filteredRoster.map(student => (
                        <RosterRow
                          key={student.id}
                          student={student}
                          record={recordByStudent.get(student.id)}
                          onMark={handleMark}
                          busy={markMutation.isPending}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── HISTORY TAB ── */}
              {tab === "history" && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <p className="font-semibold text-slate-800">Attendance History</p>
                    <p className="text-slate-400 text-xs mt-0.5">Recent records for {classroom?.name}</p>
                  </div>

                  {historyLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                      <FiLoader className="text-2xl animate-spin" />
                      <span className="text-sm">Loading history...</span>
                    </div>
                  ) : historyByDate.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 text-sm">No attendance history yet.</div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {historyByDate.map(([d, recs]) => {
                        const present = recs.filter(r => r.status === "present").length;
                        const absent  = recs.filter(r => r.status === "absent").length;
                        const late    = recs.filter(r => r.status === "late").length;
                        const excused = recs.filter(r => r.status === "excused").length;
                        return (
                          <button key={d} onClick={() => { setDate(d); setTab("mark"); }}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                <FiCalendar size={16} />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">{fmtDate(d)}</p>
                                <p className="text-slate-400 text-xs">{recs.length} record{recs.length !== 1 ? "s" : ""}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {[
                                { v: present, c: "text-green-500" },
                                { v: absent,  c: "text-red-500" },
                                { v: late,    c: "text-yellow-600" },
                                { v: excused, c: "text-blue-500" },
                              ].map((x, i) => x.v > 0 && (
                                <span key={i} className={`text-xs font-bold ${x.c}`}>{x.v}</span>
                              ))}
                              <FiChevronRight className="text-slate-300" size={14} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
