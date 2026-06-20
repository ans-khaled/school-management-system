import {
  FiSearch,
  FiUser,
  FiUsers,
  FiBookOpen,
  FiCalendar,
} from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function TeacherStateCards({ teachers = [], filteredTeachers = [] }) {
  const totalTeachers = teachers.length;
  const maleCount = teachers.filter((t) => t.gender === "male").length;
  const femaleCount = teachers.filter((t) => t.gender === "female").length;

  const totalClassrooms = teachers.reduce(
    (acc, t) => acc + (t.classrooms?.length ?? 0),
    0,
  );

  const totalSubjects = teachers.reduce(
    (acc, t) => acc + (t.subjects?.length ?? 0),
    0,
  );

  return (
    <StateCards
      cards={[
        {
          label: "Total Teachers",
          value: totalTeachers,
          bg: "bg-blue-50",
          text: "text-blue-500",
          icon: <FiUser />,
        },
        {
          label: "Filtered Results",
          value: filteredTeachers.length,
          bg: "bg-green-50",
          text: "text-green-500",
          icon: <FiSearch />,
        },
        {
          label: "Male / Female",
          value: `${maleCount} / ${femaleCount}`,
          bg: "bg-purple-50",
          text: "text-purple-500",
          icon: <FiUsers />,
        },
        {
          label: "Total Classrooms",
          value: totalClassrooms,
          bg: "bg-orange-50",
          text: "text-orange-500",
          icon: <FiCalendar />,
        },
        {
          label: "Total Subjects",
          value: totalSubjects,
          bg: "bg-pink-50",
          text: "text-pink-500",
          icon: <FiBookOpen />,
        },
      ]}
    />
  );
}

export default TeacherStateCards;
