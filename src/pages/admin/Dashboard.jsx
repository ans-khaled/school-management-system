import AttendanceOverview from "../../features/admin/dashboard/AttendanceOverview";
import DashboardStateCards from "../../features/admin/dashboard/DashboardStateCards";
import GradesBar from "../../features/admin/dashboard/GradesBar";
import ScheduleChart from "../../features/admin/dashboard/ScheduleChart";
import TopStudentsBar from "../../features/admin/dashboard/TopStudentsBar";
import Header from "../../ui/Header";

function Dashboard() {
  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Overview</Header>
      </div>

      <DashboardStateCards />

      <div className="grid grid-cols-2 gap-6">
        <AttendanceOverview />
        <GradesBar />

        <TopStudentsBar />

        <ScheduleChart />
      </div>
    </div>
  );
}

export default Dashboard;
