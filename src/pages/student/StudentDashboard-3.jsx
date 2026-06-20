import DashboardHeader from "../../features/student/dashboard/DashboardHeader";
import DashboardStateCards from "../../features/student/dashboard/DashboardStateCards";
import Spinner from "../../ui/Spinner";
import useDashboard from "../../features/student/dashboard/useDashboard";

function StudentDashboard() {
  const { dashboardData, isLoading } = useDashboard();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center  justify-between mb-7">
        <DashboardHeader student={dashboardData.student} />
      </div>

      <DashboardStateCards stats={dashboardData?.stats} />
    </div>
  );
}

export default StudentDashboard;
