import {
  FiAward,
  FiBarChart2,
  FiFileText,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function GradesStateCards({ grades, filteredGrades }) {
  // only grades that have a score
  const gradedList = filteredGrades.filter((g) => g.score !== null);

  // average score as percentage of max_score
  const avgPct =
    gradedList.length > 0
      ? Math.round(
          gradedList.reduce((sum, g) => {
            const max = g.exam?.max_score || 100;
            return sum + (g.score / max) * 100;
          }, 0) / gradedList.length,
        )
      : 0;

  // passing = score >= 60% of max_score
  const passing = gradedList.filter((g) => {
    const max = g.exam?.max_score || 100;
    return (g.score / max) * 100 >= 60;
  }).length;

  // failing = score < 60% of max_score
  const failing = gradedList.filter((g) => {
    const max = g.exam?.max_score || 100;
    return (g.score / max) * 100 < 60;
  }).length;

  return (
    <StateCards
      cards={[
        {
          label: "Total Records",
          value: grades.length,
          bg: "bg-blue-50",
          text: "text-blue-500",
          icon: <FiFileText />,
        },
        {
          label: "Filtered Results",
          icon: <FiSearch />,
          text: "text-violet-500",
          bg: "bg-violet-50",
          value: filteredGrades.length,
        },
        {
          label: "Average Score",
          value: gradedList.length > 0 ? `${avgPct}%` : "—",
          bg: "bg-purple-50",
          text: "text-purple-500",
          icon: <FiBarChart2 />,
        },
        {
          label: "Passing",
          value: passing,
          bg: "bg-green-50",
          text: "text-green-500",
          icon: <FiTrendingUp />,
        },
        {
          label: "Failing",
          value: failing,
          bg: "bg-red-50",
          text: "text-red-400",
          icon: <FiAward />,
        },
      ]}
    />
  );
}

export default GradesStateCards;
