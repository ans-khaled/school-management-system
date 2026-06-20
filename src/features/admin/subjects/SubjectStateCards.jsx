import { FiBook, FiBookOpen, FiUser, FiUsers } from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function SubjectStateCards({ subjects }) {
  const uniqueTeachers = new Set(
    subjects.flatMap((s) => s.teachers.map((t) => t.id)),
  ).size;

  // Unique classrooms across all subjects
  const uniqueClassrooms = new Set(
    subjects.flatMap((s) => s.classrooms.map((c) => c.id)),
  ).size;

  const coreSubjects = subjects.filter((s) => s.type === "core").length;

  const totalSubjectWithNoClassroom = subjects.reduce(
    (acc, curr) => acc + (curr.classrooms?.length ? 0 : 1),
    0,
  );

  const totalActiveSubjects = subjects.filter((s) => s.is_active).length;

  return (
    <StateCards
      cards={[
        {
          label: "Total Subjects",
          text: "text-blue-500",
          icon: <FiBook />,
          value: subjects.length,
        },
        {
          label: "Core Subjects",
          text: "text-orange-500",
          icon: <FiBook />,
          value: coreSubjects,
        },
        {
          label: "Total Teachers",
          text: "text-purple-500",
          icon: <FiUser />,
          value: uniqueTeachers,
        },
        {
          label: "Total Classrooms",
          text: "text-red-500",
          icon: <FiUsers />,
          value: uniqueClassrooms,
        },
        {
          label: "Total Subjects with no Classrooms",
          text: "text-yellow-500",
          icon: <FiBookOpen />,
          value: totalSubjectWithNoClassroom,
        },
        {
          label: "Total Active Subjects",
          text: "text-orange-500",
          icon: <FiUsers />,
          value: totalActiveSubjects,
        },
      ]}
    />
  );
}

export default SubjectStateCards;
