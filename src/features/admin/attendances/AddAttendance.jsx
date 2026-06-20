import Modal from "../../../ui/Modal";
import AddButton from "../../../ui/AddButton";
import CreateUpdateAttendanceForm from "./CreateUpdateAttendanceForm";

function AddAttendance() {
  return (
    <Modal>
      <Modal.Open opens="add-attendance-form">
        <AddButton>Attendance</AddButton>
      </Modal.Open>
      <Modal.Window name="add-attendance-form">
        <CreateUpdateAttendanceForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddAttendance;
