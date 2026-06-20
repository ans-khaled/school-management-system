import SortBy from "../../../ui/SortBy";
import Filter from "../../../ui/Filter";

function StudentTableOperations() {
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

      <Filter
        filterField="gender"
        options={[
          { value: "all", label: "All" },
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Name (A-Z)" },
          { value: "name-desc", label: "Name (Z-A)" },
          { value: "enrollment_date-desc", label: "Newest enrolled" },
          { value: "enrollment_date-asc", label: "Oldest enrolled" },
          { value: "date_of_birth-asc", label: "Youngest first" },
          { value: "date_of_birth-desc", label: "Oldest first" },
        ]}
      />
    </div>
  );
}

export default StudentTableOperations;
