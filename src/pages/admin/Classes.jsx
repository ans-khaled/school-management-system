import { useState } from "react";
import Header from "../../ui/Header";
import ClassesStateCards from "../../features/admin/classes/ClassesStateCards";
import ClassesTable from "../../features/admin/classes/ClassesTable";
import useFilteredClasses from "../../features/admin/classes/useFilteredClasses";

import useGetItems from "../../hooks/useGetItems";
import AddClass from "../../features/admin/classes/AddClass";

function Classes() {
  const [search, setSearch] = useState("");
  const { isLoading, items: classrooms, error } = useGetItems("classrooms");

  console.log(classrooms);

  const searchedClasses = classrooms.filter((cls) =>
    (cls.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredClasses = useFilteredClasses(searchedClasses);

  console.log(filteredClasses);

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <Header>Classes</Header>
        <AddClass />
      </div>

      <ClassesStateCards filteredClasses={filteredClasses} />

      <ClassesTable
        filteredClasses={filteredClasses}
        isLoading={isLoading}
        error={error}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default Classes;
