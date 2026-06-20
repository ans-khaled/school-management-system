import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import useTeacherMutation from "./useTeacherMutations";
import CreateUpdateTeacherForm from "./CreateUpdateTeacherForm";

const tdStyle = "px-6 py-4 text-slate-600 whitespace-nowrap";

function TeacherRow({ teacher }) {
  const {
    id,
    teacher_id: teacherId,
    gender,
    phone,
    hire_date,
    qualification,
    subject_specialization,
    is_active,
    user,
    subjects = [],
    classrooms = [],
  } = teacher;

  const name = user?.name ?? "—";
  const email = user?.email ?? "—";
  const hireYear = hire_date
    ? new Date(hire_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const { isDeleting, deleteTeacher } = useTeacherMutation();

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* Teacher ID */}
      <td className={`${tdStyle} text-slate-500 font-mono text-xs`}>
        {teacherId}
      </td>

      {/* Full Name + Phone */}
      <td className={tdStyle}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
            {(name?.[0] ?? "?").toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">{name}</span>
            <span className="text-[11px] text-slate-400">{email}</span>
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

      {/* Contact */}
      <td className={tdStyle}>
        <div className="flex flex-col">
          <span className="text-sm text-slate-600">{email}</span>
          <span className="text-[11px] text-slate-400">{phone}</span>
        </div>
      </td>

      {/* Specialization */}
      <td className={tdStyle}>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-slate-700">
            {subject_specialization}
          </span>
          <span className="text-[11px] text-slate-400">{qualification}</span>
        </div>
      </td>

      {/* Subjects */}
      <td className={tdStyle}>
        {subjects.length === 0 ? (
          <span className="text-slate-400 text-xs">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {subjects.map((s) => (
              <span
                key={s.id}
                className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-500"
              >
                {s.name}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* Classes */}
      <td className={tdStyle}>
        {classrooms.length === 0 ? (
          <span className="text-slate-400 text-xs">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {classrooms.map((c) => (
              <span
                key={c.id}
                className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-500"
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
      </td>

      {/* Hire Date */}
      <td className="px-6 py-4 text-sm text-slate-500">{hireYear}</td>

      {/* Actions */}
      <td className={tdStyle}>
        <div className="flex items-center gap-2">
          <ActionButtons type="view" category="teachers" id={id} />

          <Modal>
            <Modal.Open opens={`update-teacher-${id}`}>
              <ActionButtons type="update" category="teachers" />
            </Modal.Open>

            <Modal.Window name={`update-teacher-${id}`}>
              <CreateUpdateTeacherForm teacherToUpdate={teacher} />
            </Modal.Window>

            <Modal.Open opens={`delete-teacher-${id}`}>
              <ActionButtons type="delete" category="teachers" />
            </Modal.Open>

            <Modal.Window name={`delete-teacher-${id}`}>
              <ConfirmDelete
                resourceName="class"
                itemName={name}
                onConfirm={() => deleteTeacher(id)}
                disabled={isDeleting}
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default TeacherRow;
