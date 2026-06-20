import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import useClassMutations from "./useClassMutations";
import CreateUpdateClassForm from "./CreateUpdateClassForm";

const COLORS = [
  "bg-blue-50 text-blue-500",
  "bg-purple-50 text-purple-500",
  "bg-green-50 text-green-500",
  "bg-orange-50 text-orange-500",
  "bg-pink-50 text-pink-500",
  "bg-teal-50 text-teal-500",
  "bg-red-50 text-red-500",
  "bg-yellow-50 text-yellow-500",
];

const tdStyle = "px-6 py-4";

function ClassRow({ cls, index }) {
  const {
    id,
    name,
    capacity,
    academic_year: academicYear,
    grade_level: gradeLevel,
    description,
    is_active: isActive,

    teachers,
    subjects,
    students,
  } = cls;

  console.log(cls);

  const uniqueTeachers = [...new Map(teachers.map((t) => [t.id, t])).values()];
  const uniqueSubjects = [...new Map(subjects.map((s) => [s.id, s])).values()];

  const { deleteClass, isDeleting } = useClassMutations();

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* Class */}
      <td className={`${tdStyle}`}>
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${COLORS[index % COLORS.length]}`}
          >
            {name.slice(name.length - 2, name.length)}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{name}</p>
            <p className="text-xs text-slate-400">{gradeLevel}</p>
          </div>
        </div>
      </td>

      {/* Academic Year */}
      <td className={`${tdStyle}`}>
        <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
          {academicYear}
        </span>
      </td>

      {/* Capacity */}
      <td className={`${tdStyle}`}>
        <div className="flex items-center gap-2 min-w-[100px]">
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {students.length}/{capacity}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className={`${tdStyle}`}>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
          ${
            isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td className={tdStyle}>
        <div className="flex items-center gap-2  transition-opacity">
          <ActionButtons type="view" category="classes" id={id} />

          <Modal>
            <Modal.Open opens="delete">
              <ActionButtons type="delete" category="classes" id={id} />
            </Modal.Open>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="class"
                itemName={name}
                onConfirm={() => deleteClass(id)}
                disabled={isDeleting}
              />
            </Modal.Window>

            <Modal.Open opens="update">
              <ActionButtons type="update" category="classes" id={id} />
            </Modal.Open>

            <Modal.Window name="update">
              <CreateUpdateClassForm classToUpdate={cls} />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default ClassRow;
