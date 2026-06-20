import StudentCharts from "./StudentCharts";
import StudentsFilters from "./StudentsFilters";

function StudentReports() {
  return (
    <div>
      {/* filters */}
      <StudentsFilters />

      <StudentCharts />
    </div>
  );
}

export default StudentReports;
