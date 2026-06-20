import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";

import CreateUpdateSubjectForm from "./CreateUpdateSubjectForm";
import useSubjectMutations from "./useSubjectMutations";

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

function SubjectRow({ subject, index }) {
  const navigate = useNavigate();
  const { deleteSubject, isDeleting } = useSubjectMutations();

  const {
    id,
    name,
    code,
    credits,
    is_active: isActive,
    type,
    classrooms,
    teachers,
  } = subject;

  const uniqueTeachers = [...new Map(teachers.map((t) => [t.id, t])).values()];
  const uniqueGrades = [...new Set(classrooms.map((c) => c.grade_level))];
  const totalWeeklyHours = classrooms.reduce(
    (acc, c) => acc + c.pivot.weekly_hours,
    0,
  );

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* Subject */}
      <td className={tdStyle}>
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${COLORS[index % COLORS.length]}`}
          >
            {name[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{name}</p>
            <p className="text-xs text-slate-400">
              {code} • {credits} credits
            </p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className={tdStyle}>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-orange-50 text-orange-500 capitalize">
          {type}
        </span>
      </td>

      {/* Credits */}
      <td className={tdStyle}>
        <span className="font-semibold text-slate-700">{credits}</span>
        <span className="text-xs text-slate-400 ml-1">cr</span>
      </td>

      {/* !!!!!!!!!!!!!!!! */}
      {/* Teachers */}
      <td className={tdStyle}>
        <div className="flex flex-col gap-0.5">
          {uniqueTeachers.map((t) => (
            <span key={t.id} className="text-sm text-slate-600">
              - {t.user?.name}
            </span>
          ))}
        </div>
      </td>

      {/* Classrooms */}
      <td className={tdStyle}>
        <div className="flex items-center gap-1.5 text-slate-600">
          <FiUsers size={12} />
          <span className="text-sm">{classrooms.length}</span>
        </div>
      </td>

      {/* Grades */}
      <td className={tdStyle}>
        <div className="flex flex-wrap gap-1">
          {uniqueGrades.map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-500"
            >
              {g}
            </span>
          ))}
        </div>
      </td>

      {/* Weekly Hours */}
      <td className={tdStyle}>
        <span className="font-semibold text-slate-700">{totalWeeklyHours}</span>
        <span className="text-xs text-slate-400 ml-1">hrs/wk</span>
      </td>

      {/* Status */}
      <td className={tdStyle}>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-400"}`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* actions */}
      <td className={tdStyle}>
        <div className="flex items-center gap-2 transition-opacity">
          <ActionButtons type="view" category="subjects" id={id} />
          <Modal>
            <Modal.Open opens="subject-form">
              <ActionButtons type="update" category="subjects" id={id} />
            </Modal.Open>
            <Modal.Window name="subject-form">
              <CreateUpdateSubjectForm subjectToUpdate={subject} />
            </Modal.Window>

            <Modal.Open opens="delete">
              <ActionButtons type="delete" category="subjects" id={id} />
            </Modal.Open>
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="subject"
                itemName={name}
                onConfirm={() => {
                  deleteSubject(id, {
                    onSuccess: () => navigate("/admin/subjects"),
                  });
                }}
                disabled={isDeleting}
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default SubjectRow;
