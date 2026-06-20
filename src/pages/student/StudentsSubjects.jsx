import Spinner from "../../ui/Spinner";
import useSubjects from "../../features/student/subjects/useSubjects";
import Header from "../../ui/Header";
import SubjectStateCards from "../../features/student/subjects/SubjectStateCards";
import SubjectList from "../../features/student/subjects/SubjectList";

function StudentsSubjects() {
  const { subjectsData, isLoading } = useSubjects();

  console.log(subjectsData);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="mb-7">
        <Header>My Subjects</Header>
      </div>

      <div className="mb-6">
        <SubjectStateCards subjects={subjectsData} />
      </div>
      <SubjectList subjects={subjectsData} />
    </div>
  );
}

export default StudentsSubjects;
