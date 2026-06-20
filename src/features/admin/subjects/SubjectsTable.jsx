import SubjectRow from "./SubjectRow";
import InputSearch from "../../../ui/InputSearch";
import Table from "../../../ui/Table";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import SubjectTableOperations from "./SubjectTableOperations";

function SubjectsTable({
  filteredSubjects,
  isLoading,
  error,
  search,
  setSearch,
}) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Table Card */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">Subject Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {filteredSubjects.length} total subjects
          </p>
        </div>

        <div className="flex items-center gap-[1.6rem]">
          <SubjectTableOperations />
          <InputSearch
            placeholder="Subject"
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {/* TABLE */}
      {filteredSubjects.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No subjects found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Subject",
              "Type",
              "Credits",
              "Teachers",
              "Classrooms",
              "Grades",
              "Weekly Hours",
              "Status",
              "Actions",
            ]}
            data={filteredSubjects}
            renderRow={(s, i) => (
              <SubjectRow key={s.id} subject={s} index={i} />
            )}
          />
        </div>
      )}
    </div>
  );
}

export default SubjectsTable;
