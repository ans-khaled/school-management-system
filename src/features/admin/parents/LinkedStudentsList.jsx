import ViewButton from "../../../ui/ViewButton";
import RemoveButton from "../../../ui/RemoveButton";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import { FiCalendar, FiUsers } from "react-icons/fi";
import { formatDate } from "../../../utils/helpers";

function StudentCard({ student }) {
  console.log(student);

  // const { removeStudent, isRemovingStudent } = useStudentParentRelations();

  const { id, student_id, gender, phone, enrollment_date, user } = student;

  const name = user?.name ?? student_id;
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
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800 truncate">
              {name}
            </span>
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {student_id}
            </span>
            {/* {relationship && (
              <span className="text-[10px] font-medium bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full capitalize">
                {relationship}
              </span>
            )} */}
          </div>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {gender && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiUsers size={10} />
                {gender}
              </span>
            )}
            {enrollment_date && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <FiCalendar size={10} />
                Enrolled {formatDate(enrollment_date)}
              </span>
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
          backFrom="Parent Details"
        />

        <Modal>
          <Modal.Open opens={`remove-student-${id}`}>
            <RemoveButton />
          </Modal.Open>
          <Modal.Window name={`remove-student-${id}`}>
            <ConfirmDelete
              type="remove"
              resourceName="student"
              itemName={name}
              // onConfirm={() =>
              //  removeStudent(id)
              // }
              // disabled={isRemovingStudent}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

function LinkedStudentsList({ students }) {
  if (!students?.length) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-2xl shadow-sm">
        No students linked to this parent yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}

export default LinkedStudentsList;
