import SubjectCard from "./SubjectCard";

function SubjectList({ subjects }) {
  if (!subjects?.length) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No subjects found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}

export default SubjectList;
