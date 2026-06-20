import useGetItems from "../../../hooks/useGetItems";
import Spinner from "../../../ui/Spinner";

function AttendanceOverview() {
  const { isLoading, items: attendances = [] } = useGetItems("attendances");

  if (isLoading) return <Spinner />;

  const present = attendances.filter((a) => a.status === "present").length;

  const absent = attendances.filter((a) => a.status === "absent").length;

  const late = attendances.filter((a) => a.status === "late").length;

  const excused = attendances.filter((a) => a.status === "excused").length;

  const total = attendances.length;

  const stats = [
    {
      label: "Present",
      value: present,
      percent: total ? Math.round((present / total) * 100) : 0,
      color: "bg-green-500",
    },
    {
      label: "Absent",
      value: absent,
      percent: total ? Math.round((absent / total) * 100) : 0,
      color: "bg-red-500",
    },
    {
      label: "Late",
      value: late,
      percent: total ? Math.round((late / total) * 100) : 0,
      color: "bg-yellow-500",
    },
    {
      label: "Excused",
      value: excused,
      percent: total ? Math.round((excused / total) * 100) : 0,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex-1">
      <h3 className="text-lg font-semibold mb-6">Attendance Overview</h3>

      <div className="space-y-4">
        {stats.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1 text-sm">
              <span>{item.label}</span>
              <span>
                {item.value} ({item.percent}%)
              </span>
            </div>

            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`${item.color} h-full rounded-full`}
                style={{
                  width: `${item.percent}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendanceOverview;
