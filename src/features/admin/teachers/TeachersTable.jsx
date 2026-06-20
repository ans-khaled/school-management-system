import Table from "../../../ui/Table";
import InputSearch from "../../../ui/InputSearch";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import TeacherRow from "./TeacherRow";
import TeacherTableOperations from "./TeacherTableOperations";

function TeachersTable({ isLoading, teachers = [], error, search, setSearch }) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">Teacher Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {teachers.length} total teachers
          </p>
        </div>

        <div className="flex gap-[1.6rem]">
          <TeacherTableOperations />
          <InputSearch
            placeholder="Teacher"
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {teachers.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No teachers found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Teacher ID",
              "Full Name",
              "Gender",
              "Contact",
              "Specialization",
              "Subjects",
              "Classes",
              "Hire Date",
              "Actions",
            ]}
            data={teachers}
            renderRow={(teacher) => (
              <TeacherRow teacher={teacher} key={teacher.id} />
            )}
          />
        </div>
      )}
    </div>
  );
}

export default TeachersTable;
