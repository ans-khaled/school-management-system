import InputSearch from "../../../ui/InputSearch";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import ParentRow from "./ParentRow";
import Table from "../../../ui/Table";

function ParentsTable({ isLoading, parents, error, search, setSearch }) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">Parent Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {parents.length} total parents
          </p>
        </div>
        <InputSearch placeholder="Parent" value={search} onChange={setSearch} />
      </div>

      {parents.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No parents found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Parent ID",
              "Name",
              "Address",
              "Phone",
              "Occupation",
              "Actions",
            ]}
            data={parents}
            renderRow={(parent) => (
              <ParentRow key={parent.id} parent={parent} />
            )}
          />
        </div>
      )}
    </div>
  );
}

export default ParentsTable;
