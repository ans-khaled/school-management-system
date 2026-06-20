import Modal from "../../../ui/Modal";
import AddButton from "../../../ui/AddButton";
import CreateUpdateScheduleForm from "./CreateUpdateScheduleForm";

function AddSchedule() {
  return (
    <Modal>
      <Modal.Open opens="add-schedule-form">
        <AddButton>Schedule</AddButton>
      </Modal.Open>
      <Modal.Window name="add-schedule-form">
        <CreateUpdateScheduleForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddSchedule;
