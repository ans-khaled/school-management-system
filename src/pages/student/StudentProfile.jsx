import ClassroomInfo from "../../features/student/profile/ClassroomInfo";
import ParentsInfo from "../../features/student/profile/ParentsInfo";
import PersonalInfo from "../../features/student/profile/PersonalInfo";
import ProfileHero from "../../features/student/profile/ProfileHero";
import useProfile from "../../features/student/profile/useProfile";
import Spinner from "../../ui/Spinner";
import { today } from "../../utils/helpers";

function StudentProfile() {
  const { profileData, isLoading } = useProfile();

  console.log(profileData);

  if (isLoading) return <Spinner />;

  return (
    <div className="flex min-h-screen bg-white">
      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* top bar */}
        <div className="border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
            <p className="text-slate-400 text-xs mt-0.5">{today}</p>
          </div>
          <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {profileData.user?.name?.[0]?.toUpperCase() ?? "S"}
          </div>
        </div>

        <div className="py-8 ">
          {/* HERO */}
          <ProfileHero profileData={profileData} />

          <PersonalInfo profileData={profileData} />

          <div className="grid grid-cols-2 gap-5">
            <ClassroomInfo classrooms={profileData.classrooms} />
            <ParentsInfo parents={profileData.parents} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentProfile;
