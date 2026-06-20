import Modal from "../../../ui/Modal";
import AddButton from "../../../ui/AddButton";
import CreateUpdateSubjectForm from "./CreateUpdateSubjectForm";

function AddSubject() {
  return (
    <Modal>
      <Modal.Open opens="subject-form">
        <AddButton>Subject</AddButton>
      </Modal.Open>

      <Modal.Window name="subject-form">
        <CreateUpdateSubjectForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddSubject;
