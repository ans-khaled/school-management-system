// import SortBy from "../../../ui/SortBy";
import Filter from "../../../ui/Filter";

function AttendancesTableOperations() {
  return (
    <div className="flex items-center gap-[1.6rem]">
      {/* Filter by grade letter */}
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "present", label: "Present" },
          { value: "absent", label: "Absent" },
          { value: "late", label: "Late" },
          { value: "excused", label: "Excused" },
        ]}
      />
    </div>
  );
}

export default AttendancesTableOperations;
