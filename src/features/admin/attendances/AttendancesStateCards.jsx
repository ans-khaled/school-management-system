import {
  FiFileText,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function AttendancesStateCards({ attendances, filteredAttendances }) {
  const present = filteredAttendances.filter(
    (a) => a.status === "present",
  ).length;
  const absent = filteredAttendances.filter(
    (a) => a.status === "absent",
  ).length;
  const late = filteredAttendances.filter((a) => a.status === "late").length;

  return (
    <StateCards
      cards={[
        {
          label: "Total Attendances",
          value: attendances.length,
          bg: "bg-blue-50",
          text: "text-blue-500",
          icon: <FiFileText />,
        },
        {
          label: "Filtered Results",
          value: filteredAttendances.length,
          bg: "bg-violet-50",
          text: "text-violet-500",
          icon: <FiSearch />,
        },
        {
          label: "Present",
          value: present,
          bg: "bg-green-50",
          text: "text-green-500",
          icon: <FiCheckCircle />,
        },
        {
          label: "Absent",
          value: absent,
          bg: "bg-red-50",
          text: "text-red-400",
          icon: <FiXCircle />,
        },
        {
          label: "Late",
          value: late,
          bg: "bg-yellow-50",
          text: "text-yellow-500",
          icon: <FiClock />,
        },
      ]}
    />
  );
}

export default AttendancesStateCards;
