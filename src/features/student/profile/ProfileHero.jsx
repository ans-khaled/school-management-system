import { FiBook, FiHash, FiMail } from "react-icons/fi";

function ProfileHero({ profileData }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 mb-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl font-bold shrink-0">
            {profileData.user?.name?.[0]?.toUpperCase() ?? "S"}
          </div>
          <div>
            <p className="text-white/70 text-sm mb-1">Student</p>
            <h2 className="text-3xl font-bold mb-3">
              {profileData.user?.name ?? "—"}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                <FiHash size={11} /> {profileData?.student_id ?? "—"}
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                <FiMail size={11} /> {profileData.user?.email ?? "—"}
              </span>
              {profileData.classrooms[0] && (
                <span className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5">
                  <FiBook size={11} /> {profileData.classrooms[0].name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHero;
