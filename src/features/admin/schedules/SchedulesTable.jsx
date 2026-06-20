import InputSearch from "../../../ui/InputSearch";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Table from "../../../ui/Table";

import SchedulesRow from "./SchedulesRow";
import SchedulesTableOperations from "./SchedulesTableOperations";

function SchedulesTable({ schedules, isLoading, error, search, setSearch }) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">Schedules Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {schedules.length ?? 0} total records
          </p>
        </div>

        <div className="flex gap-[1.6rem]">
          <SchedulesTableOperations />

          <InputSearch
            placeholder="schedule"
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No schedules found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Subject",
              "Teacher",
              "Classroom",
              "Day",
              "Time",
              "Room",
              "Status",
              "Actions",
            ]}
            data={schedules}
            renderRow={(s) => <SchedulesRow schedule={s} key={s.id} />}
          />
        </div>
      )}
    </div>
  );
}

export default SchedulesTable;
