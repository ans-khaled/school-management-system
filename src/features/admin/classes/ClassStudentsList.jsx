import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import ViewButton from "../../../ui/ViewButton";
import RemoveButton from "../../../ui/RemoveButton";
import { FiCalendar, FiHash } from "react-icons/fi";
import { formatDate } from "../../../utils/helpers";
import useClassMutations from "./useClassMutations";

function ClassStudentCard({ student, classroomId }) {
  console.log(student);
  const { isRemovingStudent, removeStudent } = useClassMutations();

  const {
    id,
    student_id: studentId,
    gender,
    date_of_birth: dateOfBirth,
    phone,
    pivot: { enrolled_at: enrolledAt } = {},
  } = student;
  console.log(student);

  const initials = studentId?.slice(-2).toUpperCase() ?? "??";

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
              {studentId}
            </span>
            <span className="text-[10px] font-medium bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full capitalize">
              {gender}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <FiCalendar size={10} />
              {formatDate(dateOfBirth)}
            </span>
            {enrolledAt && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiHash size={10} />
                Enrolled {formatDate(enrolledAt)}
              </span>
            )}
            {phone && (
              <span className="text-[11px] text-slate-400">{phone}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <ViewButton
          category="students"
          id={id}
          title="Student"
          backFrom="Classroom Details"
        />

        <Modal>
          <Modal.Open opens={`remove-student-${id}`}>
            <RemoveButton />
          </Modal.Open>
          <Modal.Window name={`remove-student-${id}`}>
            <ConfirmDelete
              type="remove"
              resourceName="student"
              itemName={studentId}
              onConfirm={() =>
                removeStudent({ classroom_id: classroomId, student_id: id })
              }
              disabled={isRemovingStudent}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

function ClassStudentsList({ students, classroomId }) {
  if (students.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No students found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {students.map((student) => (
        <ClassStudentCard
          key={student.id}
          student={student}
          classroomId={classroomId}
        />
      ))}
    </div>
  );
}

export default ClassStudentsList;
