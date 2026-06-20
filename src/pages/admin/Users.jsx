import { useState } from "react";

import Header from "../../ui/Header";
import useGetItems from "../../hooks/useGetItems";

import AddUser from "../../features/admin/users/AddUser";
import UserStateCards from "../../features/admin/users/UserStateCards";
import UsersTable from "../../features/admin/users/UsersTable";
import useFilteredUsers from "../../features/admin/users/useFilteredUsers";

function Users() {
  const [search, setSearch] = useState("");
  const { isLoading, items: users, error } = useGetItems("users");

  console.log(users);

  const searchedUsers = users.filter((user) =>
    (user.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const filteredUsers = useFilteredUsers(searchedUsers);

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <Header>Users</Header>
        <AddUser />
      </div>

      <UserStateCards users={users} filteredUsers={filteredUsers} />

      <UsersTable
        filteredUsers={filteredUsers}
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default Users;
