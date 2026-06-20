import { FiBook, FiClock, FiStar, FiUser } from "react-icons/fi";
import ViewButton from "../../../ui/ViewButton";

function StudentSubjectCard({ subject }) {
  const {
    id,
    name,
    code,
    credits,
    type,
    is_active: isActive,
    pivot: { teacher_id: teacherId, weekly_hours: weeklyHours } = {},
  } = subject;

  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "??";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
      {/* Avatar + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 truncate">
              {name}
            </span>
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {code}
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                isActive
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {isActive ? "active" : "inactive"}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <FiStar size={10} />
              {credits} {credits === 1 ? "credit" : "credits"}
            </span>
            {weeklyHours && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiClock size={10} />
                {weeklyHours} hrs/week
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-slate-400 capitalize">
              <FiBook size={10} />
              {type}
            </span>
            {teacherId && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiUser size={10} />
                Teacher ID: {teacherId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <ViewButton
          category="subjects"
          id={id}
          title="Subject"
          backFrom="Student Details"
        />
      </div>
    </div>
  );
}

function StudentSubjectsList({ subjects }) {
  if (subjects.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No subjects found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {subjects.map((subject) => (
        <StudentSubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}

export default StudentSubjectsList;
