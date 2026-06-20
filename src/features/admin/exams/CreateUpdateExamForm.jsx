import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import SelectForm from "../../../ui/SelectForm";
import Button from "../../../ui/Button";
import useExamMutations from "./useExamMutations";
import useGetItems from "../../../hooks/useGetItems";
import { formatDateInISO } from "../../../utils/helpers";

function CreateUpdateExamForm({ examToUpdate = {}, onCloseModal }) {
  const { id: editId } = examToUpdate;
  const isUpdateSession = Boolean(editId);

  console.log(examToUpdate);

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: isUpdateSession
      ? {
          ...examToUpdate,
          scheduled_at: formatDateInISO(examToUpdate.scheduled_at),
        }
      : {},
  });

  const { errors } = formState;

  const { createExam, isCreating, updateExam, isUpdating } = useExamMutations();
  const isWorking = isCreating || isUpdating;

  // fetch subjects and classrooms for dropdowns
  const { isLoading: isLoadingSubjects, items: subjects } =
    useGetItems("subjects");
  const { isLoading: isLoadingClassrooms, items: classrooms } =
    useGetItems("classrooms");

  const subjectOptions = [
    { value: "", label: "Select subject..." },
    ...subjects.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` })),
  ];

  const classroomOptions = [
    { value: "", label: "Select classroom..." },
    ...classrooms.map((c) => ({ value: c.id, label: c.name })),
  ];

  function onSubmit(data) {
    console.log(data);

    const { subject_id, classroom_id, max_score, duration_minutes, is_online } =
      data;

    if (isUpdateSession) {
      updateExam(
        {
          item: {
            subject_id: Number(data.subject_id),
            classroom_id: Number(data.classroom_id),
            max_score: Number(data.max_score),
            duration_minutes: Number(data.duration_minutes),
            is_online: data.is_online === "true",
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
      createExam(
        { ...data, is_online: data.is_online === "true" },
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
      {/* NAME */}
      <FormRow label="Exam Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking || isUpdateSession}
          placeholder="e.g. Math Midterm"
          {...register("name", {
            required: "Exam name is required",
            maxLength: {
              value: 255,
              message: "Name must not exceed 255 characters",
            },
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
        />
      </FormRow>

      {/* SUBJECT */}
      <FormRow label="Subject" error={errors?.subject_id?.message}>
        <SelectForm
          id="subject_id"
          options={subjectOptions}
          disabled={isWorking || isUpdateSession || isLoadingSubjects}
          {...register("subject_id", { required: "Subject is required" })}
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

      {/*  Exam Type */}
      <FormRow label="Exam Type" error={errors?.type?.message}>
        <SelectForm
          id="type"
          options={[
            { value: "", label: "Select type..." },
            { value: "midterm", label: "Midterm" },
            { value: "final", label: "Final" },
            { value: "other", label: "Other" },
          ]}
          disabled={isWorking || isUpdateSession}
          {...register("type", { required: "Type is required" })}
        />
      </FormRow>

      {/* is_online toggle */}
      <FormRow label="Online Exam" error={errors?.is_online?.message}>
        <SelectForm
          id="is_online"
          options={[
            { value: "", label: "Select..." },
            { value: "true", label: "Online" },
            { value: "false", label: "Offline" },
          ]}
          {...register("is_online")}
        />
      </FormRow>

      {/* date → scheduled_at (optional since API returns null) */}
      <FormRow label="Scheduled At" error={errors?.scheduled_at?.message}>
        <Input
          type="date"
          id="scheduled_at"
          disabled={isWorking}
          min={new Date().toISOString().split("T")[0]}
          {...register("scheduled_at", {
            required: "Exam date is required",
            validate: (value) => {
              if (!value) return true;
              const today = new Date().toISOString().split("T")[0];
              return value >= today || "Scheduled date cannot be in the past";
            },
          })}
        />
      </FormRow>

      {/* Max Score */}
      <FormRow label="Max Score" error={errors?.max_score?.message}>
        <Input
          type="number"
          id="max_score"
          disabled={isWorking}
          placeholder="e.g. 100"
          {...register("max_score", {
            required: "Max Score is required",
            min: { value: 1, message: "Must be at least 1" },
          })}
        />
      </FormRow>

      {/* DURATION */}
      <FormRow
        label="Duration (minutes)"
        error={errors?.duration_minutes?.message}
      >
        <Input
          type="number"
          id="duration_minutes"
          disabled={isWorking}
          placeholder="e.g. 60"
          {...register("duration_minutes", {
            required: "Duration is required",
            min: { value: 1, message: "Must be at least 1 minute" },
          })}
        />
      </FormRow>

      {/* INSTRUCTIONS */}
      <FormRow
        label="Instructions (optional)"
        error={errors?.instructions?.message}
      >
        <Input
          type="text"
          id="instructions"
          disabled={isWorking}
          placeholder="e.g. Answer all questions"
          {...register("instructions")}
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
          {isUpdateSession ? "Update Exam" : "Add Exam"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateExamForm;
