import Modal from "../../../ui/Modal";
import {
  FiBook,
  FiHash,
  FiAward,
  FiClock,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

function SubjectDetails({ subject }) {
  if (!subject) return null;

  const {
    name,
    code,
    credits,
    type,
    description,
    pivot,
    teachers = [],
  } = subject;

  return (
    <div className="w-2xls max-w-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Subject Details
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <InfoItem icon={<FiBook />} label="Subject Name" value={name} />

        <InfoItem icon={<FiHash />} label="Subject Code" value={code} />

        <InfoItem icon={<FiAward />} label="Credits" value={credits} />

        <InfoItem icon={<FiBook />} label="Type" value={type} />

        <InfoItem
          icon={<FiClock />}
          label="Weekly Hours"
          value={pivot?.weekly_hours ?? "—"}
        />
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FiFileText className="text-blue-500" />
          <span className="font-medium">Description</span>
        </div>

        <p className="text-sm text-slate-600">
          {description || "No description available"}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <FiUsers className="text-blue-500" />
          <span className="font-medium">
            Assigned Teachers ({teachers.length})
          </span>
        </div>

        <div className="space-y-3">
          {teachers.map((teacher) => (
            <div
              key={`${teacher.id}-${teacher.pivot?.classroom_id}`}
              className="bg-slate-50 rounded-xl p-3"
            >
              <p className="font-medium text-slate-800">{teacher.user?.name}</p>

              <p className="text-sm text-slate-500">
                {teacher.subject_specialization}
              </p>

              <p className="text-sm text-slate-500">{teacher.user?.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-400 uppercase">{label}</p>
        <p className="font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default SubjectDetails;
