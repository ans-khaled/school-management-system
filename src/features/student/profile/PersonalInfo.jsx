import {
  FiCalendar,
  FiCheckCircle,
  FiHash,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";

function PersonalInfo({ profileData }) {
  const {
    user,
    student_id,
    date_of_birth,
    gender,
    phone,
    address,
    enrollment_date,
  } = profileData ?? {};

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
      <div className="flex items-center gap-2 mb-5">
        <FiUser className="text-blue-500" size={18} />
        <p className="font-semibold text-slate-800">Personal Information</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[
          {
            label: "Full Name",
            value: user?.name ?? "—",
            icon: <FiUser />,
          },
          {
            label: "Email Address",
            value: user?.email ?? "—",
            icon: <FiMail />,
          },
          {
            label: "Student ID",
            value: student_id ?? "—",
            icon: <FiHash />,
          },
          {
            label: "Date of Birth",
            value: date_of_birth
              ? new Date(date_of_birth).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—",
            icon: <FiCalendar />,
          },
          {
            label: "Gender",
            value: gender
              ? gender.charAt(0).toUpperCase() + gender.slice(1)
              : "—",
            icon: <FiUser />,
          },
          {
            label: "Phone",
            value: phone ?? "—",
            icon: <FiPhone />,
          },
          {
            label: "Address",
            value: address ?? "—",
            icon: <FiMapPin />,
          },
          {
            label: "Enrollment Date",
            value: enrollment_date
              ? new Date(enrollment_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "—",
            icon: <FiCheckCircle />,
          },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-slate-800 font-medium text-sm mt-0.5 truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonalInfo;
