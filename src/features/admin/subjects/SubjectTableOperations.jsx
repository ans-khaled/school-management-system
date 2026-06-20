import SortBy from "../../../ui/SortBy";
import Filter from "../../../ui/Filter";
import FilterSelection from "../../../ui/FilterSelection";

function SubjectTableOperations() {
  return (
    <div className="flex items-center gap-[1.6rem]">
      {/* Filter by active/inactive */}
      <Filter
        filterField="is_active"
        options={[
          { value: "all", label: "All" },
          { value: "true", label: "Active" },
          { value: "false", label: "Inactive" },
        ]}
      />

      {/* Filter by subject type */}
      <Filter
        filterField="type"
        options={[
          { value: "all", label: "All Types" },
          { value: "core", label: "Core" },
          { value: "elective", label: "Elective" },
        ]}
      />

      {/* Filter by credits */}
      <FilterSelection
        filterField="credits"
        options={[
          { value: "all", label: "All Credits" },
          { value: "1", label: "1 Credit" },
          { value: "2", label: "2 Credits" },
          { value: "3", label: "3 Credits" },
          { value: "4", label: "4 Credits" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Name (A-Z)" },
          { value: "name-desc", label: "Name (Z-A)" },
          { value: "credits-desc", label: "Most Credits" },
          { value: "credits-asc", label: "Least Credits" },
          { value: "created_at-desc", label: "Newest Added" },
          { value: "created_at-asc", label: "Oldest Added" },
        ]}
      />
    </div>
  );
}

export default SubjectTableOperations;
