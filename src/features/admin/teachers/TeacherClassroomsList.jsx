import { FiCalendar, FiLayers } from "react-icons/fi";
import ViewButton from "../../../ui/ViewButton";
import { formatDate } from "../../../utils/helpers";
import RemoveButton from "../../../ui/RemoveButton";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import useClassMutations from "../classes/useClassMutations";

function TeacherClassroomsCard({ cls, teacherId }) {
  const { removeTeacher, isRemovingTeacher } = useClassMutations();
  console.log(teacherId);

  const {
    id: classroomId,
    name,
    grade_level: gradeLevel,
    academic_year: academicYear,
    pivot: { role, assigned_at: assignedAt } = {},
  } = cls;

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
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 truncate">
              {name}
            </span>
            {role && (
              <span className="text-[10px] font-medium bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full capitalize">
                {role.replace("_", " ")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <FiLayers size={10} />
              {gradeLevel}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <FiCalendar size={10} />
              {academicYear}
            </span>
            {assignedAt && (
              <span className="text-[11px] text-slate-400">
                Assigned {formatDate(assignedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Modal>
          <Modal.Open opens={`udpate-teacher-role-`}>
            <button className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors">
              Change Teacher Role
            </button>
          </Modal.Open>

          <Modal.Window name={`udpate-teacher-role-`}>
            {/* <AssginUpdateTeacherForm
              teacherToUpdate={teacher}
              classroomId={classroomId}
            /> */}
          </Modal.Window>
        </Modal>

        <ViewButton
          category="classes"
          id={classroomId}
          title="Classroom"
          backFrom="Teacher Details"
        />

        {/* Remove classroom */}
        <Modal>
          <Modal.Open opens={`remove-classroom-${classroomId}`}>
            <RemoveButton />
          </Modal.Open>
          <Modal.Window name={`remove-classroom-${classroomId}`}>
            <ConfirmDelete
              type="remove"
              resourceName="classroom"
              itemName={name}
              onConfirm={() =>
                removeTeacher({
                  classroom_id: classroomId,
                  teacher_id: teacherId,
                })
              }
              disabled={isRemovingTeacher}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

function TeacherClassroomsList({ classrooms, teacherId }) {
  if (classrooms.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No classrooms assigned yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {classrooms.map((cls) => (
        <TeacherClassroomsCard key={cls.id} cls={cls} teacherId={teacherId} />
      ))}
    </div>
  );
}

export default TeacherClassroomsList;
