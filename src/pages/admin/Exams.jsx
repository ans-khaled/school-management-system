import ExamStateCards from "../../features/admin/exams/ExamStateCards";
import ExamsCards from "../../features/admin/exams/ExamsCards";
import AddExam from "../../features/admin/exams/AddExam";
import Header from "../../ui/Header";
import useGetItems from "../../hooks/useGetItems";
import { useState } from "react";

function Exams() {
  const [search, setSearch] = useState("");
  const { isLoading, items: exams, error } = useGetItems("exams");
  console.log(exams);

  const searchedExams = exams.filter((exam) =>
    (exam.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-7">
        <Header>Exams</Header>
        <AddExam />
      </div>

      <ExamStateCards exams={exams} searchedExams={searchedExams} />

      <ExamsCards
        exams={searchedExams}
        isLoading={isLoading}
        error={error}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default Exams;
