import Header from "../../ui/Header";
import ParentStateCards from "../../features/admin/Parents/ParentStateCards";
import ParentsTable from "../../features/admin/Parents/ParentsTable";
import AddParent from "../../features/admin/Parents/AddParent";
import useGetItems from "../../hooks/useGetItems";
import { useState } from "react";

function Parents() {
  const [search, setSearch] = useState("");
  const { items: parents, isLoading, error } = useGetItems("parents");
  console.log(parents);

  const searchedParents = parents.filter((parent) =>
    (parent.user?.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <Header>Parents</Header>
        <AddParent />
      </div>

      <ParentStateCards parents={parents} searchedParents={searchedParents} />

      <ParentsTable
        isLoading={isLoading}
        parents={searchedParents}
        error={error}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default Parents;
