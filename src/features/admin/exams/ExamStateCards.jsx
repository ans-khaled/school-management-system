import { FiCalendar, FiFileText, FiSearch } from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function ExamStateCards({ exams, searchedExams }) {
  const examsThisMonth = searchedExams.filter(
    (exam) => new Date(exam.data).getMonth() === new Date().getMonth(),
  ).length;

  return (
    <StateCards
      cards={[
        {
          label: "Total Exams",
          text: "text-blue-500",
          icon: <FiFileText />,
          value: exams.length,
        },
        {
          label: "Search result",
          text: "text-violet-500",
          icon: <FiSearch />,
          value: searchedExams.length,
        },
        {
          label: "This Month",
          text: "text-purple-500",
          icon: <FiCalendar />,
          value: examsThisMonth,
        },
      ]}
    />
  );
}

export default ExamStateCards;
