import {
  FiFileText,
  FiSearch,
  FiCheckCircle,
  FiBook,
  FiUser,
} from "react-icons/fi";

import StateCards from "../../../ui/StateCards";

function SchedulesStateCards({ schedules, filteredSchedules = [] }) {
  const active = filteredSchedules.filter((s) => s.is_active).length;

  const uniqueSubjects = new Set(filteredSchedules.map((s) => s.subject?.id))
    .size;

  const uniqueTeachers = new Set(filteredSchedules.map((s) => s.teacher?.id))
    .size;

  return (
    <StateCards
      cards={[
        {
          label: "Total Schedules",
          value: schedules.length,
          bg: "bg-blue-50",
          text: "text-blue-500",
          icon: <FiFileText />,
        },
        {
          label: "Filtered Results",
          value: filteredSchedules.length,
          bg: "bg-violet-50",
          text: "text-violet-500",
          icon: <FiSearch />,
        },
        {
          label: "Active Schedules",
          value: active,
          bg: "bg-green-50",
          text: "text-green-500",
          icon: <FiCheckCircle />,
        },
        {
          label: "Subjects",
          value: uniqueSubjects,
          bg: "bg-indigo-50",
          text: "text-indigo-500",
          icon: <FiBook />,
        },
        {
          label: "Teachers",
          value: uniqueTeachers,
          bg: "bg-orange-50",
          text: "text-orange-500",
          icon: <FiUser />,
        },
      ]}
    />
  );
}

export default SchedulesStateCards;
