import { useQuery } from "@tanstack/react-query";
import { FiCalendar, FiBook, FiLoader, FiUser, FiMapPin } from "react-icons/fi";

const BASE = "https://helwalrabee.com/api";
const TOKEN = "M70Z9OBzZDz9JryoZJSj2xyP02VvpqR9PQli4aN48a08a757";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

const SUBJECT_COLORS = [
  { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
];

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function todayKey() {
  const d = new Date().getDay();
  return DAY_ORDER[d === 0 ? 6 : d - 1];
}

function fmt12(t) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function StudentTimetable() {
  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ["student-schedule"],
    queryFn: () =>
      fetch(`${BASE}/student/schedule`, { headers: HEADERS }).then((r) =>
        r.json(),
      ),
  });

  // Flatten everything to figure out the full set of time slots (X axis)
  const allClasses = DAY_ORDER.flatMap((day) =>
    (scheduleData?.data?.[day] ?? []).map((s) => ({ ...s, day })),
  );

  const activeDays = DAY_ORDER.filter(
    (d) => (scheduleData?.data?.[d] ?? []).length > 0,
  );

  // Unique time slots across the whole week, sorted
  const timeSlots = [...new Set(allClasses.map((s) => s.start_time))].sort(
    (a, b) => (a ?? "").localeCompare(b ?? ""),
  );

  // Lookup: day -> start_time -> class
  const grid = {};
  DAY_ORDER.forEach((d) => {
    grid[d] = {};
  });
  allClasses.forEach((s) => {
    grid[s.day][s.start_time] = s;
  });

  // Stable subject -> color map
  const subjectColorMap = {};
  let ci = 0;
  allClasses.forEach((s) => {
    const name = s.subject?.name ?? `subj-${s.id}`;
    if (!(name in subjectColorMap))
      subjectColorMap[name] = SUBJECT_COLORS[ci++ % SUBJECT_COLORS.length];
  });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-100 items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-blue-500 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your timetable...</p>
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
            <h1 className="text-xl font-bold text-slate-800">My Timetable</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
        </div>

        <div className="p-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Periods",
                value: allClasses.length,
                bg: "bg-blue-50",
                text: "text-blue-500",
                icon: <FiCalendar />,
              },
              {
                label: "School Days",
                value: activeDays.length,
                bg: "bg-purple-50",
                text: "text-purple-500",
                icon: <FiCalendar />,
              },
              {
                label: "Subjects",
                value: Object.keys(subjectColorMap).length,
                bg: "bg-green-50",
                text: "text-green-500",
                icon: <FiBook />,
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

          {/* ── GRID: rows = days, columns = time slots, cells = subject ───── */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">Weekly Schedule</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {allClasses.length} classes this week
              </p>
            </div>

            {timeSlots.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                No schedule found yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-slate-50 px-5 py-3.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide border-b border-r border-slate-100 z-10">
                        Day
                      </th>
                      {timeSlots.map((t) => (
                        <th
                          key={t}
                          className="bg-slate-50 px-4 py-3.5 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 whitespace-nowrap min-w-[140px]"
                        >
                          {fmt12(t)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeDays.map((day) => (
                      <tr
                        key={day}
                        className={day === todayKey() ? "bg-blue-50/30" : ""}
                      >
                        <td className="sticky left-0 bg-white px-5 py-3 border-r border-b border-slate-100 z-10">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700 text-xs capitalize">
                              {day}
                            </span>
                            {day === todayKey() && (
                              <span className="text-[10px] font-semibold bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                                Today
                              </span>
                            )}
                          </div>
                        </td>
                        {timeSlots.map((t) => {
                          const cls = grid[day][t];
                          const color = cls
                            ? (subjectColorMap[cls.subject?.name] ??
                              SUBJECT_COLORS[0])
                            : null;
                          return (
                            <td
                              key={t}
                              className="px-2 py-2 border-b border-slate-50 align-middle"
                            >
                              {cls ? (
                                <div
                                  className={`rounded-lg border ${color.border} ${color.bg} px-3 py-2`}
                                >
                                  <p
                                    className={`font-semibold text-xs ${color.text} truncate`}
                                  >
                                    {cls.subject?.name ?? "—"}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                                    <FiUser size={9} />{" "}
                                    <span className="truncate">
                                      {cls.teacher?.user?.name ?? "—"}
                                    </span>
                                  </div>
                                  {cls.room_number && (
                                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400">
                                      <FiMapPin size={9} /> Room{" "}
                                      {cls.room_number}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-slate-300 text-xs">
                                  —
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* LEGEND */}
          {allClasses.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5 mt-5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Subject Legend
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(subjectColorMap).map(([name, color]) => (
                  <span
                    key={name}
                    className={`${color.bg} ${color.text} border ${color.border} text-xs px-3 py-1 rounded-full font-medium`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
