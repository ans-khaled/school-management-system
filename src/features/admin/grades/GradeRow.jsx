import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import CreateUpdateGradeForm from "./CreateUpdateGradeForm";
import useGradeMutations from "./useGradeMutations";

const tdStyle = "px-6 py-4";

function GradeRow({ grade }) {
  const { isDeleting, deleteGrade } = useGradeMutations();

  const {
    id,
    score,
    remarks,
    student = {},
    exam = {},
    grade: examGrade,
  } = grade;

  const { student_id, user: { name: studentName } = {} } = student;
  const { name: examName, type: examType, max_score } = exam;

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* Student ID */}
      <td className={`${tdStyle} text-slate-500 font-mono text-xs`}>
        {student_id}
      </td>

      {/* Student Name */}
      <td className={tdStyle}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
            {(studentName?.[0] ?? "?").toUpperCase()}
          </div>
          <span className="font-semibold text-slate-800">
            {studentName || "—"}
          </span>
        </div>
      </td>

      {/* Exam Name */}
      <td className={tdStyle}>
        <div className="flex flex-col">
          <span className="text-slate-700 font-medium">{examName || "—"}</span>
          <span className="text-xs text-slate-400 capitalize">
            {examType || ""}
          </span>
        </div>
      </td>

      {/* Score */}
      <td className={tdStyle}>
        {score !== null ? (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
              score >= max_score * 0.85
                ? "bg-green-50 text-green-600"
                : score >= max_score * 0.6
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-red-50 text-red-500"
            }`}
          >
            {score} / {max_score}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">Not graded</span>
        )}
      </td>

      {/* GRADE */}
      <td className={tdStyle}>
        {examGrade ? (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
              examGrade === "A"
                ? "bg-green-50 text-green-600"
                : examGrade === "B"
                  ? "bg-blue-50 text-blue-500"
                  : examGrade === "C"
                    ? "bg-yellow-50 text-yellow-600"
                    : examGrade === "D"
                      ? "bg-orange-50 text-orange-500"
                      : "bg-red-50 text-red-500"
            }`}
          >
            {examGrade}
          </span>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        )}
      </td>

      {/* Remarks */}
      <td className={`${tdStyle} text-slate-500`}>{remarks || "—"}</td>

      {/* Actions */}
      <td className={tdStyle}>
        <div className="flex items-center gap-2 transition-opacity">
          <Modal>
            <Modal.Open opens="update-grade-form">
              <ActionButtons type="update" category="grades" />
            </Modal.Open>
            <Modal.Window name="update-grade-form">
              <CreateUpdateGradeForm gradeToUpdate={grade} />
            </Modal.Window>

            <Modal.Open opens="delete-grade">
              <ActionButtons type="delete" />
            </Modal.Open>

            <Modal.Window name="delete-grade">
              <ConfirmDelete
                resourceName="grade"
                itemName={studentName}
                disabled={isDeleting}
                onConfirm={() => deleteGrade(id)}
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default GradeRow;
