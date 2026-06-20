import useGetItems from "../../../hooks/useGetItems";
import Filter from "../../../ui/Filter";
import FilterSelection from "../../../ui/FilterSelection";

function SchedulesTableOperations() {
  const { isLoading: isLoadingClasses, items: classrooms } =
    useGetItems("classrooms");
  const { isLoading: isLoadingSubjects, items: subjects } =
    useGetItems("subjects");

  return (
    <div className="flex items-center gap-[1.6rem]">
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />

      <FilterSelection
        filterField="day"
        options={[
          { value: "all", label: "All Days" },
          { value: "monday", label: "Monday" },
          { value: "tuesday", label: "Tuesday" },
          { value: "wednesday", label: "Wednesday" },
          { value: "thursday", label: "Thursday" },
          { value: "friday", label: "Friday" },
          { value: "saturday", label: "Saturday" },
          { value: "sunday", label: "Sunday" },
        ]}
      />

      <FilterSelection
        filterField="classroom"
        isLoading={isLoadingClasses}
        options={[
          { value: "all", label: "All Classrooms" },
          ...classrooms.map((c) => ({
            value: c.name,
            label: c.name,
          })),
        ]}
      />

      <FilterSelection
        filterField="subject"
        isLoading={isLoadingSubjects}
        options={[
          { value: "all", label: "All Subjects" },
          ...subjects.map((s) => ({
            value: s.name,
            label: s.name,
          })),
        ]}
      />
    </div>
  );
}

export default SchedulesTableOperations;
