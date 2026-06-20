import {
  FiBook,
  FiCalendar,
  FiClock,
  FiFileText,
  FiHome,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import CreateUpdateExamForm from "./CreateUpdateExamForm";
import useExamMutation from "./useExamMutations";

function ExamCard({ exam }) {
  const navigate = useNavigate();
  const { deleteExam, isDeleting } = useExamMutation();

  const {
    id,
    name,
    classroom: {
      name: className,
      grade_level: gradeLevel,
      capacity,
      academic_year: academicYear,
      description,
      is_active: isActive,
    } = {},

    subject: { code, name: subjectName, credits, is_active: isActiveSub, type },

    duration_minutes: durationMinutes,
    instructions,
    max_score: maxScore,
    type: examType,
    is_online: isOnline,
  } = exam;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      {/* card top color bar */}
      <div className={`bg-blue-500 px-5 pt-5 pb-8 relative`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium">{className}</p>
            <h3 className="text-white font-bold text-lg mt-0.5">{name}</h3>{" "}
            <p className="text-white/60 text-xs mt-0.5">{subjectName}</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {subjectName[0]}
          </div>
        </div>
      </div>

      {/* card body */}
      <div className="mt-2 mx-4 bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="space-y-2">
          {/* Exam name */}
          <div className="flex items-center gap-2 text-slate-500 text-s">
            <FiFileText size={11} className="text-blue-500" />
            <span className="font-medium text-slate-700">{name}</span>
          </div>

          {/* Class name */}
          <div className="flex items-center gap-2 text-slate-500 text-s">
            <FiHome size={11} className="text-blue-500" />
            <span>{className}</span>
          </div>

          {/* Subject code + credits */}
          <div className="flex items-center gap-2 text-slate-500 text-s">
            <FiBook size={11} className="text-blue-500" />
            <span>
              {code} • {credits} credits
            </span>
          </div>

          {/* Duration + score - already there ✅ */}
          <div className="flex items-center gap-2 text-slate-500 text-s">
            <FiClock size={11} className="text-blue-500" />
            <span>
              {durationMinutes} min • {maxScore} marks
            </span>
          </div>

          {/* Academic year */}
          <div className="flex items-center gap-2 text-slate-500 text-s">
            <FiCalendar size={11} className="text-blue-500" />
            <span>{academicYear}</span>
          </div>

          {/* Active status badge */}
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                isActive
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-400"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-500`}
            >
              {type} {/* subject type */}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                isOnline
                  ? "bg-purple-100 text-purple-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* card footer */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          onClick={() => navigate(`/admin/exams/${id}`)}
          className={`cursor-pointer flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-blue-500 hover:opacity-90 transition-opacity`}
        >
          View Details
        </button>

        <Modal>
          <Modal.Open opens="update-exam-form">
            <ActionButtons type="update" category="exams" />
          </Modal.Open>
          <Modal.Window name="update-exam-form">
            <CreateUpdateExamForm examToUpdate={exam} />
          </Modal.Window>

          <Modal.Open opens="delete-exam">
            <ActionButtons type="delete" category="exams" />
          </Modal.Open>
          <Modal.Window name="delete-exam">
            <ConfirmDelete
              resourceName="exam"
              itemName={`${name} - ${subjectName}`}
              disabled={isDeleting}
              onConfirm={() => deleteExam(id)}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

export default ExamCard;
