import { useState } from "react";

import Header from "../../ui/Header";
import useGetItems from "../../hooks/useGetItems";

import GradeTable from "../../features/admin/grades/GradesTable";
import AddGrade from "../../features/admin/grades/AddGrade";
import GradesStateCards from "../../features/admin/grades/GradesStateCards";
import useFilterGrades from "../../features/admin/grades/useFilterGrades";

function Grades() {
  const [search, setSearch] = useState("");
  const { isLoading, items: grades, error } = useGetItems("grades");

  const searchedGrades = grades.filter((g) =>
    (g.exam?.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredGrades = useFilterGrades(searchedGrades);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Grades</Header>
        <AddGrade />
      </div>

      <GradesStateCards grades={grades} filteredGrades={filteredGrades} />

      <GradeTable
        grades={filteredGrades}
        isLoading={isLoading}
        error={error}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default Grades;
