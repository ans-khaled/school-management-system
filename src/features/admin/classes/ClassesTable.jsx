import ClassRow from "./ClassRow";
import InputSearch from "../../../ui/InputSearch";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Table from "../../../ui/Table";
import ClassTableOperations from "./ClassTableOperaions";

function ClassesTable({
  filteredClasses,
  isLoading,
  error,
  search,
  setSearch,
}) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Table header card */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">Classes Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {filteredClasses.length} total classes
          </p>
        </div>

        <div className="flex gap-[1.6rem]">
          <ClassTableOperations />
          <InputSearch
            placeholder="class"
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {/* TABLE */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-sm">
          No classes found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Class",
              "Academic Year",
              "Capacity",
              "Status",
              "Actions",
            ]}
            data={filteredClasses}
            renderRow={(cls, i) => (
              <ClassRow key={cls.id} cls={cls} index={i} />
            )}
          />
        </div>
      )}
    </div>
  );
}

export default ClassesTable;
