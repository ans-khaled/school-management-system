import UserRow from "./UserRow";
import InputSearch from "../../../ui/InputSearch";
import Spinner from "../../../ui/Spinner";
import Error from "../../../ui/Error";
import Table from "../../../ui/Table";
import UserTableOperations from "./UserTableOperations";

function UsersTable({ filteredUsers, isLoading, error, search, setSearch }) {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">User Management</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {filteredUsers.length} total users
          </p>
        </div>

        <div className="flex gap-[1.6rem]">
          <UserTableOperations />

          <InputSearch placeholder="User" value={search} onChange={setSearch} />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-24 text-slate-400 text-md">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={["User", "Role", "Email verified", "Joined", "Actions"]}
            data={filteredUsers}
            renderRow={(u) => <UserRow user={u} key={u.id} />}
          />
        </div>
      )}
    </div>
  );
}

export default UsersTable;
