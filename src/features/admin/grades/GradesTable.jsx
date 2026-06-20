import InputSearch from "../../../ui/InputSearch";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Table from "../../../ui/Table";

import GradeRow from "./GradeRow";
import GradesTableOperations from "./GradesTableOperations";

function GradesTable({ grades, isLoading, error, search, setSearch }) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">Grades Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {grades.length} total students
          </p>
        </div>

        <div className="flex gap-[1.6rem]">
          <GradesTableOperations />

          <InputSearch
            placeholder="exam grade"
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No grades found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Student ID",
              "Student Name",
              "Exam",
              "Score",
              "Grade",
              "Remarks",
              "Actions",
            ]}
            data={grades}
            renderRow={(g) => <GradeRow grade={g} key={g.id} />}
          />
        </div>
      )}
    </div>
  );
}

export default GradesTable;
