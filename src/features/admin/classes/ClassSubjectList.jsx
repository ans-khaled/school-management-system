import { FiBook, FiClock, FiStar, FiUser } from "react-icons/fi";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import ViewButton from "../../../ui/ViewButton";
import RemoveButton from "../../../ui/RemoveButton";
import useClassMutations from "./useClassMutations";
import AssignUpdateSubjectForm from "./AssignUpdateSubjectForm";

function ClassSubjectCard({ subject, classroomId }) {
  const { removeSubject, isRemovingSubject } = useClassMutations();

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
        {/* Change subject teacher */}
        <Modal>
          <Modal.Open opens={`change-teacher-${teacherId}`}>
            <button className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors">
              Change Teacher
            </button>
          </Modal.Open>
          <Modal.Window name={`change-teacher-${teacherId}`}>
            <AssignUpdateSubjectForm
              subjectToUpdate={subject}
              classroomId={classroomId}
            />
          </Modal.Window>
        </Modal>

        <ViewButton
          category="subjects"
          id={id}
          title="Subject"
          backFrom="Classroom Details"
        />

        {/* Remove subject */}
        <Modal>
          <Modal.Open opens={`remove-subject-${id}`}>
            <RemoveButton />
          </Modal.Open>
          <Modal.Window name={`remove-subject-${id}`}>
            <ConfirmDelete
              type="remove"
              resourceName="subject"
              itemName={name}
              onConfirm={() =>
                removeSubject({ classroom_id: classroomId, subject_id: id })
              }
              disabled={isRemovingSubject}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

function ClassSubjectsList({ subjects, classroomId }) {
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
        <ClassSubjectCard
          key={subject.id}
          subject={subject}
          classroomId={classroomId}
        />
      ))}
    </div>
  );
}

export default ClassSubjectsList;
