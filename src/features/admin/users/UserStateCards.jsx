import {
  FiUsers,
  FiShield,
  FiBookOpen,
  FiUserCheck,
  FiHome,
  FiSearch,
} from "react-icons/fi";
import StateCards from "../../../ui/StateCards";

function UserStateCards({ users, filteredUsers }) {
  const totalAdmins = users.filter(
    (u) => u.role === "admin" || u.role === "super_admin",
  ).length;
  const totalTeachers = users.filter((u) => u.role === "teacher").length;
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalParents = users.filter((u) => u.role === "parent").length;

  return (
    <StateCards
      cards={[
        {
          label: "Total Users",
          icon: <FiUsers />,
          text: "text-sky-500",
          bg: "bg-sky-50",
          value: users.length,
        },
        {
          label: "Filtered Results",
          icon: <FiSearch />,
          text: "text-violet-500",
          bg: "bg-violet-50",
          value: filteredUsers.length,
        },
        {
          label: "Admins",
          icon: <FiShield />,
          text: "text-violet-500",
          bg: "bg-violet-50",
          value: totalAdmins,
        },
        {
          label: "Teachers",
          icon: <FiBookOpen />,
          text: "text-emerald-500",
          bg: "bg-emerald-50",
          value: totalTeachers,
        },
        {
          label: "Students",
          icon: <FiUserCheck />,
          text: "text-amber-500",
          bg: "bg-amber-50",
          value: totalStudents,
        },
        {
          label: "Parents",
          icon: <FiHome />,
          text: "text-rose-500",
          bg: "bg-rose-50",
          value: totalParents,
        },
      ]}
    />
  );
}

export default UserStateCards;
