import { useState } from "react";
import SubjectStateCards from "../../features/admin/subjects/SubjectStateCards";
import SubjectsTable from "../../features/admin/subjects/SubjectsTable";
import AddSubject from "../../features/admin/subjects/AddSubject";
import useFilteredSubjects from "../../features/admin/subjects/useFilterSubjects";
import useGetItems from "../../hooks/useGetItems";
import Header from "../../ui/Header";

function Subjects() {
  const [search, setSearch] = useState("");
  const { isLoading, items: subjects, error } = useGetItems("subjects");

  const searchedSubjects = subjects.filter((sub) =>
    (sub.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredSubjects = useFilteredSubjects(searchedSubjects);

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Subjects</Header>
        <AddSubject>Subject</AddSubject>
      </div>

      <SubjectStateCards
        subjects={subjects}
        filteredSubjects={filteredSubjects}
      />

      <SubjectsTable
        filteredSubjects={filteredSubjects}
        search={search}
        setSearch={setSearch}
        subjects={subjects}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default Subjects;
