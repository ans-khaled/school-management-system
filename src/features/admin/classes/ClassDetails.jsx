import {
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiHash,
  FiLayers,
  FiUsers,
} from "react-icons/fi";
import { formatDate } from "../../../utils/helpers";

import useGetItem from "../../../hooks/useGetItem";
import useBackTitle from "../../../hooks/useBackTitle";

import BackButton from "../../../ui/BackButton";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Modal from "../../../ui/Modal";
import AssignButton from "../../../ui/AssignButton";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Button from "../../../ui/Button";
import DetailsSectionsHeader from "../../../ui/DetailsSectionsHeader";

import ClassroomDetailsCard from "./ClassroomDetailsCard";
import CreateUpdateClassForm from "./CreateUpdateClassForm";
import ClassStudentsList from "./ClassStudentsList";
import AssignStudentForm from "./AssignStudentForm";
import ClassSubjectsList from "./ClassSubjectList";
import AssignUpdateSubjectForm from "./AssignUpdateSubjectForm";
import ClassTeachersList from "./ClassTeacherList";
import AssginUpdateTeacherForm from "./AssginUpdateTeacherForm";
import useClassMutations from "./useClassMutations";
import { useNavigate } from "react-router-dom";

function ClassDetails() {
  const navigate = useNavigate();
  const backTitle = useBackTitle("Classes");
  const { deleteClass, isDeleting } = useClassMutations();

  const { isLoading, item: cls, error } = useGetItem("classrooms");

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!cls) return <p>No Classroom Exist</p>;

  const {
    id,
    name,
    grade_level: gradeLevel,
    academic_year: academicYear,
    capacity,
    description,
    is_active: isActive,
    created_at: createdAt,
    teachers,
    subjects,
    students,
  } = cls;

  console.log(cls);

  const uniqueTeachers = [...new Map(teachers.map((t) => [t.id, t])).values()];
  const uniqueSubjects = [...new Map(subjects.map((s) => [s.id, s])).values()];

  const totalWeeklyHours = uniqueSubjects.reduce(
    (acc, s) => acc + (s.pivot?.weekly_hours || 0),
    0,
  );

  console.log("Classroom details: ", cls);

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <BackButton title={backTitle} />

      {/* Hero */}
      <div className="bg-indigo-500 rounded-2xl p-8 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">
              {gradeLevel}
            </p>
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
            {name.slice(name.length - 2, name.length)}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <ClassroomDetailsCard
        title="Basic Information"
        cardItemsList={[
          { icon: <FiHash />, label: "Grade Level", value: gradeLevel },
          { icon: <FiCalendar />, label: "Academic Year", value: academicYear },
          { icon: <FiUsers />, label: "Capacity", value: capacity },
          {
            icon: <FiUsers />,
            label: "Enrolled Students",
            value: students.length,
          },
          {
            icon: <FiCalendar />,
            label: "Created At",
            value: formatDate(createdAt),
          },
          {
            icon: <FiCheckCircle />,
            label: "Status",
            value: isActive ? "active" : "inactive",
            badge: true,
          },
        ]}
      />

      {/* Teachers Table */}
      <div>
        <DetailsSectionsHeader>Teachers</DetailsSectionsHeader>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-slate-800">
              Total Teachers ({teachers.length})
            </p>

            <Modal>
              <Modal.Open opens="assign-teacher">
                <AssignButton title="Teacher" />
              </Modal.Open>
              <Modal.Window name="assign-teacher">
                <AssginUpdateTeacherForm classroomId={id} />
              </Modal.Window>
            </Modal>
          </div>

          {teachers.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-md">
              No teachers found.
            </div>
          ) : (
            <ClassTeachersList teachers={teachers} classroomId={id} />
          )}
        </div>
      </div>

      {/* Subjects Table */}
      <div>
        <DetailsSectionsHeader>Subjects</DetailsSectionsHeader>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-slate-800">
              Total Subjects ({subjects.length})
            </p>

            <Modal>
              <Modal.Open opens="assign-subject">
                <AssignButton title="Subject" />
              </Modal.Open>
              <Modal.Window name="assign-subject">
                <AssignUpdateSubjectForm classroomId={id} />
              </Modal.Window>
            </Modal>
          </div>

          {subjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-md">
              No Subjects found.
            </div>
          ) : (
            <ClassSubjectsList subjects={subjects} classroomId={id} />
          )}
        </div>
      </div>

      {/* Capacity Overview */}
      <ClassroomDetailsCard
        title="Capacity Overview"
        cardItemsList={[
          { icon: <FiUsers />, label: "Total Capacity", value: capacity },
          {
            icon: <FiUsers />,
            label: "Enrolled Students",
            value: students.length,
          },
          {
            icon: <FiBarChart2 />,
            label: "Available Seats",
            value: capacity - students.length,
          },
          {
            icon: <FiBarChart2 />,
            label: "Fill Rate",
            value: `${Math.round((students.length / capacity) * 100)}%`,
          },
          {
            icon: <FiClock />,
            label: "Total Weekly Hours",
            value: `${totalWeeklyHours} hrs/wk`,
          },
          {
            icon: <FiLayers />,
            label: "Total Subjects",
            value: uniqueSubjects.length,
          },
        ]}
      />

      {/* Students Table */}
      <div>
        <DetailsSectionsHeader>Students</DetailsSectionsHeader>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-slate-800">
              Total Students ({students.length})
            </p>

            <Modal>
              <Modal.Open opens="assign-student">
                <AssignButton title="Student" />
              </Modal.Open>
              <Modal.Window name="assign-student">
                <AssignStudentForm classroomId={id} />
              </Modal.Window>
            </Modal>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-md">
              No students found.
            </div>
          ) : (
            <ClassStudentsList students={students} classroomId={id} />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-300">
          <Modal>
            <Modal.Open opens="delete">
              <Button variation="danger">Delete</Button>
            </Modal.Open>
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="student"
                itemName={name}
                onConfirm={() => {
                  deleteClass(id, {
                    onSuccess: () => navigate("/admin/classes"),
                  });
                }}
                disabled={isDeleting}
                onCloseModal
              />
            </Modal.Window>

            <Modal.Open opens="student-form">
              <Button>Update</Button>
            </Modal.Open>
            <Modal.Window name="student-form">
              <CreateUpdateClassForm classToUpdate={cls} />
            </Modal.Window>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ClassDetails;
