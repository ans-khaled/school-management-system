import {
  FiMail,
  FiPhone,
  FiUsers,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiMapPin,
  FiHash,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import BackButton from "../../../ui/BackButton";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Button from "../../../ui/Button";
import DetailsSectionsHeader from "../../../ui/DetailsSectionsHeader";

import useBackTitle from "../../../hooks/useBackTitle";
import useGetItem from "../../../hooks/useGetItem";

import { formatDate } from "../../../utils/helpers";

import useTeacherMutations from "./useTeacherMutations";
import TeacherDetailsCard from "./TeacherDetailsCard";
import TeacherClassroomsList from "./TeacherClassroomsList";
import TeacherSubjectList from "./TeacherSubjectList";
import CreateUpdateTeacherForm from "./CreateUpdateTeacherForm";

function TeacherDetails() {
  const backTitle = useBackTitle("Teachers");
  const navigate = useNavigate();

  const { item: teacher, isLoading, error } = useGetItem("teachers");
  const { isDeleting, deleteTeacher } = useTeacherMutations();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  const {
    id,
    teacher_id,
    address,
    gender,
    date_of_birth: dateOfBirth,
    hire_date: hireDate,
    qualification,
    subject_specialization: subjectSpecialization,
    phone,
    classrooms = [],
    subjects = [],
    user: { name, email } = {},
  } = teacher;

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <BackButton title={backTitle} />

      {/* Hero */}
      <div className="bg-blue-500 rounded-2xl p-8 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Teacher</p>
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <p className="text-white/80 text-sm">{email}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
            {name?.[0]?.toUpperCase() ?? "?"}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <TeacherDetailsCard
        title="Basic Information"
        cardItemsList={[
          { icon: <FiMail />, label: "Email", value: email ?? "—" },
          { icon: <FiPhone />, label: "Phone", value: phone ?? "—" },
          { icon: <FiUsers />, label: "Gender", value: gender ?? "—" },
          {
            icon: <FiCalendar />,
            label: "Date of Birth",
            value: formatDate(dateOfBirth) ?? "—",
          },
          { icon: <FiHash />, label: "Teacher ID", value: teacher_id ?? "—" },
          {
            icon: <FiCalendar />,
            label: "Hire Date",
            value: formatDate(hireDate) ?? "—",
          },
        ]}
      />

      {/* Professional Information */}
      <TeacherDetailsCard
        title="Professional Information"
        cardItemsList={[
          {
            icon: <FiBookOpen />,
            label: "Specialization",
            value: subjectSpecialization ?? "—",
          },
          {
            icon: <FiAward />,
            label: "Qualification",
            value: qualification ?? "—",
          },
        ]}
      />

      {/* Address */}
      <TeacherDetailsCard
        title="Address"
        cardItemsList={[
          { icon: <FiMapPin />, label: "Address", value: address ?? "—" },
        ]}
      />

      {/* Classrooms */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <DetailsSectionsHeader>Enrolled Classrooms</DetailsSectionsHeader>
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full border border-gray-200">
            {classrooms.length} classrooms
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-semibold text-slate-800">
              Total Classrooms ({classrooms.length})
            </p>
          </div>{" "}
          {classrooms.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-2xl shadow-sm">
              Not assigned to any classroom yet.
            </div>
          ) : (
            <TeacherClassroomsList classrooms={classrooms} teacherId={id} />
          )}
        </div>
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <DetailsSectionsHeader>Enrolled Subjects</DetailsSectionsHeader>
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full border border-gray-200">
            {subjects.length} subjects
          </span>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm bg-white rounded-2xl shadow-sm">
            No subjects assigned yet.
          </div>
        ) : (
          <TeacherSubjectList subjects={subjects} />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-300">
        <Modal>
          <Modal.Open opens="delete-teacher">
            <Button variation="danger">Delete</Button>
          </Modal.Open>
          <Modal.Window name="delete-teacher">
            <ConfirmDelete
              resourceName="teacher"
              itemName={name}
              onConfirm={() =>
                deleteTeacher(id, {
                  onSuccess: () => navigate("/admin/teachers"),
                })
              }
              disabled={isDeleting}
            />
          </Modal.Window>

          <Modal.Open opens="update-teacher">
            <Button>Update</Button>
          </Modal.Open>
          <Modal.Window name="update-teacher">
            <CreateUpdateTeacherForm teacherToUpdate={teacher} />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

export default TeacherDetails;
