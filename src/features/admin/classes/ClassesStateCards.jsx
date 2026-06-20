import StateCards from "../../../ui/StateCards";
import { FiBarChart2, FiBook, FiUser, FiUsers } from "react-icons/fi";

function ClassesStateCards({ filteredClasses }) {
  const totalStudents = filteredClasses.reduce(
    (acc, cls) => acc + cls.students.length,
    0,
  );

  const totalTeachers = new Set(
    filteredClasses.flatMap((cls) => cls.teachers.map((t) => t.id)),
  ).size;

  const totalSubjects = new Set(
    filteredClasses.flatMap((cls) => cls.subjects.map((s) => s.id)),
  ).size;

  const avgClassSize = filteredClasses.length
    ? Math.round(totalStudents / filteredClasses.length)
    : 0;

  return (
    <StateCards
      cards={[
        {
          label: "Total Classes",
          value: filteredClasses.length,
          bg: "bg-blue-50",
          text: "text-blue-500",
          icon: <FiBook />,
        },
        {
          label: "Total Students",
          value: totalStudents,
          bg: "bg-green-50",
          text: "text-green-500",
          icon: <FiUsers />,
        },
        {
          label: "Total Teachers",
          value: totalTeachers,
          bg: "bg-purple-50",
          text: "text-purple-500",
          icon: <FiUser />,
        },
        {
          label: "Total Subjects",
          value: totalSubjects,
          bg: "bg-yellow-50",
          text: "text-yellow-500",
          icon: <FiBook />,
        },
        {
          label: "Avg Class Size",
          value: avgClassSize,
          bg: "bg-orange-50",
          text: "text-orange-500",
          icon: <FiBarChart2 />,
        },
      ]}
    />
  );
}

export default ClassesStateCards;
