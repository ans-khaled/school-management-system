import { useForm } from "react-hook-form";

import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Button from "../../../ui/Button";
import SelectForm from "../../../ui/SelectForm";
import Input from "../../../ui/Input";

import useGetItems from "../../../hooks/useGetItems";
import useScheduleMutations from "./useScheduleMutations";

const DAY_OPTIONS = [
  { value: "", label: "Select day..." },
  { value: "monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

const ACADEMIC_YEAR_OPTIONS = [
  { value: "", label: "Select year..." },
  { value: "2025-2026", label: "Select year..." },
  { value: "", label: "Select year..." },
  { value: "", label: "Select year..." },
  { value: "", label: "Select year..." },
];

function CreateUpdateScheduleForm({ scheduleToUpdate = {}, onCloseModal }) {
  const { id: editId } = scheduleToUpdate;
  const isUpdateSession = Boolean(editId);

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: isUpdateSession
      ? {
          classroom_id: scheduleToUpdate.classroom_id,
          subject_id: scheduleToUpdate.subject_id,
          teacher_id: scheduleToUpdate.teacher_id,
          day_of_week: scheduleToUpdate.day_of_week,
          start_time: scheduleToUpdate.start_time,
          end_time: scheduleToUpdate.end_time,
        }
      : {},
  });

  const { errors } = formState;

  const { createSchedule, updateSchedule, isCreating, isUpdating } =
    useScheduleMutations();

  const isWorking = isCreating || isUpdating;

  const { items: classrooms = [], isLoading: isLoadingClassrooms } =
    useGetItems("classrooms");

  const { items: subjects = [], isLoading: isLoadingSubjects } =
    useGetItems("subjects");

  const { items: teachers = [], isLoading: isLoadingTeachers } =
    useGetItems("teachers");

  const classroomOptions = [
    { value: "", label: "Select classroom..." },
    ...classrooms.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  const subjectOptions = [
    { value: "", label: "Select subject..." },
    ...subjects.map((s) => ({
      value: s.id,
      label: s.name,
    })),
  ];

  const teacherOptions = [
    { value: "", label: "Select teacher..." },
    ...teachers.map((t) => ({
      value: t.id,
      label: `${t.user?.name} (${t.teacher_id})`,
    })),
  ];

  function onSubmit(data) {
    const scheduleData = {
      classroom_id: Number(data.classroom_id),
      subject_id: Number(data.subject_id),
      teacher_id: Number(data.teacher_id),
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
      academic_year: data.academic_year,
    };

    if (isUpdateSession) {
      updateSchedule(
        {
          id: editId,
          item: scheduleData,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      createSchedule(scheduleData, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type="modal">
      <FormRow label="Classroom" error={errors?.classroom_id?.message}>
        <SelectForm
          id="classroom_id"
          options={classroomOptions}
          disabled={isWorking || isLoadingClassrooms}
          {...register("classroom_id", {
            required: "Classroom is required",
          })}
        />
      </FormRow>

      <FormRow label="Subject" error={errors?.subject_id?.message}>
        <SelectForm
          id="subject_id"
          options={subjectOptions}
          disabled={isWorking || isLoadingSubjects}
          {...register("subject_id", {
            required: "Subject is required",
          })}
        />
      </FormRow>

      <FormRow label="Teacher" error={errors?.teacher_id?.message}>
        <SelectForm
          id="teacher_id"
          options={teacherOptions}
          disabled={isWorking || isLoadingTeachers}
          {...register("teacher_id", {
            required: "Teacher is required",
          })}
        />
      </FormRow>

      <FormRow label="Day" error={errors?.day_of_week?.message}>
        <SelectForm
          id="day_of_week"
          options={DAY_OPTIONS}
          disabled={isWorking}
          {...register("day_of_week", {
            required: "Day is required",
          })}
        />
      </FormRow>

      <FormRow label="Start Time" error={errors?.start_time?.message}>
        <Input
          type="time"
          id="start_time"
          disabled={isWorking}
          {...register("start_time", {
            required: "Start time is required",
          })}
        />
      </FormRow>

      <FormRow label="End Time" error={errors?.end_time?.message}>
        <Input
          type="time"
          id="end_time"
          disabled={isWorking}
          {...register("end_time", {
            required: "End time is required",
          })}
        />
      </FormRow>

      <FormRow label="Academic year" error={errors?.academic_year?.message}>
        <SelectForm
          id="academic_year"
          options={ACADEMIC_YEAR_OPTIONS}
          {...register("academic_year", {
            required: "Academic year is required",
          })}
        />
      </FormRow>

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
          {isUpdateSession ? "Update Schedule" : "Add Schedule"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateScheduleForm;
