import InputSearch from "../../../ui/InputSearch";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Table from "../../../ui/Table";

import AttendanceRow from "./AttendanceRow";
import AttendancesTableOperations from "./AttendancesTableOperations";

function AttendancesTable({
  attendances,
  isLoading,
  error,
  search,
  setSearch,
}) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">Attendance Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {attendances.length} total records
          </p>
        </div>

        <div className="flex gap-[1.6rem]">
          <AttendancesTableOperations />

          <InputSearch
            placeholder="Student attendance"
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {attendances.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No attendance records found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Student ID",
              "Student Name",
              "Classroom",
              "Date",
              "Status",
              "Notes",
              "Actions",
            ]}
            data={attendances}
            renderRow={(a) => <AttendanceRow attendance={a} key={a.id} />}
          />
        </div>
      )}
    </div>
  );
}

export default AttendancesTable;
