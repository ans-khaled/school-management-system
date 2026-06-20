import { useState } from "react";
import Header from "../../ui/Header";

import TeacherStateCards from "../../features/admin/teachers/TeacherStateCards";
import TeachersTable from "../../features/admin/teachers/TeachersTable";
import useGetItems from "../../hooks/useGetItems";
import AddTeacher from "../../features/admin/teachers/AddTeacher";
import useFilteredTeachers from "../../features/admin/teachers/useFilteredTeachers";

function Teachers() {
  const [search, setSearch] = useState("");
  const { isLoading, items: teachers, error } = useGetItems("teachers");

  console.log(teachers);

  const searchedTeachers = teachers.filter((t) =>
    (t.user?.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredTeachers = useFilteredTeachers(searchedTeachers);

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Teachers</Header>
        <AddTeacher />
      </div>

      <TeacherStateCards
        teachers={teachers}
        filteredTeachers={filteredTeachers}
      />

      <TeachersTable
        isLoading={isLoading}
        teachers={filteredTeachers}
        error={error}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default Teachers;
