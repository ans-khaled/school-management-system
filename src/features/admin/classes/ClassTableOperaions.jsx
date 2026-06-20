import Filter from "../../../ui/Filter";
import FilterSelection from "../../../ui/FilterSelection";
import SortBy from "../../../ui/SortBy";

function ClassTableOperations() {
  return (
    <div className="flex items-center gap-[1.6rem]">
      {/* Active / Inactive */}
      <Filter
        filterField="is_active"
        options={[
          { value: "all", label: "All" },
          { value: "true", label: "Active" },
          { value: "false", label: "Inactive" },
        ]}
      />

      {/* Grade Level */}
      <FilterSelection
        filterField="grade_level"
        options={[
          { value: "all", label: "All Grades" },
          { value: "Grade 1", label: "Grade 1" },
          { value: "Grade 2", label: "Grade 2" },
          { value: "Grade 3", label: "Grade 3" },
          { value: "Grade 4", label: "Grade 4" },
          { value: "Grade 5", label: "Grade 5" },
          { value: "Grade 6", label: "Grade 6" },
        ]}
      />

      {/* Academic Year */}
      <FilterSelection
        filterField="academic_year"
        options={[
          { value: "all", label: "All Years" },
          { value: "2023-2024", label: "2023 - 2024" },
          { value: "2024-2025", label: "2024 - 2025" },
          { value: "2025-2026", label: "2025 - 2026" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Name (A-Z)" },
          { value: "name-desc", label: "Name (Z-A)" },
          { value: "capacity-desc", label: "Most Capacity" },
          { value: "capacity-asc", label: "Least Capacity" },
          { value: "created_at-desc", label: "Newest Added" },
          { value: "created_at-asc", label: "Oldest Added" },
        ]}
      />
    </div>
  );
}

export default ClassTableOperations;
