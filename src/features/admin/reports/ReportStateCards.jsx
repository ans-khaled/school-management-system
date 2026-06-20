import {
  FiBook,
  FiCreditCard,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import {
  students,
  teachers,
  INITIAL_SUBJECTS,
  payments,
} from "../../../data/StaticData";
import StateCards from "../../../ui/StateCards";

const totalRevenue = payments
  .filter((p) => p.status === "Paid")
  .reduce((acc, cur) => acc + cur.amount, 0);

const cards = [
  {
    label: "Total Students",
    value: students.length ?? 0,
    bg: "bg-blue-50",
    text: "text-blue-500",
    icon: <FiUsers />,
  },
  {
    label: "Total Teachers",
    value: teachers.length ?? 0,
    bg: "bg-purple-50",
    text: "text-purple-500",
    icon: <FiUser />,
  },
  {
    label: "Total Subjects",
    value: INITIAL_SUBJECTS.length ?? 0,
    bg: "bg-green-50",
    text: "text-green-500",
    icon: <FiBook />,
  },
  {
    label: "Total Revenue",
    value: totalRevenue,
    bg: "bg-orange-50",
    text: "text-orange-500",
    icon: <FiCreditCard />,
  },
  {
    label: "Attendance Rate",
    value: "92%",
    bg: "bg-teal-50",
    text: "text-teal-500",
    icon: <FiTrendingUp />,
  },
];

function ReportStateCards() {
  return <StateCards cards={cards} />;
}

export default ReportStateCards;
