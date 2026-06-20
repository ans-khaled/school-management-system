import AddButton from "../../../ui/AddButton";
import CreateUpdateStudentForm from "./CreateUpdateStudentForm";
import Modal from "../../../ui/Modal";

function AddStudent() {
  return (
    <Modal>
      <Modal.Open opens="student-form">
        <AddButton>Student</AddButton>
      </Modal.Open>
      <Modal.Window name="student-form">
        <CreateUpdateStudentForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddStudent;
