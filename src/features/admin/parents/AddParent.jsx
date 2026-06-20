import AddButton from "../../../ui/AddButton";
import Modal from "../../../ui/Modal";
import CreateUpdateParentForm from "./CreateUpdateParentForm";

function AddParent() {
  return (
    <Modal>
      <Modal.Open opens="add-parent-form">
        <AddButton>Parent</AddButton>
      </Modal.Open>
      <Modal.Window name="add-parent-form">
        <CreateUpdateParentForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddParent;
