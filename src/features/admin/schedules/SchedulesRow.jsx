import useScheduleMutations from "./useScheduleMutations";
import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import CreateUpdateScheduleForm from "./CreateUpdateScheduleForm";

function SchedulesRow({ schedule }) {
  const {
    id,
    subject,
    teacher,
    classroom,
    day_of_week,
    start_time,
    end_time,
    room_number,
    is_active,
  } = schedule;

  const { deleteSchedule, isDeleting } = useScheduleMutations();

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      {/* Subject */}
      <td className="px-6 py-3.5 font-medium text-slate-800">
        {subject?.name ?? "—"}
      </td>

      {/* Teacher */}
      <td className="px-6 py-3.5 text-slate-500">
        {teacher?.teacher_id ?? teacher?.user?.name ?? "—"}
      </td>

      {/* Classroom */}
      <td className="px-6 py-3.5 text-slate-500">{classroom?.name ?? "—"}</td>

      {/* Day */}
      <td className="px-6 py-3.5 text-slate-500 capitalize">
        {day_of_week ?? "—"}
      </td>

      {/* Time */}
      <td className="px-6 py-3.5 text-slate-500 text-xs">
        {start_time && end_time ? `${start_time} - ${end_time}` : "—"}
      </td>

      {/* Room */}
      <td className="px-6 py-3.5 text-slate-500">{room_number ?? "—"}</td>

      {/* Status */}
      <td className="px-6 py-3.5">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}
        >
          {is_active ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-2">
          <Modal>
            <Modal.Open opens="update-schedule">
              <ActionButtons type="update" />
            </Modal.Open>

            <Modal.Window name="update-schedule">
              <CreateUpdateScheduleForm scheduleToUpdate={schedule} />
            </Modal.Window>

            <Modal.Open opens="delete-schedule">
              <ActionButtons type="delete" />
            </Modal.Open>

            <Modal.Window name="delete-schedule">
              <ConfirmDelete
                resourceName="schedule"
                itemName={subject?.name}
                disabled={isDeleting}
                onConfirm={() => deleteSchedule(id)}
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default SchedulesRow;
