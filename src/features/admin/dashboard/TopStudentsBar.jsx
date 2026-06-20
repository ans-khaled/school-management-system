import useGetItems from "../../../hooks/useGetItems";
import Spinner from "../../../ui/Spinner";

function TopStudentsBar() {
  const { isLoading, items: grades = [] } = useGetItems("grades");

  if (isLoading) return <Spinner />;

  const studentsMap = {};

  grades.forEach((grade) => {
    if (grade.score === null) return;

    const studentId = grade.student?.id;

    if (!studentsMap[studentId]) {
      studentsMap[studentId] = {
        name: grade.student?.user?.name || "Unknown",
        scores: [],
      };
    }

    studentsMap[studentId].scores.push(Number(grade.score));
  });

  const topStudents = Object.values(studentsMap)
    .map((student) => ({
      ...student,
      average: Math.round(
        student.scores.reduce((sum, score) => sum + score, 0) /
          student.scores.length,
      ),
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex-1">
      <h3 className="text-lg font-semibold mb-5">Top Students</h3>

      <div className="space-y-4">
        {topStudents.map((student, index) => (
          <div key={student.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>

              <span className="font-medium">{student.name}</span>
            </div>

            <span className="font-semibold text-blue-600">
              {student.average}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopStudentsBar;
