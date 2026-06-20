import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import useGetItems from "../../../hooks/useGetItems";

import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Button from "../../../ui/Button";
import SelectForm from "../../../ui/SelectForm";
import Input from "../../../ui/Input";

import useSubjectMutations from "./useSubjectMutations";
import useClassMutations from "../classes/useClassMutations";

const academicYearOptions = [
  { value: "", label: "Select academic year..." },
  { value: "2024-2025", label: "2024-2025" },
  { value: "2025-2026", label: "2025-2026" },
  { value: "2026-2027", label: "2026-2027" },
];

function AssignUpdateSubjectForm({
  onCloseModal,
  classroom = [],
  editSession = false,
}) {
  const { id: subjectId } = useParams();

  const { isLoading: isLoadingClassrooms, items: classroomsData } =
    useGetItems("classrooms");
  const { isLoading: isLoadingTeachers, items: teachersData } =
    useGetItems("teachers");

  console.log(classroomsData);
  console.log(teachersData);

  const { assignSubject, isAssigningSubject, updateHours, isUpdatingHours } =
    useClassMutations();

  const isWorking = isAssigningSubject || isUpdatingHours;

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: editSession
      ? { weekly_hours: classroom?.pivot?.weekly_hours }
      : {},
  });

  const { errors } = formState;

  function onSubmit(data) {
    const { classroom_id, teacher_id, weekly_hours } = data;

    if (editSession) {
      updateHours(
        {
          subject_id: Number(subjectId),
          classroom_id: classroom.id,
          weekly_hours: Number(weekly_hours),
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      assignSubject(
        {
          ...data,
          subject_id: Number(subjectId),
          classroom_id: Number(classroom_id),
          teacher_id: Number(teacher_id),
          weekly_hours: Number(weekly_hours),
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

  const classroomsOptions = [
    { value: "", label: "Select a classroom..." },
    ...(classroomsData?.map((s) => ({
      value: s.id,
      label: s.name,
    })) ?? []),
  ];

  const teachersOptions = [
    { value: "", label: "Select a teacher..." },
    ...(teachersData?.map((t) => ({
      value: t.id,
      label: `${t.user?.name || ""} (${t.teacher_id})`,
    })) ?? []),
  ];

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type="modal">
      {!editSession && (
        <>
          <FormRow label="Classroom" error={errors?.classroom_id?.message}>
            <SelectForm
              options={classroomsOptions}
              disabled={isLoadingClassrooms || isWorking}
              id="classroom_id"
              {...register("classroom_id", {
                required: "Classroom is required",
              })}
            />
          </FormRow>

          <FormRow label="Teacher" error={errors?.teacher_id?.message}>
            <SelectForm
              id="teacher_id"
              options={teachersOptions}
              disabled={isLoadingTeachers || isWorking}
              {...register("teacher_id", {
                required: "Teacher is required",
              })}
            />
          </FormRow>
        </>
      )}

      <FormRow label="Weekly Hours" error={errors?.weekly_hours?.message}>
        <Input
          type="number"
          disabled={isWorking}
          id="weekly_hours"
          {...register("weekly_hours", {
            required: "Weekly hours is required",
            max: {
              value: 10,
              message: "Max 10 hours only",
            },
            min: {
              value: 1,
              message: "Minimum hours is 1",
            },
          })}
        />
      </FormRow>

      {!editSession && (
        <>
          <FormRow label="Academic Year" error={errors?.academic_year?.message}>
            <SelectForm
              id="academic_year"
              options={academicYearOptions}
              disabled={isWorking}
              {...register("academic_year", {
                required: "Academic year is required",
              })}
            />
          </FormRow>

          <FormRow label="Semester" error={errors?.semester?.message}>
            <SelectForm
              id="semester"
              {...register("semester", { required: true })}
              options={[
                { value: "", label: "Select semester..." },
                { value: "first", label: "First" },
                { value: "second", label: "Second" },
              ]}
            />
          </FormRow>
        </>
      )}

      <FormRow>
        <Button
          variation="secondary"
          type="button"
          disabled={isWorking}
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>

        <Button disabled={isWorking}>
          {editSession ? "Update Weekly hours" : "Add classroom with teacher"}
        </Button>
      </FormRow>
    </Form>
  );
}
export default AssignUpdateSubjectForm;
