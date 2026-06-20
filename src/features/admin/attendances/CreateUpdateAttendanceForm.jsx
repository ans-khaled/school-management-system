import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import SelectForm from "../../../ui/SelectForm";
import Button from "../../../ui/Button";
import useAttendanceMutations from "./useAttendanceMutations";
import useGetItems from "../../../hooks/useGetItems";
import { formatDateInISO } from "../../../utils/helpers";

const STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "excused", label: "Excused" },
];

function CreateUpdateAttendanceForm({ attendanceToUpdate = {}, onCloseModal }) {
  const { id: editId } = attendanceToUpdate;
  const isUpdateSession = Boolean(editId);

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: isUpdateSession
      ? {
          ...attendanceToUpdate,
          date: formatDateInISO(attendanceToUpdate.date),
        }
      : {},
  });

  const { errors } = formState;

  const { createAttendance, isCreating, updateAttendance, isUpdating } =
    useAttendanceMutations();
  const isWorking = isCreating || isUpdating;

  // fetch students and exams for dropdowns
  const { isLoading: isLoadingStudents, items: students } =
    useGetItems("students");
  const { isLoading: isLoadingClassrooms, items: classrooms } =
    useGetItems("classrooms");

  const studentOptions = [
    { value: "", label: "Select student..." },
    ...students.map((s) => ({
      value: s.id,
      label: `${s.user?.name}`,
    })),
  ];
  const classroomOptions = [
    { value: "", label: "Select classroom..." },
    ...classrooms.map((s) => ({
      value: s.id,
      label: `${s.name}`,
    })),
  ];

  function onSubmit(data) {
    if (isUpdateSession) {
      updateAttendance(
        {
          item: {
            student_id: Number(data.student_id),
            classroom: Number(data.classroom_id),
            ...data,
          },
          id: editId,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      createAttendance(
        {
          student_id: Number(data.student_id),
          classroom_id: Number(data.classroom_id),
          ...data,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    }
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type="modal">
      {/* STUDENT */}
      <FormRow label="Student" error={errors?.student_id?.message}>
        <SelectForm
          id="student_id"
          options={studentOptions}
          disabled={isWorking || isUpdateSession || isLoadingStudents}
          {...register("student_id", { required: "Student is required" })}
        />
      </FormRow>

      {/* CLASSROOM */}
      <FormRow label="Classroom" error={errors?.classroom_id?.message}>
        <SelectForm
          id="classroom_id"
          options={classroomOptions}
          disabled={isWorking || isUpdateSession || isLoadingClassrooms}
          {...register("classroom_id", { required: "Classroom is required" })}
        />
      </FormRow>

      {/* STATUS */}
      <FormRow label="Status" error={errors?.status?.message}>
        <SelectForm
          id="status"
          options={STATUS_OPTIONS}
          disabled={isWorking}
          {...register("status", { required: "Status is required" })}
        />
      </FormRow>

      {/* DATE */}
      <FormRow label="Attendance date" error={errors?.date?.message}>
        <Input
          type="date"
          id="date"
          disabled={isWorking}
          // Can't be in the future
          max={new Date().toISOString().split("T")[0]}
          {...register("date", { required: "Attendance date is required" })}
        />
      </FormRow>

      {/* NOTES */}
      <FormRow label="Notes" error={errors?.notes?.message}>
        <textarea
          className={`border border-gray-300 p-2 h-[5rem] focus:border-blue-500 outline-none`}
          type="text"
          disabled={isWorking}
          id="notes"
          {...register("notes", {
            maxLength: {
              value: 255,
              message: "notes not exceed 255 characters",
            },
            minLength: {
              value: 2,
              message: "notes be at least 2 characters",
            },
          })}
        />
      </FormRow>

      {/* BUTTONS */}
      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          disabled={isWorking}
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isUpdateSession ? "Update Attendance" : "Add Attendance"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateAttendanceForm;
