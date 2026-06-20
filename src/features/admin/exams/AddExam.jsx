import Modal from "../../../ui/Modal";
import AddButton from "../../../ui/AddButton";
import CreateUpdateExamForm from "./CreateUpdateExamForm";

function AddExam() {
  return (
    <Modal>
      <Modal.Open opens="add-exam-form">
        <AddButton>Exam</AddButton>
      </Modal.Open>
      <Modal.Window name="add-exam-form">
        <CreateUpdateExamForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddExam;
