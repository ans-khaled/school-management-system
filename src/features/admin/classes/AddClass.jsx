import AddButton from "../../../ui/AddButton";
import Modal from "../../../ui/Modal";
import CreateUpdateClassForm from "./CreateUpdateClassForm";

function AddClass() {
  return (
    <Modal>
      <Modal.Open opens="class-form">
        <AddButton>Class</AddButton>
      </Modal.Open>
      <Modal.Window name="class-form">
        <CreateUpdateClassForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddClass;
