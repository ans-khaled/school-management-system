import useGetItems from "../../../hooks/useGetItems";

function ScheduleChart() {
  const { items: schedules = [], isLoading } = useGetItems("schedules");

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const data = days.map((day) => ({
    day,
    count: schedules.filter((s) => s.day_of_week === day).length,
  }));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-5">Schedules</h3>

      <div className="bg-white p-6 rounded-xl shadow-sm flex gap-4">
        {data.map((item) => (
          <ScheduleBar
            key={item.day}
            day={item.day.slice(0, 3).toUpperCase()}
            count={item.count}
            max={Math.max(...data.map((d) => d.count))}
          />
        ))}
      </div>
    </div>
  );
}

function ScheduleBar({ day, count, max }) {
  const pct = max ? (count / max) * 100 : 0;

  return (
    <div className="flex-1 flex flex-col items-center gap-2">
      <span className="text-xs text-gray-500">{count}</span>

      <div className="w-full h-32 bg-gray-100 rounded-md flex items-end overflow-hidden">
        <div
          className="w-full bg-blue-500 transition-all"
          style={{ height: `${pct}%` }}
        />
      </div>

      <span className="text-xs font-medium text-gray-600">{day}</span>
    </div>
  );
}

export default ScheduleChart;
