import useGetItems from "../../../hooks/useGetItems";
import Spinner from "../../../ui/Spinner";

function GradesBar() {
  const { isLoading, items: grades = [] } = useGetItems("grades");

  if (isLoading) return <Spinner />;

  const scores = grades
    .filter((g) => g.score !== null)
    .map((g) => Number(g.score));

  const total = scores.length;

  const excellent = scores.filter((s) => s >= 90).length;
  const good = scores.filter((s) => s >= 75 && s < 90).length;
  const average = scores.filter((s) => s >= 60 && s < 75).length;
  const poor = scores.filter((s) => s < 60).length;

  const averageScore = total
    ? Math.round(scores.reduce((a, b) => a + b, 0) / total)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex-1">
      <h3 className="text-lg font-semibold mb-5">Students Performance</h3>

      <div className="space-y-4">
        <Stat
          label="Excellent"
          value={excellent}
          total={total}
          color="bg-green-500"
        />

        <Stat label="Good" value={good} total={total} color="bg-blue-500" />

        <Stat
          label="Average"
          value={average}
          total={total}
          color="bg-yellow-500"
        />

        <Stat label="Poor" value={poor} total={total} color="bg-red-500" />

        <div className="pt-4">
          <p className="text-sm text-slate-500">Average Score</p>

          <p className="text-3xl font-bold">{averageScore}%</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, total, color }) {
  const width = total ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default GradesBar;
