import { useState } from "react";

import Header from "../../ui/Header";
import useGetItems from "../../hooks/useGetItems";

import SchedulesTable from "../../features/admin/schedules/SchedulesTable";
import AddSchedule from "../../features/admin/schedules/AddSchedule";
import SchedulesStateCards from "../../features/admin/schedules/SchedulesStateCards";
import useFilterSchedules from "../../features/admin/schedules/useFilterSchedules";

function Schedules() {
  const [search, setSearch] = useState("");
  const { isLoading, items: schedules, error } = useGetItems("schedules");

  // Search by student name (nested under attendance.student.user.name)
  // const searchedSchedules = schedules.filter((a) =>
  //   (a.student?.user?.name ?? "").toLowerCase().includes(search.toLowerCase()),
  // );

  const searchedSchedules = schedules.filter((schedule) => {
    return (
      schedule.subject?.name?.toLowerCase().includes(search.toLowerCase()) ||
      schedule.classroom?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredSchedules = useFilterSchedules(searchedSchedules);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Schedules</Header>
        <AddSchedule />
      </div>

      <SchedulesStateCards
        schedules={schedules}
        filteredSchedules={filteredSchedules}
      />

      <SchedulesTable
        schedules={filteredSchedules}
        isLoading={isLoading}
        error={error}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default Schedules;
