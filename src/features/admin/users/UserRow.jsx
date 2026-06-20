import { formatDate } from "../../../utils/helpers";
import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import CreateUpdateUserForm from "./CreateUpdateUserForm";
import useUserMutations from "./useUserMutations";
import { useAuth } from "../../../contexts/AuthContext";

const roleStyles = {
  super_admin: {
    label: "Super Admin",
    text: "text-violet-700",
    bg: "bg-violet-50",
  },
  admin: {
    label: "Admin",
    text: "text-sky-700",
    bg: "bg-sky-50",
  },
  teacher: {
    label: "Teacher",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  student: {
    label: "Student",
    text: "text-amber-700",
    bg: "bg-amber-50",
  },
  parent: {
    label: "Parent",
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
};

const tdStyle = "px-6 py-4 text-slate-600 whitespace-nowrap";

function UserRow({ user }) {
  const { isDeleting, deleteUser } = useUserMutations();
  const { id, name, email, role, email_verified_at, created_at } = user;

  const userRole = roleStyles[role] ?? {
    label: role,
    text: "text-gray-700",
    bg: "bg-gray-100",
  };

  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "super_admin";

  // admin can't update or delete super_admin or admin users
  const canUpdateDelete =
    isSuperAdmin || (user.role !== "super_admin" && user.role !== "admin");

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* Full Name + Email */}
      <td className={tdStyle}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs shrink-0">
            {(name?.[0] ?? "?").toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">{name}</span>
            <p className="text-sm text-slate-500">{email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${userRole.bg} ${userRole.text}`}
        >
          {userRole.label}
        </span>
      </td>

      {/* Email Verified */}
      <td className="px-4 py-3">
        {email_verified_at ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {formatDate(email_verified_at)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            Not verified
          </span>
        )}
      </td>

      {/* Joined */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {formatDate(created_at)}
      </td>

      <td className={tdStyle}>
        <div className="flex items-center gap-2 transition-opacity">
          <ActionButtons type="view" category="students" id={id} />

          {canUpdateDelete && (
            <Modal>
              <Modal.Open opens="user-form">
                <ActionButtons type="update" category="students" id={id} />
              </Modal.Open>

              <Modal.Window name="user-form">
                <CreateUpdateUserForm userToUpdate={user} />
              </Modal.Window>

              <Modal.Open opens="delete-user">
                <ActionButtons type="delete" category="users" id={id} />
              </Modal.Open>

              <Modal.Window name="delete-user">
                <ConfirmDelete
                  resourceName="user"
                  itemName={name}
                  onConfirm={() => deleteUser(id)}
                  disabled={isDeleting}
                />
              </Modal.Window>
            </Modal>
          )}
        </div>
      </td>
    </tr>
  );
}

export default UserRow;
