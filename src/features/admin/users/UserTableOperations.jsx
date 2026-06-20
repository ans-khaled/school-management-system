import SortBy from "../../../ui/SortBy";
import Filter from "../../../ui/Filter";

function UserTableOperations() {
  return (
    <div className="flex items-center gap-[1.6rem]">
      {/* Filter by role */}
      <Filter
        filterField="role"
        options={[
          { value: "all", label: "All" },
          { value: "super_admin", label: "Super Admin" },
          { value: "admin", label: "Admin" },
          { value: "teacher", label: "Teacher" },
          { value: "student", label: "Student" },
          { value: "parent", label: "Parent" },
        ]}
      />

      {/* Filter by email verified */}
      <Filter
        filterField="email_verified"
        options={[
          { value: "all", label: "All" },
          { value: "verified", label: "Verified" },
          { value: "unverified", label: "Unverified" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Name (A-Z)" },
          { value: "name-desc", label: "Name (Z-A)" },
          { value: "created_at-desc", label: "Newest" },
          { value: "created_at-asc", label: "Oldest" },
        ]}
      />
    </div>
  );
}

export default UserTableOperations;
