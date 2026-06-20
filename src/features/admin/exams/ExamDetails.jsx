import {
  FiFileText,
  FiTag,
  FiWifi,
  FiStar,
  FiCalendar,
  FiClock,
  FiBook,
  FiHash,
  FiAward,
  FiFolder,
  FiCheckCircle,
  FiHome,
  FiUsers,
  FiClipboard,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import BackButton from "../../../ui/BackButton";
import ViewButton from "../../../ui/ViewButton";
import Button from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";

import useGetItem from "../../../hooks/useGetItem";
import useBackTitle from "../../../hooks/useBackTitle";

import { formatDate } from "../../../utils/helpers";

import ExamDetailsCard from "./ExamDetailsCard";
import useExamMutations from "./useExamMutations";
import CreateUpdateExamForm from "./CreateUpdateExamForm";

function ExamDetails() {
  const navigate = useNavigate();
  const backTitle = useBackTitle("Exams");

  const { isLoading, item: exam, error } = useGetItem("exams");
  const { isDeleting, deleteExam } = useExamMutations();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  const {
    id,
    name,

    classroom: {
      id: classroomId,
      name: className,
      grade_level: gradeLevel,
      capacity,
      academic_year: academicYear,
      is_active: isActiveClass,
    } = {},

    subject: {
      id: subjectId,
      code,
      name: subjectName,
      credits,
      is_active: isActiveSub,
      type: subjectType,
    },
    scheduled_at: scheduledAt,
    duration_minutes: durationMinutes,
    instructions,
    max_score: maxScore,
    type,
    is_online: isOnline,
  } = exam;

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <BackButton title={backTitle} />

      {/* hero */}
      <div className="bg-blue-500 rounded-2xl p-8 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Exam</p>
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
            {name?.[0]?.toUpperCase() ?? "?"}
          </div>
        </div>
      </div>

      {/* General Information */}
      <ExamDetailsCard
        title="General Information"
        cardItemsList={[
          { icon: <FiFileText />, label: "Exam Name", value: name },
          { icon: <FiTag />, label: "Type", value: type },
          {
            icon: <FiWifi />,
            label: "Mode",
            value: isOnline ? "Online" : "Offline",
            badge: true,
          },
          { icon: <FiStar />, label: "Max Score", value: maxScore },
          {
            icon: <FiCalendar />,
            label: "Scheduled At",
            value: formatDate(scheduledAt),
          },
          {
            icon: <FiClock />,
            label: "Duration",
            value: `${durationMinutes} min`,
          },
        ]}
      />

      {/* Subject */}
      <ExamDetailsCard
        title="Subject"
        actions={
          <ViewButton
            category="subjects"
            backFrom="exam details"
            title="Subject"
            id={subjectId}
          />
        }
        cardItemsList={[
          { icon: <FiBook />, label: "Subject Name", value: subjectName },
          { icon: <FiHash />, label: "Code", value: code },
          { icon: <FiAward />, label: "Credits", value: credits },
          { icon: <FiFolder />, label: "Subject Type", value: subjectType },
          {
            icon: <FiCheckCircle />,
            label: "Status",
            value: isActiveSub ? "active" : "inactive",
            badge: true,
          },
        ]}
      />

      {/* Classroom */}
      <ExamDetailsCard
        title="Classroom"
        actions={
          <ViewButton
            category="classes"
            backFrom="exam details"
            title="Classroom"
            id={classroomId}
          />
        }
        cardItemsList={[
          { icon: <FiHome />, label: "Classroom", value: className },
          { icon: <FiHash />, label: "Grade Level", value: gradeLevel },
          { icon: <FiUsers />, label: "Capacity", value: capacity },
          { icon: <FiCalendar />, label: "Academic Year", value: academicYear },
          {
            icon: <FiCheckCircle />,
            label: "Status",
            value: isActiveClass ? "active" : "inactive",
            badge: true,
          },
        ]}
      />

      {/* Instructions */}
      {instructions && (
        <ExamDetailsCard
          title="Instructions"
          cardItemsList={[
            {
              icon: <FiClipboard />,
              label: "Instructions",
              value: instructions,
            },
          ]}
        />
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-300">
        <Modal>
          <Modal.Open opens="delete-exam">
            <Button
              variation="danger"
              disabled={isDeleting}
              onClick={() =>
                deleteExam(id, { onSuccess: () => navigate("/admin/exams") })
              }
            >
              Delete
            </Button>
          </Modal.Open>
          <Modal.Window name="delete-exam">
            <ConfirmDelete
              resourceName="Exam"
              itemName={`${name} - ${subjectName}`}
              disabled={isDeleting}
              onConfirm={() =>
                deleteExam(id, { onSuccess: () => navigate("/admin/exams") })
              }
            />
          </Modal.Window>

          <Modal.Open opens="update-exam-form">
            <Button>Update</Button>
          </Modal.Open>
          <Modal.Window name="update-exam-form">
            <CreateUpdateExamForm examToUpdate={exam} />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

export default ExamDetails;
