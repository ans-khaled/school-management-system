import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import CreateUpdateStudentForm from "./CreateUpdateStudentForm";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import useStudentMutation from "./useStudentMutations";

const tdStyle = "px-6 py-4 text-slate-600 whitespace-nowrap";

function StudentRow({ student }) {
  const { isDeleting, deleteStudent } = useStudentMutation();

  const {
    id,
    student_id: studentId,
    date_of_birth: dateOfBirth,
    enrollment_date: enrollmentDate,
    gender,
    phone: phoneNumber,
    address,

    // Foreign Key, connect students table with users table.
    user_id,
    user: { email, name, role } = {},

    parents,
    classrooms,
  } = student;

  const activeClassroom =
    classrooms.find((cls) => cls.pivot?.status === "active") ?? classrooms[0];

  const {
    name: className,
    grade_level: gradeLevel,
    academic_year: academicYear,
    pivot: { status } = {},
  } = activeClassroom ?? {};

  const primaryParent =
    parents.find((p) => p.pivot?.is_primary === 1) ?? parents[0];

  const { user: { name: parentName } = {}, phone: parentPhone } =
    primaryParent ?? {};

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* Student ID */}
      <td className={`${tdStyle} text-slate-500 font-mono text-xs`}>
        {studentId}
      </td>

      {/* Full Name + Email */}
      <td className={tdStyle}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
            {(name?.[0] ?? "?").toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">{name}</span>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>
      </td>

      {/* Gender */}
      <td className={tdStyle}>
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            gender === "male"
              ? "bg-sky-50 text-sky-500"
              : "bg-pink-50 text-pink-500"
          }`}
        >
          {gender}
        </span>
      </td>

      {/* Date of Birth */}
      <td className={`${tdStyle} text-slate-500 text-sm`}>
        {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString("en-GB") : "—"}
      </td>

      {/* Classroom */}
      <td className={`${tdStyle} text-slate-600`}>
        {className ? (
          <div className="flex flex-col">
            <span className="font-medium">{className}</span>
            {classrooms.length > 1 && (
              <span className="text-xs text-slate-400">
                +{classrooms.length - 1} more
              </span>
            )}
          </div>
        ) : (
          <span>—</span>
        )}
      </td>

      {/* Grade Level */}
      <td className={tdStyle}>
        {gradeLevel ? (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-500">
            {gradeLevel}
          </span>
        ) : (
          <span>—</span>
        )}
      </td>

      {/* Academic Year */}
      <td className={`${tdStyle} text-slate-500 text-sm`}>
        {academicYear ?? "—"}
      </td>

      {/* Enrollment Date */}
      <td className={`${tdStyle} text-slate-500 text-sm`}>
        {enrollmentDate
          ? new Date(enrollmentDate).toLocaleDateString("en-GB")
          : "—"}
      </td>

      {/* Parent */}
      <td className={tdStyle}>
        {parentName ? (
          <div className="flex flex-col">
            <span className="text-slate-700 font-medium text-sm">
              {parentName}
            </span>
            <span className="text-xs text-slate-400">{parentPhone}</span>
          </div>
        ) : (
          <span>—</span>
        )}
      </td>

      {/* Status */}
      <td className={tdStyle}>
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            status === "active"
              ? "bg-green-50 text-green-600"
              : status === "inactive"
                ? "bg-red-50 text-red-500"
                : "bg-gray-50 text-gray-400"
          }`}
        >
          {status ?? "—"}
        </span>
      </td>

      <td className={tdStyle}>
        <div className="flex items-center gap-2 transition-opacity">
          <ActionButtons type="view" category="students" id={id} />

          <Modal>
            <Modal.Open opens="student-form">
              <ActionButtons type="update" category="students" id={id} />
            </Modal.Open>

            <Modal.Window name="student-form">
              <CreateUpdateStudentForm
                studentToUpdate={{ ...student, email, name }}
              />
            </Modal.Window>

            <Modal.Open opens="delete">
              <ActionButtons type="delete" category="students" id={id} />
            </Modal.Open>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="student"
                itemName={name}
                onConfirm={() => deleteStudent(id)}
                disabled={isDeleting}
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default StudentRow;
