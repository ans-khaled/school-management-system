import { useState } from "react";

import Header from "../../ui/Header";
import useGetItems from "../../hooks/useGetItems";

import AttendancesTable from "../../features/admin/attendances/AttendancesTable";
import AddAttendance from "../../features/admin/attendances/AddAttendance";
import AttendancesStateCards from "../../features/admin/attendances/AttendancesStateCards";
import useFilterAttendances from "../../features/admin/attendances/useFilterAttendances";

function Attendances() {
  const [search, setSearch] = useState("");
  const { isLoading, items: attendances, error } = useGetItems("attendances");

  // Search by student name (nested under attendance.student.user.name)
  const searchedAttendances = attendances.filter((a) =>
    (a.student?.user?.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );
  const filteredAttendances = useFilterAttendances(searchedAttendances);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Attendances</Header>
        <AddAttendance />
      </div>

      <AttendancesStateCards
        attendances={attendances}
        filteredAttendances={filteredAttendances}
      />

      <AttendancesTable
        attendances={filteredAttendances}
        isLoading={isLoading}
        error={error}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default Attendances;
