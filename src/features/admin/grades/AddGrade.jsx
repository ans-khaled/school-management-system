import CreateUpdateGradeForm from "./CreateUpdateGradeForm";
import Modal from "../../../ui/Modal";
import AddButton from "../../../ui/AddButton";

function AddGrade() {
  return (
    <Modal>
      <Modal.Open opens="create-grade-form">
        <AddButton>Grade</AddButton>
      </Modal.Open>
      <Modal.Window name="create-grade-form">
        <CreateUpdateGradeForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddGrade;
