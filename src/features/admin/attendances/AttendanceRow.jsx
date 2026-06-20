import useAttendanceMutations from "./useAttendanceMutations";
import CreateUpdateAttendanceForm from "./CreateUpdateAttendanceForm";
import ActionButtons from "../../../ui/ActionButtons";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";

const STATUS_STYLES = {
  present: "bg-green-50 text-green-500",
  absent: "bg-red-50 text-red-400",
  late: "bg-yellow-50 text-yellow-500",
  excused: "bg-blue-50 text-blue-500",
};

function AttendanceRow({ attendance }) {
  const { id, student, classroom, date, status, notes } = attendance;

  const { deleteAttendance, isDeleting } = useAttendanceMutations();

  const badgeClass = STATUS_STYLES[status] ?? "bg-slate-50 text-slate-500";

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      <td className="px-6 py-3.5 text-slate-500">
        {student?.student_id ?? "—"}
      </td>
      <td className="px-6 py-3.5 font-medium text-slate-800">
        {student?.user?.name ?? "—"}
      </td>
      <td className="px-6 py-3.5 text-slate-500">{classroom?.name ?? "—"}</td>
      <td className="px-6 py-3.5 text-slate-500 text-xs">
        {date
          ? new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—"}
      </td>
      <td className="px-6 py-3.5">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${badgeClass}`}
        >
          {status ?? "—"}
        </span>
      </td>
      <td className="px-6 py-3.5 text-slate-500 text-xs truncate max-w-[160px]">
        {notes ?? "—"}
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-2">
          <Modal>
            <Modal.Open opens="update-attendance-form">
              <ActionButtons type="update" />
            </Modal.Open>
            <Modal.Window name="update-attendance-form">
              <CreateUpdateAttendanceForm attendanceToUpdate={attendance} />
            </Modal.Window>

            <Modal.Open opens="delete-attendance">
              <ActionButtons type="delete" />
            </Modal.Open>
            <Modal.Window name="delete-attendance">
              <ConfirmDelete
                resourceName="attendance"
                itemName={student?.user?.name}
                disabled={isDeleting}
                onConfirm={() => deleteAttendance(id)}
              />
            </Modal.Window>
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default AttendanceRow;
