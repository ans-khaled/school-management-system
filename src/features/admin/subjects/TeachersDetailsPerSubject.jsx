import { Calendar, MapPin, Phone } from "lucide-react";
import ViewButton from "../../../ui/ViewButton";
import DetailsSectionsHeader from "../../../ui/DetailsSectionsHeader";

function TeachersDetailsPerSubject({ teachers }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <DetailsSectionsHeader>Enrolled Teachers</DetailsSectionsHeader>

        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
          {teachers.length} assigned
        </span>
      </div>

      {teachers.length === 0 ? (
        <div className="text-center py-11 text-slate-400 text-md">
          No teachers found.
        </div>
      ) : (
        <div className="space-y-3">
          {teachers.map((teacher) => {
            console.log(teacher);
            const initials = teacher.teacher_id?.slice(-3) ?? "T";
            const name = teacher.user?.name;
            const hired = teacher.hire_date
              ? new Date(teacher.hire_date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : null;
            return (
              <div
                key={teacher.teacher_id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-full bg-violet-50 flex items-center justify-center text-xs font-medium text-violet-800 shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {name}
                    <span className="pl-1">({teacher.teacher_id})</span>
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    {teacher.qualification} · {teacher.subject_specialization}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {teacher.address && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={12} /> {teacher.address}
                      </span>
                    )}
                    {teacher.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Phone size={12} /> {teacher.phone}
                      </span>
                    )}
                    {hired && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} /> Hired {hired}
                      </span>
                    )}
                  </div>
                </div>

                <ViewButton
                  category="teachers"
                  id={teacher.id}
                  backFrom="Subject Details"
                  title="Teacher"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TeachersDetailsPerSubject;
