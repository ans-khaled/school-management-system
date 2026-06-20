import { useState } from "react";
import StudentsTable from "../../features/admin/students/StudentsTable";
import StudentStateCards from "../../features/admin/students/StudentStateCards";
import useGetItems from "../../hooks/useGetItems";
import AddStudent from "../../features/admin/students/AddStudent";
import Header from "../../ui/Header";
import useFilteredStudents from "../../features/admin/students/useFilteredStudents";

function Students() {
  const [search, setSearch] = useState("");
  const { isLoading, items: students, error } = useGetItems("students");

  console.log(students);

  const searchedStudents = students.filter((stu) =>
    (stu.user?.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredStudents = useFilteredStudents(searchedStudents);

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Students</Header>
        <AddStudent />
      </div>

      <StudentStateCards
        students={students}
        filteredStudents={filteredStudents}
      />

      <StudentsTable
        filteredStudents={filteredStudents}
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default Students;
