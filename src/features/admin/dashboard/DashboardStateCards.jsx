import StateCards from "../../../ui/StateCards";

import {
  FiUsers,
  FiUserCheck,
  FiHome,
  FiBookOpen,
  FiUserPlus,
} from "react-icons/fi";

function DashboardStateCards({
  users = 20,
  students = 10,
  teachers = 5,
  classes = [15],
  subjects = [5],
  parents = [5],
}) {
  return (
    <StateCards
      cards={[
        {
          label: "Total Users",
          value: users,
          bg: "bg-blue-50",
          text: "text-blue-600",
          icon: <FiUsers />,
        },
        {
          label: "Total Students",
          value: students,
          bg: "bg-green-50",
          text: "text-green-600",
          icon: <FiUserCheck />,
        },
        {
          label: "Total Teachers",
          value: teachers,
          bg: "bg-violet-50",
          text: "text-violet-600",
          icon: <FiUserPlus />,
        },
        {
          label: "Total Classes",
          value: classes,
          bg: "bg-orange-50",
          text: "text-orange-600",
          icon: <FiHome />,
        },
        {
          label: "Total Subjects",
          value: subjects,
          bg: "bg-purple-50",
          text: "text-purple-600",
          icon: <FiBookOpen />,
        },
        {
          label: "Total Parents",
          value: parents.length,
          bg: "bg-sky-50",
          text: "text-sky-600",
          icon: <FiUserPlus />,
        },
      ]}
    />
  );
}

export default DashboardStateCards;
