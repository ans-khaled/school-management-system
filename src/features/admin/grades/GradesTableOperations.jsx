import SortBy from "../../../ui/SortBy";
import Filter from "../../../ui/Filter";

function GradeTableOperations() {
  return (
    <div className="flex items-center gap-[1.6rem]">
      {/* Filter by grade letter */}
      <Filter
        filterField="grade"
        options={[
          { value: "all", label: "All" },
          { value: "A", label: "A" },
          { value: "B", label: "B" },
          { value: "C", label: "C" },
          { value: "D", label: "D" },
          { value: "F", label: "F" },
        ]}
      />

      {/* Filter by exam type */}
      <Filter
        filterField="type"
        options={[
          { value: "all", label: "All" },
          { value: "midterm", label: "Midterm" },
          { value: "final", label: "Final" },
          { value: "other", label: "Other" },
        ]}
      />

      <SortBy
        options={[
          { value: "score-desc", label: "Highest score" },
          { value: "score-asc", label: "Lowest score" },
          { value: "created_at-desc", label: "Newest" },
          { value: "created_at-asc", label: "Oldest" },
        ]}
      />
    </div>
  );
}

export default GradeTableOperations;
