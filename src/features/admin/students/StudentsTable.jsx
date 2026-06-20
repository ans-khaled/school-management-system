import StudentRow from "./StudentRow";
import InputSearch from "../../../ui/InputSearch";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Table from "../../../ui/Table";
import StudentTableOperations from "./StudentTableOperations";

function StudentTable({
  filteredStudents,
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
          <p className="font-semibold text-slate-800">Student Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {filteredStudents.length} total students
          </p>
        </div>

        <div className="flex gap-[1.6rem]">
          <StudentTableOperations />

          <InputSearch
            placeholder="Student"
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No students found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={[
              "Student ID",
              "Full Name",
              "Gender",
              "Date of Birth",
              "Classroom",
              "Grade Level",
              "Academic Year",
              "Enrollment Date",
              "Parent",
              "Status",
              "Actions",
            ]}
            data={filteredStudents}
            renderRow={(stu) => <StudentRow student={stu} key={stu.id} />}
          />
        </div>
      )}
    </div>
  );
}

export default StudentTable;
