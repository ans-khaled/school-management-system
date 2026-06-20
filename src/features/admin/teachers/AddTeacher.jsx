import AddButton from "../../../ui/AddButton";
import Modal from "../../../ui/Modal";
import CreateUpdateTeacherForm from "./CreateUpdateTeacherForm";

function AddTeacher() {
  return (
    <Modal>
      <Modal.Open opens="teacher-form">
        <AddButton>Teacher</AddButton>
      </Modal.Open>
      <Modal.Window name="teacher-form">
        <CreateUpdateTeacherForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddTeacher;
