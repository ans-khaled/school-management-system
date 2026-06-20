import { useForm } from "react-hook-form";
import useGetItems from "../../../hooks/useGetItems";
import useClassMutations from "./useClassMutations";

import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Button from "../../../ui/Button";
import SelectForm from "../../../ui/SelectForm";
import Input from "../../../ui/Input";

const teacherRoleOptions = [
  { value: "", label: "Select teacher role..." },
  { value: "assistant", label: "Assistant teacher" },
  { value: "subject_teacher", label: "Subject teacher" },
  { value: "homeroom", label: "homeroom" },
];

function AssginUpdateTeacherForm({
  teacherToUpdate = {},
  classroomId,
  onCloseModal,
}) {
  const { id: editId } = teacherToUpdate;
  const isUpdateRoleSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const {
    assignTeacher,
    isAssigningTeacher,
    updateTeacherRole,
    isUpdatingTeacherRole,
  } = useClassMutations();

  const isWorking = isAssigningTeacher || isUpdatingTeacherRole;

  const { items: teachers, isLoading } = useGetItems("teachers");

  function onSubmit(data) {
    if (isUpdateRoleSession) {
      updateTeacherRole(
        {
          ...data,
          classroom_id: classroomId,
          teacher_id: editId,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      assignTeacher(
        { ...data, classroom_id: classroomId },
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
          {isUpdateRoleSession ? "Update Teacher Role" : "Assign Teacher"}
        </h2>
        <p className="text-sm text-slate-400 mt-0.5">
          {isUpdateRoleSession
            ? "Update Teacher Role in this classroom"
            : "Assign teacher into this classroom"}
        </p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit, onError)} type="modal">
        {/* Teacher */}
        {!isUpdateRoleSession && (
          <FormRow label="Teacher" error={errors?.teacher_id?.message}>
            <SelectForm
              id="teacher_id"
              options={teacherOptions}
              disabled={isLoading || isWorking}
              {...register("teacher_id", { required: "Teacher is required" })}
            />
          </FormRow>
        )}

        {/* Teacher Role */}
        <FormRow label="Teacher role" error={errors?.role?.message}>
          <SelectForm
            id="role"
            options={teacherRoleOptions}
            disabled={isWorking}
            {...register("role", { required: "Teacher role is required" })}
          />
        </FormRow>

        {/* Assigned at */}
        {!isUpdateRoleSession && (
          <FormRow label="Assigned at" error={errors?.assigned_at?.message}>
            <Input
              type="date"
              id="assigned_at"
              disabled={isWorking}
              {...register("assigned_at", {
                required: "Assigned at is required",
              })}
            />
          </FormRow>
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
            {isUpdateRoleSession ? "Update Role" : "Assign Teacher"}
          </Button>
        </FormRow>
      </Form>
    </div>
  );
}

export default AssginUpdateTeacherForm;
