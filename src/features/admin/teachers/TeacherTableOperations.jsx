import Filter from "../../../ui/Filter";
import SortBy from "../../../ui/SortBy";

function TeacherTableOperations() {
  return (
    <div className="flex items-center gap-[1.6rem]">
      <Filter
        filterField="gender"
        options={[
          { value: "all", label: "All" },
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Name (A-Z)" },
          { value: "name-desc", label: "Name (Z-A)" },
          { value: "hire_date-desc", label: "Newest hired" },
          { value: "hire_date-asc", label: "Oldest hired" },
        ]}
      />
    </div>
  );
}

export default TeacherTableOperations;
