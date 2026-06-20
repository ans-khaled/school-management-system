import { FiAward, FiClock } from "react-icons/fi";
import Modal from "../../../ui/Modal";
import SubjectDetails from "./SubjectDetails";

const iconMap = {
  MATH: "➕",
  ENG: "📖",
  SCI: "🔬",
  PE: "🏃",
};

const colorMap = {
  MATH: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: "bg-purple-100 text-purple-600",
  },
  ENG: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    icon: "bg-teal-100 text-teal-600",
  },
  SCI: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "bg-blue-100 text-blue-600",
  },
  PE: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: "bg-green-100 text-green-600",
  },
};

function SubjectCard({ subject }) {
  const colors = colorMap[subject.code] ?? {
    bg: "bg-gray-50",
    text: "text-gray-700",
    icon: "bg-gray-100 text-gray-600",
  };

  const uniqueTeachers = [
    ...new Map((subject.teachers ?? []).map((t) => [t.id, t])).values(),
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors.icon}`}
        >
          {iconMap[subject.code] ?? "📚"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900 text-[15px]">
              {subject.name}
            </h3>
            <span className="text-[11px] font-mono text-gray-400">
              {subject.code}
            </span>
          </div>
          <div className="flex gap-1.5 mt-1 flex-wrap">
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
            >
              {subject.type}
            </span>
            {subject.is_active && (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">
                active
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed">
        {subject.description}
      </p>

      <div className="border-t border-gray-100 pt-3 flex gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FiAward size={13} />
          <span className="font-medium text-gray-700">
            {subject.credits}
          </span>{" "}
          credits
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FiClock size={13} />
          <span className="font-medium text-gray-700">
            {subject.pivot?.weekly_hours}
          </span>{" "}
          hrs/week
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        {uniqueTeachers.map((teacher) => (
          <div key={teacher.id} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 text-[11px] font-medium flex items-center justify-center flex-shrink-0">
              {teacher.user?.name
                ?.split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-800">
                {teacher.user?.name}
              </p>
              <p className="text-[11px] text-gray-400">
                {teacher.qualification}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100">
        <Modal>
          <Modal.Open opens="subject-details">
            <button className="mt-2 px-4 py-2 flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100  rounded-lg transition-colors">
              View details
            </button>
          </Modal.Open>

          <Modal.Window name="subject-details">
            <SubjectDetails subject={subject} />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

export default SubjectCard;
