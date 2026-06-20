import Modal from "../../../ui/Modal";
import AddButton from "../../../ui/AddButton";
import CreateUpdateUserForm from "./CreateUpdateUserForm";

function AddUser() {
  return (
    <Modal>
      <Modal.Open opens="create-user-form">
        <AddButton>User</AddButton>
      </Modal.Open>
      <Modal.Window name="create-user-form">
        <CreateUpdateUserForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddUser;
