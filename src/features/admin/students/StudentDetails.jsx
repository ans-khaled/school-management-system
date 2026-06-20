import {
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiHash,
  FiLayers,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils/helpers";
import useBackTitle from "../../../hooks/useBackTitle";

import Button from "../../../ui/Button";
import BackButton from "../../../ui/BackButton";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import ViewButton from "../../../ui/ViewButton";
import RemoveButton from "../../../ui/RemoveButton";
import AssignButton from "../../../ui/AssignButton";
import DetailsSectionsHeader from "../../../ui/DetailsSectionsHeader";

import StudentDetailsCard from "./StudentDetailsCard";
import useStudent from "./useStudent";
import useStudentMutations from "./useStudentMutations";
import CreateUpdateStudentForm from "./CreateUpdateStudentForm";
import StudentSubjectsList from "./StudentSubjectsList";
import StudentTeachersList from "./StudentTeachersList";

function StudentDetails() {
  const navigate = useNavigate();
  const backTitle = useBackTitle("Students");

  const { isDeleting, deleteStudent } = useStudentMutations();
  const { isLoading, student, error } = useStudent();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!student) return <div className="p-7 text-2xl">Student not found</div>;

  console.log(student);

  const {
    id,
    student_id: studentId,
    date_of_birth: dateOfBirth,
    enrollment_date: enrollmentDate,
    gender,
    phone: phoneNumber,
    address,
    user: { name, email } = {},
    parents,
    classrooms,
  } = student;

  const activeClassroom =
    classrooms.find((cls) => cls.pivot?.status === "active") ??
    classrooms[0] ??
    null;

  const {
    id: classroomId,
    name: className,
    grade_level: gradeLevel,
    academic_year: academicYear,
    pivot: { status, enrolled_at: enrolledAt } = {},
    subjects,
    teachers,
  } = activeClassroom ?? {};

  const primaryParent =
    parents.find((p) => p.pivot?.is_primary === 1) ?? parents[0] ?? null;

  const {
    id: parentId,
    user: { name: parentName, email: parentEmail } = {},
    phone: parentPhone,
    address: parentAddress,
    occupation,
    pivot: { relationship } = {},
  } = primaryParent ?? {};

  console.log(subjects, teachers);

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <BackButton title={backTitle} />

      {/* hero */}
      <div className={`bg-blue-500 rounded-2xl p-8 mb-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">
              {"Student"}
            </p>
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <p className="text-white/80 text-sm">{email}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
            {name?.[0]?.toUpperCase() ?? "?"}
          </div>
        </div>
      </div>

      {/*========== info cards =================*/}

      {/* Basic Information */}
      <StudentDetailsCard
        title="Basic Information"
        cardItemsList={[
          { icon: <FiMail />, label: "Email", value: email },
          { icon: <FiPhone />, label: "Phone", value: phoneNumber },
          { icon: <FiUsers />, label: "Gender", value: gender },
          {
            icon: <FiCalendar />,
            label: "Date of Birth",
            value: formatDate(dateOfBirth),
          },
          { icon: <FiHash />, label: "Student ID", value: studentId },
          {
            icon: <FiCalendar />,
            label: "Enrollment Date",
            value: formatDate(enrollmentDate),
          },

          {
            icon: <FiCheckCircle />,
            label: "Status",
            value: status ?? "—",
            badge: true, // ✅ renders as colored badge
          },
        ]}
      />

      {/* Academic Information */}
      <StudentDetailsCard
        title="Academic Information"
        warning={
          !activeClassroom &&
          "This student is not assigned to any classroom yet."
        }
        actions={
          activeClassroom && (
            <div>
              <ViewButton
                category="classes"
                id={classroomId}
                title="Classroom"
                backFrom="Student Details"
              />
            </div>
          )
        }
        cardItemsList={[
          { icon: <FiAward />, label: "Grade Level", value: gradeLevel ?? "—" },
          { icon: <FiLayers />, label: "Classroom", value: className ?? "—" },
          {
            icon: <FiCalendar />,
            label: "Academic Year",
            value: academicYear ?? "—",
          },
          {
            icon: <FiCalendar />,
            label: "Enrolled At",
            value: enrolledAt ? formatDate(enrolledAt) : "—",
          },
          { icon: <FiCheckCircle />, label: "Status", value: status ?? "—" },
        ]}
      />

      {/* SUBJECTS */}
      <div className="mb-4  gap-3">
        <div className="flex items-center justify-between my-4">
          <DetailsSectionsHeader>Enrolled Subjects</DetailsSectionsHeader>
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full border border-gray-200">
            {subjects?.length ?? 0} Subjects
          </span>
        </div>
        {!subjects?.length ? (
          <div className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-xl mb-4">
            ⚠️ This student is not enrolled in any subjects yet.
          </div>
        ) : (
          <StudentSubjectsList subjects={subjects} />
        )}
      </div>

      {/* TEACHERS */}
      <div className="mb-4  gap-3">
        <div className="flex items-center justify-between my-4">
          <DetailsSectionsHeader>Enrolled Teachers</DetailsSectionsHeader>
          <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full border border-gray-200">
            {teachers?.length ?? 0} Teachers
          </span>
        </div>
        {!teachers?.length ? (
          <div className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-xl mb-4">
            ⚠️ This student is not enrolled in any teacher yet.
          </div>
        ) : (
          <StudentTeachersList teachers={teachers} />
        )}
      </div>

      {/* PARENT INFO */}
      <StudentDetailsCard
        title="Parent Information"
        warning={
          !primaryParent && "No parent information linked to this student."
        }
        actions={
          <div className="flex items-center gap-2">
            {/* Assign parent — always visible */}
            <Modal>
              <Modal.Open opens="assign-parent">
                <AssignButton title="Parent" />
              </Modal.Open>
              <Modal.Window name="assign-parent">
                <div className="p-6">
                  <p>Assign Parent Form goes here</p>
                </div>
              </Modal.Window>

              {/* View + Remove — only when a parent exists */}
              {primaryParent && (
                <>
                  <ViewButton
                    category="parents"
                    id={parentId}
                    title="Parent"
                    backFrom="Student Details"
                  />

                  <Modal.Open opens="remove-parent">
                    <RemoveButton />
                  </Modal.Open>
                  <Modal.Window name="remove-parent">
                    <ConfirmDelete
                      resourceName="parent"
                      itemName={parentName}
                      onConfirm={() => {
                        // TODO: call removeParent(studentId, parentId)
                      }}
                      disabled={false}
                    />
                  </Modal.Window>
                </>
              )}
            </Modal>
          </div>
        }
        cardItemsList={[
          { icon: <FiUser />, label: "Name", value: parentName ?? "—" },
          { icon: <FiPhone />, label: "Phone", value: parentPhone ?? "—" },
          { icon: <FiMail />, label: "Email", value: parentEmail ?? "—" },
          { icon: <FiMapPin />, label: "Address", value: parentAddress ?? "—" },
          {
            icon: <FiBriefcase />,
            label: "Occupation",
            value: occupation ?? "—",
          },
          {
            icon: <FiUsers />,
            label: "Relationship",
            value: relationship ?? "—",
          },
        ]}
      />

      {/* ADDRESS  */}
      <StudentDetailsCard
        title="Address"
        cardItemsList={[
          { icon: <FiMapPin />, label: "Address", value: address ?? "—" },
        ]}
      />

      {/* FINANCE   */}
      <StudentDetailsCard
        title="Finance"
        warning={
          !activeClassroom && "This student is not have fees status yet."
        }
        cardItemsList={[
          {
            icon: <FiCreditCard />,
            label: "Fees Status",
            // value: student.feesStatus,
            value: "_",
          },
        ]}
      />

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
                deleteStudent(id, {
                  onSuccess: () => navigate("/admin/students"),
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
            <CreateUpdateStudentForm
              studentToUpdate={{ ...student, name, email }}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

export default StudentDetails;
