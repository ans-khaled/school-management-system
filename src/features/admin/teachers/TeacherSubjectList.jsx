import { FiAward, FiCalendar } from "react-icons/fi";
import ViewButton from "../../../ui/ViewButton";

function SubjectCard({ subject }) {
  const {
    id: subjectId,
    name: subjectName,
    code,
    type,
    credits,
    pivot: { weekly_hours: weeklyHours } = {},
  } = subject;

  const initials =
    subjectName
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
              {subjectName}
            </span>
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {code}
            </span>
            <span className="text-[10px] font-medium bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full capitalize">
              {type}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <FiAward size={10} />
              {credits} {credits === 1 ? "credit" : "credits"}
            </span>
            {weeklyHours && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiCalendar size={10} />
                {weeklyHours} hrs/week
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <ViewButton
        category="subjects"
        id={subjectId}
        title="Subject"
        backFrom="Teacher Details"
      />
    </div>
  );
}

function TeacherSubjectList({ subjects }) {
  if (subjects.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No subjects assigned yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}

export default TeacherSubjectList;
