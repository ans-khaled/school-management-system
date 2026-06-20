import {
  Bookmark,
  Building2,
  CheckCircle,
  Clock,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import BackButton from "../../../ui/BackButton";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import StateCards from "../../../ui/StateCards";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Button from "../../../ui/Button";

import useGetItem from "../../../hooks/useGetItem";
import useBackTitle from "../../../hooks/useBackTitle";

import useSubjectMutations from "./useSubjectMutations";
import TeachersDetailsPerSubject from "./TeachersDetailsPerSubject";
import ClassroomsDetailsPerSubject from "./ClassroomsDetailsPerSubject";
import CreateUpdateSubjectForm from "./CreateUpdateSubjectForm";
import AssignUpdateSubjectForm from "./AssignUpdateSubjectForm";

function SubjectDetails() {
  const backTitle = useBackTitle("Subjects");
  const navigate = useNavigate();

  const { deleteSubject, isDeleting } = useSubjectMutations();
  const { isLoading, item: subject, error } = useGetItem("subjects");

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!subject) return <p>No subject Exist</p>;

  const {
    id,
    name,
    code,
    credits,
    is_active: isActive,
    type,
    description,
    classrooms,
    teachers,
  } = subject;

  const totalWeeklyHours = classrooms.reduce(
    (acc, curr) => acc + (curr.pivot.weekly_hours ?? 0),
    0,
  );

  const maxWeeklyHours = classrooms.length
    ? Math.max(...classrooms.map((cls) => cls.pivot?.weekly_hours ?? 0))
    : 0;

  const totalCapacity = classrooms.reduce(
    (acc, curr) => acc + (curr.capacity ?? 0),
    0,
  );

  const uniqueTeachers = teachers.filter(
    (t, i, arr) => arr.findIndex((x) => x.teacher_id === t.teacher_id) === i,
  );

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      {/* Back button and Assign classrooms and teachers */}
      <div className="flex justify-between items-center mb-5">
        <BackButton title={backTitle} />

        <Modal>
          <Modal.Open opens="assignment-form">
            <Button>Assign Classroom & Teacher</Button>
          </Modal.Open>

          <Modal.Window name="assignment-form">
            <AssignUpdateSubjectForm subject={subject} />
          </Modal.Window>
        </Modal>
      </div>

      {/* hero */}
      <div className="bg-blue-500 border border-gray-200 rounded-2xl p-6 mb-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white">
              <Bookmark size={11} /> {type}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                isActive
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <CheckCircle size={11} />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">{name}</h1>
          <p className="text-sm text-white mb-1">
            {code} · {credits} credits
          </p>
          <p className="text-sm text-white">
            {description || "No description available"}
          </p>
        </div>
        <div className="w-14 h-14 bg-violet-50 rounded-xl flex items-center justify-center text-xl font-semibold text-blue-500 shrink-0">
          {name?.[0]?.toUpperCase()}
        </div>
      </div>

      {/* ── Stats ── */}
      <StateCards
        cards={[
          {
            icon: <Building2 />,
            label: "Classrooms",
            value: classrooms.length,
            text: "text-blue-500",
          },
          {
            icon: <Clock />,
            label: "Weekly hours",
            value: totalWeeklyHours,
            text: "text-green-500",
          },
          {
            icon: <Users />,
            label: "Total capacity",
            value: totalCapacity,
            text: "text-purple-500",
          },
          {
            icon: <User />,
            label: "Teachers",
            value: uniqueTeachers.length,
            text: "text-yellow-500",
          },
        ]}
      />

      {/* ── Classrooms ── */}
      <ClassroomsDetailsPerSubject
        classrooms={classrooms}
        maxWeeklyHours={maxWeeklyHours}
        subjectId={id}
      />

      {/* ── Teachers ── */}
      <TeachersDetailsPerSubject teachers={uniqueTeachers} />

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-300">
        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete</Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="subject"
              itemName={name}
              onConfirm={() =>
                deleteSubject(id, {
                  onSuccess: () => {
                    navigate("/admin/subjects");
                  },
                })
              }
              disabled={isDeleting}
            />
          </Modal.Window>

          <Modal.Open opens="subject-form">
            <Button>Update</Button>
          </Modal.Open>
          <Modal.Window name="subject-form">
            <CreateUpdateSubjectForm subjectToUpdate={subject} />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

export default SubjectDetails;
