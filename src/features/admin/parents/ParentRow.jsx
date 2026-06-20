import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import CreateUpdateParentForm from "./CreateUpdateParentForm";
import useParentMutations from "./useParentMutations";

const tdStyle = "px-6 py-4";

function ParentRow({ parent }) {
  const { isDeleting, deleteParent } = useParentMutations();

  const {
    id,
    parent_id,
    address,
    phone,
    occupation,
    students,
    user = {},
  } = parent;
  const { name, email } = user;

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* Teacher ID */}
      <td className={`${tdStyle} text-slate-500 font-mono text-xs`}>
        {parent_id}
      </td>

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

      {/* Email */}
      <td className={`${tdStyle} text-slate-500`}>{address}</td>

      {/* Phone */}
      <td className={`${tdStyle} text-slate-500`}>{phone || "—"}</td>

      {/* Occupation */}
      <td className={tdStyle}>
        {occupation ? (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-500">
            {occupation}
          </span>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </td>

      {/* Actions */}
      <td className={tdStyle}>
        <div className="flex items-center gap-2  transition-opacity">
          <ActionButtons type="view" category="parents" id={id} />

          <Modal>
            <Modal.Open opens="update-parent-form">
              <ActionButtons type="update" category="parents" />
            </Modal.Open>
            <Modal.Window name="update-parent-form">
              <CreateUpdateParentForm parentToUpdate={parent} />
            </Modal.Window>

            <Modal.Open opens="delete-parent">
              <ActionButtons type="delete" category="parents" />
            </Modal.Open>

            <Modal.Window name="delete-parent">
              <ConfirmDelete
                resourceName="parent"
                itemName={parent_id}
                disabled={isDeleting}
                onConfirm={() => deleteParent(id)}
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default ParentRow;
