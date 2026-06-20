import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import SelectForm from "../../../ui/SelectForm";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import useGetItems from "../../../hooks/useGetItems";
import useClassMutations from "./useClassMutations";
import { useForm } from "react-hook-form";

const academicYearOptions = [
  { value: "", label: "Select academic year..." },
  { value: "2024-2025", label: "2024-2025" },
  { value: "2025-2026", label: "2025-2026" },
  { value: "2026-2027", label: "2026-2027" },
];

const semesterOptions = [
  { value: "", label: "Select semester..." },
  { value: "first", label: "First" },
  { value: "second", label: "Second" },
];

function AssignUpdateSubjectForm({
  subjectToUpdate = {},
  classroomId,
  onCloseModal,
}) {
  const { id: editId } = subjectToUpdate;
  const isUpdatingTeacherSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const { items: subjects, isLoading: isLoadingSubjects } =
    useGetItems("subjects");
  const { items: teachers, isLoading: isLoadingTeachers } =
    useGetItems("teachers");

  const {
    assignSubject,
    isAssigningSubject,
    updateSubjectTeacher,
    isUpdatingTeacher,
  } = useClassMutations();

  const isWorking = isAssigningSubject || isUpdatingTeacher;

  function onSubmit(data) {
    const { subject_id, teacher_id, weekly_hours } = data;

    if (isUpdatingTeacherSession) {
      updateSubjectTeacher(
        {
          classroom_id: classroomId,
          subject_id: editId,
          new_teacher_id: Number(teacher_id),
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
          classroom_id: classroomId,
          weekly_hours: Number(weekly_hours),
          teacher_id: Number(teacher_id),
          subject_id: Number(subject_id),
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

  function onError() {
    console.log(errors);
  }

  const subjectOptions = [
    { value: "", label: "Select a subject..." },
    ...(subjects?.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.code})`,
    })) ?? []),
  ];

  const teacherOptions = [
    { value: "", label: "Select a teacher..." },
    ...(teachers?.map((t) => ({
      value: t.id,
      label: `${t.user?.name || ""} (${t.teacher_id})`,
    })) ?? []),
  ];

  return (
    <div className="flex flex-col gap-6 p-2">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          {isUpdatingTeacherSession ? "Update Teacher" : "Assign Subject"}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          {isUpdatingTeacherSession
            ? "Update a subject teacher"
            : "Assign a subject into this classroom"}{" "}
        </p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit, onError)} type="modal">
        {/* Subject */}
        {!isUpdatingTeacherSession && (
          <FormRow label="Subject" error={errors?.subject_id?.message}>
            <SelectForm
              id="subject_id"
              options={subjectOptions}
              disabled={isLoadingSubjects || isWorking}
              {...register("subject_id", {
                required: "Subject is required",
              })}
            />
          </FormRow>
        )}

        {/* Teacher */}
        <FormRow label="Teacher" error={errors?.teacher_id?.message}>
          <SelectForm
            id="teacher_id"
            options={teacherOptions}
            disabled={isLoadingTeachers || isWorking}
            {...register("teacher_id", {
              required: "Teacher is required",
            })}
          />
        </FormRow>

        {!isUpdatingTeacherSession && (
          <>
            {/* Weekly hours */}
            <FormRow label="Weekly hours" error={errors?.weekly_hours?.message}>
              <Input
                id="weekly_hours"
                type="number"
                disabled={isWorking}
                {...register("weekly_hours", {
                  required: "Weekly hours is required",
                  min: { value: 2, message: "Weekly hours must be at least 2" },
                  max: {
                    value: 30,
                    message: "Weekly hours must be at most 30",
                  },
                })}
              />
            </FormRow>

            {/* Academic Year */}
            <FormRow
              label="Academic year"
              error={errors?.academic_year?.message}
            >
              <SelectForm
                id="academic_year"
                options={academicYearOptions}
                disabled={isWorking}
                {...register("academic_year", {
                  required: "Academic year is required",
                })}
              />
            </FormRow>

            {/* Semester */}
            <FormRow label="Semester" error={errors?.semester?.message}>
              <SelectForm
                id="semester"
                options={semesterOptions}
                disabled={isWorking}
                {...register("semester", {
                  required: "Semester is required",
                })}
              />
            </FormRow>
          </>
        )}

        {/* Actions */}
        <FormRow>
          <Button
            variation="secondary"
            disabled={isWorking}
            onClick={onCloseModal}
          >
            Cancel
          </Button>
          <Button disabled={isWorking}>
            {isUpdatingTeacherSession ? "Update Teacher" : "Assign Subject"}
          </Button>
        </FormRow>
      </Form>
    </div>
  );
}

export default AssignUpdateSubjectForm;
