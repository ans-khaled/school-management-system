import { FiAward, FiBook, FiClock, FiUsers } from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function SubjectStateCards({ subjects }) {
  const totalCredits = subjects.reduce(
    (sum, subject) => sum + (subject.credits ?? 0),
    0,
  );

  const totalTeachers = new Set(
    subjects.flatMap((subject) =>
      (subject.teachers ?? []).map((teacher) => teacher.id),
    ),
  ).size;

  const totalWeeklyHours = subjects.reduce(
    (sum, subject) => sum + (subject.pivot?.weekly_hours ?? 0),
    0,
  );

  return (
    <StateCards
      cards={[
        {
          label: "Subjects Enrolled",
          value: subjects.length,
          icon: <FiBook />,
          bg: "bg-blue-50",
          text: "text-blue-500",
        },
        {
          label: "Total Teachers",
          value: totalTeachers,
          icon: <FiUsers />,
          bg: "bg-purple-50",
          text: "text-purple-500",
        },
        {
          label: "Weekly Hours",
          value: totalWeeklyHours,
          icon: <FiClock />,
          bg: "bg-amber-50",
          text: "text-amber-500",
        },
        {
          label: "Total Credits",
          value: totalCredits,
          icon: <FiAward />,
          bg: "bg-green-50",
          text: "text-green-500",
        },
      ]}
    />
  );
}

export default SubjectStateCards;
