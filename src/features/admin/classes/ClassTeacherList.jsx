import { FiBriefcase, FiCalendar, FiHash } from "react-icons/fi";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import ViewButton from "../../../ui/ViewButton";
import RemoveButton from "../../../ui/RemoveButton";

import useClassMutations from "./useClassMutations";
import AssginUpdateTeacherForm from "./AssginUpdateTeacherForm";

const ROLE_STYLES = {
  homeroom: "bg-teal-50 text-teal-600",
  main_teacher: "bg-blue-50 text-blue-500",
  subject_teacher: "bg-amber-50 text-amber-600",
};

const ROLE_LABELS = {
  homeroom: "Homeroom",
  main_teacher: "Main Teacher",
  subject_teacher: "Subject Teacher",
};

function ClassTeacherCard({ teacher, classroomId }) {
  const { removeTeacher, isRemovingTeacher } = useClassMutations();

  console.log(teacher);

  const {
    id,
    teacher_id: teacherId,
    subject_specialization: specialization,
    qualification,
    phone,
    user,
    pivot: { role, assigned_at: assignedAt } = {},
  } = teacher;

  const name = user?.name ?? teacherId;
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "??";

  const roleStyle = ROLE_STYLES[role] ?? "bg-slate-100 text-slate-500";
  const roleLabel = ROLE_LABELS[role] ?? role;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
      {/* Avatar + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 truncate">
              {name}
            </span>
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {teacherId}
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${roleStyle}`}
            >
              {roleLabel}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {specialization && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiBriefcase size={10} />
                {specialization}
              </span>
            )}
            {qualification && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiHash size={10} />
                {qualification}
              </span>
            )}
            {assignedAt && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiCalendar size={10} />
                Assigned {assignedAt}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Modal>
          <Modal.Open opens={`udpate-teacher-role-${id}`}>
            <button className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors">
              Change Teacher Role
            </button>
          </Modal.Open>

          <Modal.Window name={`udpate-teacher-role-${id}`}>
            <AssginUpdateTeacherForm
              teacherToUpdate={teacher}
              classroomId={classroomId}
            />
          </Modal.Window>
        </Modal>

        <ViewButton
          category="teachers"
          id={id}
          title="Teacher"
          backFrom="Classroom Details"
        />

        <Modal>
          <Modal.Open opens={`remove-teacher-${id}`}>
            <RemoveButton />
          </Modal.Open>
          <Modal.Window name={`remove-teacher-${id}`}>
            <ConfirmDelete
              type="remove"
              resourceName="teacher"
              itemName={name}
              onConfirm={() =>
                removeTeacher({ classroom_id: classroomId, teacher_id: id })
              }
              disabled={isRemovingTeacher}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

function ClassTeachersList({ teachers, classroomId }) {
  if (teachers.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No teachers assigned yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {teachers.map((teacher) => (
        <ClassTeacherCard
          key={teacher.id}
          teacher={teacher}
          classroomId={classroomId}
        />
      ))}
    </div>
  );
}

export default ClassTeachersList;
