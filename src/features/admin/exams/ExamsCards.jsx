import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import ExamCard from "./ExamCard";
import InputSearch from "../../../ui/InputSearch";

function ExamsCards({ isLoading, exams, error, search, setSearch }) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">Exams Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {exams.length} Total Exams
          </p>
        </div>

        <InputSearch placeholder="Exam" value={search} onChange={setSearch} />
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No exams found.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 my-4 p-4">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ExamsCards;
