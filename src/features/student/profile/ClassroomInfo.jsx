import { FiBook } from "react-icons/fi";

const SUBJECT_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
];

function ClassroomInfo({ classrooms }) {
  const myClassroom = classrooms[0] ?? null;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <FiBook className="text-purple-500" size={16} />
        <p className="font-semibold text-slate-800">Classroom</p>
      </div>
      {!myClassroom ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          Not enrolled in a classroom yet.
        </div>
      ) : (
        <div className="p-6">
          <div className="bg-purple-50 rounded-xl p-4 mb-4">
            <p className="text-purple-500 text-xs font-semibold mb-1">
              Grade Level {myClassroom.grade_level}
            </p>
            <p className="text-slate-800 font-bold text-lg">
              {myClassroom.name}
            </p>
          </div>

          <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-2">
            Subjects
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(myClassroom.subjects ?? []).length === 0 ? (
              <span className="text-slate-400 text-xs">No subjects yet</span>
            ) : (
              myClassroom.subjects.map((s, i) => (
                <span
                  key={s.id ?? i}
                  className={`${SUBJECT_COLORS[i % SUBJECT_COLORS.length]} text-white text-xs px-3 py-1 rounded-full font-medium`}
                >
                  {s.name}
                </span>
              ))
            )}
          </div>

          <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide mb-2">
            Teachers
          </p>
          <div className="space-y-2">
            {(myClassroom.teachers ?? []).length === 0 ? (
              <span className="text-slate-400 text-xs">
                No teachers assigned
              </span>
            ) : (
              myClassroom.teachers.map((t, i) => (
                <div key={t.id ?? i} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs">
                    {t.user?.name?.[0] ?? "?"}
                  </div>
                  <span className="text-slate-700 text-sm">
                    {t.user?.name ?? "—"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassroomInfo;
