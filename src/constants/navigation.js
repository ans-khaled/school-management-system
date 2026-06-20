import {
  MdOutlineDashboard,
  MdOutlineAssignmentTurnedIn,
  MdOutlineDateRange,
  MdOutlineAssignment,
  MdPayment,
  MdOutlineEmojiEvents,
  MdOutlineFactCheck,
  MdOutlineSchedule,
} from "react-icons/md";
import { TbUsers } from "react-icons/tb";
import { IoBookOutline } from "react-icons/io5";
import { RiGraduationCapLine } from "react-icons/ri";
import { FiMessageSquare, FiBell } from "react-icons/fi";
import { FaBookOpen, FaPen } from "react-icons/fa";
import { User, Users } from "lucide-react";

// Each role maps to a portal label + a list of sections. Each section
// has a title (shown as the small uppercase label) and a list of items.
// To add/remove a page for a role, edit this file only —
// SideBar.jsx renders whatever it finds here.

export const NAV_BY_ROLE = {
  admin: {
    portalLabel: "Admin Portal",
    sections: [
      {
        title: "Overview",
        items: [
          {
            label: "Dashboard",
            icon: MdOutlineDashboard,
            to: "/admin/dashboard",
          },
        ],
      },
      {
        title: "Academic Management",
        items: [
          { label: "Students", icon: TbUsers, to: "/admin/students" },
          { label: "Classes", icon: IoBookOutline, to: "/admin/classes" },
          { label: "Subjects", icon: FaBookOpen, to: "/admin/subjects" },
          { label: "Grades", icon: RiGraduationCapLine, to: "/admin/grades" },
          { label: "Exams", icon: FaPen, to: "/admin/exams" },
          {
            label: "Attendances",
            icon: MdOutlineFactCheck,
            to: "/admin/attendances",
          },
          {
            label: "Schedules",
            icon: MdOutlineSchedule,
            to: "/admin/schedules",
          },
        ],
      },
      {
        title: "Operations",
        items: [
          { label: "Users", icon: TbUsers, to: "/admin/users" },
          { label: "Teachers", icon: TbUsers, to: "/admin/teachers" },
          { label: "Parents", icon: TbUsers, to: "/admin/parents" },
          { label: "Reports", icon: FiMessageSquare, to: "/admin/reports" },
          { label: "Payments", icon: MdPayment, to: "/admin/payments" },
        ],
      },
    ],
  },

  teacher: {
    portalLabel: "Teacher Portal",
    sections: [
      {
        title: "Overview",
        items: [
          {
            label: "Dashboard",
            icon: MdOutlineDashboard,
            to: "/teacher/dashboard",
          },
          {
            label: "Profile",
            icon: User,
            to: "/teacher/profile",
          },
        ],
      },

      {
        title: "Teaching",
        items: [
          {
            label: "Assignments",
            icon: MdOutlineAssignment,
            to: "/teacher/assignments",
          },
          {
            label: "Classrooms",
            icon: Users,
            to: "/teacher/classrooms",
          },
          {
            label: "Exams",
            icon: FaPen,
            to: "/teacher/exams",
          },
          {
            label: "Grades",
            icon: RiGraduationCapLine,
            to: "/teacher/grades",
          },
          {
            label: "Attendance",
            icon: MdOutlineDateRange,
            to: "/teacher/attendance",
          },
        ],
      },

      {
        title: "Communication",
        items: [
          {
            label: "Messages",
            icon: FiMessageSquare,
            to: "/teacher/messages",
          },
        ],
      },

      {
        title: "Resources",
        items: [
          {
            label: "Teaching Resources",
            icon: IoBookOutline,
            to: "/teacher/resources",
          },
        ],
      },
    ],
  },

  student: {
    portalLabel: "Student Portal",
    sections: [
      {
        title: "Overview",
        items: [
          {
            label: "Dashboard",
            icon: MdOutlineDashboard,
            to: "/student/dashboard",
          },
          {
            label: "Profile",
            icon: User,
            to: "/student/profile",
          },
        ],
      },
      {
        title: "Academics",
        items: [
          { label: "Subjects", icon: FaBookOpen, to: "/student/subjects" },
          { label: "Grades", icon: RiGraduationCapLine, to: "/student/grades" },
          {
            label: "Timetable",
            icon: MdOutlineDateRange,
            to: "/student/timetable",
          },
          { label: "Exams", icon: FaPen, to: "/student/exams" },
          {
            label: "Assignments",
            icon: MdOutlineAssignmentTurnedIn,
            to: "/student/assignments",
          },
        ],
      },
      // {
      //   title: "Others",
      //   items: [
      //     {
      //       label: "Achievements",
      //       icon: MdOutlineEmojiEvents,
      //       to: "/student/achievements",
      //     },
      //     {
      //       label: "Notifications",
      //       icon: FiBell,
      //       to: "/student/notifications",
      //     },
      //   ],
      // },
    ],
  },

  parent: {
    portalLabel: "Parent Portal",
    sections: [
      {
        title: "Overview",
        items: [
          {
            label: "Dashboard",
            icon: MdOutlineDashboard,
            to: "/parent/dashboard",
          },
        ],
      },
      {
        title: "Family",
        items: [
          { label: "My children", icon: TbUsers, to: "/parent/children" },
          { label: "Grades", icon: RiGraduationCapLine, to: "/parent/grades" },
          {
            label: "Attendance",
            icon: MdOutlineDateRange,
            to: "/parent/attendance",
          },
        ],
      },
      {
        title: "Others",
        items: [
          { label: "Fees", icon: MdPayment, to: "/parent/fees" },
          { label: "Notifications", icon: FiBell, to: "/parent/notifications" },
        ],
      },
    ],
  },
};

// Fallback if a role has no config yet, so the sidebar never renders empty.
export const DEFAULT_NAV = {
  portalLabel: "Portal",
  sections: [
    {
      title: "Overview",
      items: [{ label: "Dashboard", icon: MdOutlineDashboard, to: "/" }],
    },
  ],
};
