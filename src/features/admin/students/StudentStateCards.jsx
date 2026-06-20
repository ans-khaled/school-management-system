import {
  FiSearch,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiUserX,
} from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function StudentStateCards({ students, filteredStudents }) {
  // Student is active if ANY classroom pivot is active
  // student is actively enrolled
  const activeStudents = students.filter((stu) =>
    stu.classrooms.some((cls) => cls.pivot?.status === "active"),
  ).length;

  const inActiveStudents = students.filter(
    (stu) => stu.classrooms[0]?.pivot?.status === "inactive",
  ).length;

  const maleStudents = students.filter((stu) => stu.gender === "male").length;
  const femaleStudents = students.filter(
    (stu) => stu.gender === "female",
  ).length;

  return (
    <StateCards
      cards={[
        {
          label: "Total Students",
          icon: <FiUsers />,
          text: "text-blue-500",
          bg: "bg-blue-50",
          value: students.length,
        },
        {
          label: "Filtered Results",
          icon: <FiSearch />,
          text: "text-violet-500",
          bg: "bg-violet-50",
          value: filteredStudents.length,
        },
        {
          label: "Active Students",
          icon: <FiUserCheck />,
          text: "text-green-500",
          bg: "bg-green-50",
          value: activeStudents,
        },
        {
          label: "Inactive Students",
          icon: <FiUserX />,
          text: "text-red-500",
          bg: "bg-red-50",
          value: inActiveStudents,
        },
        {
          label: "Male Students",
          icon: <FiUser />,
          text: "text-sky-500",
          bg: "bg-sky-50",
          value: maleStudents,
        },
        {
          label: "Female Students",
          icon: <FiUser />,
          text: "text-pink-500",
          bg: "bg-pink-50",
          value: femaleStudents,
        },
      ]}
    />
  );
}

export default StudentStateCards;
