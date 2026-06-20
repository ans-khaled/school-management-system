import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Button from "../../../ui/Button";
import useClassMutation from "./useClassMutations";
import Input from "../../../ui/Input";
import SelectForm from "../../../ui/SelectForm";

const gradeLevelOptions = Array.from({ length: 6 }, (_, i) => ({
  value: `Grade ${i + 1}`,
  label: `Grade ${i + 1}`,
}));

console.log(gradeLevelOptions);
const academicYearOptions = [
  { value: "", label: "Select academic year..." },
  { value: "2023-2024", label: "2023 - 2024" },
  { value: "2024-2025", label: "2024 - 2025" },
  { value: "2025-2026", label: "2025 - 2026" },
];

function CreateUpdateClassForm({ classToUpdate = {}, onCloseModal }) {
  const { id: editId } = classToUpdate;
  const isUpdateSession = Boolean(editId);

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: isUpdateSession ? classToUpdate : {},
  });
  const { errors } = formState;

  const { createClass, isCreating, updateClass, isUpdating } =
    useClassMutation();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data) {
    console.log(data);
    const { name, capacity, description } = data;

    if (isUpdateSession) {
      updateClass(
        { item: { name, capacity, description }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      createClass(data, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Class name" error={errors?.name?.message}>
        <Input
          type="text"
          disabled={isWorking}
          id="name"
          {...register("name", {
            required: "Class name is required",
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

      <FormRow label="Grade Level" error={errors?.grade_level?.message}>
        <SelectForm
          id="grade_level"
          disabled={isWorking || isUpdateSession}
          options={[
            { value: "", label: "Select grade level..." },
            ...gradeLevelOptions,
          ]}
          {...register("grade_level", {
            required: "Grade level is required",
          })}
        />
      </FormRow>

      <FormRow label="Academic year" error={errors?.academic_year?.message}>
        <SelectForm
          id="academic_year"
          disabled={isWorking || isUpdateSession}
          options={academicYearOptions}
          {...register("academic_year", {
            required: "Academic year is required",
          })}
        />
      </FormRow>

      <FormRow label="Capacity" error={errors?.capacity?.message}>
        <Input
          type="number"
          disabled={isWorking}
          id="capacity"
          {...register("capacity", {
            required: "Capacity is required",
            max: {
              value: 255,
              message: "Capacity must not exceed 50 characters",
            },
            min: {
              value: 2,
              message: "Capacity must be at least 2 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <textarea
          className={`border border-gray-300 p-2 h-[5rem] focus:border-blue-500 outline-none`}
          type="text"
          disabled={isWorking}
          id="description"
          {...register("description", {
            maxLength: {
              value: 255,
              message: "description not exceed 255 characters",
            },
            minLength: {
              value: 2,
              message: "description be at least 2 characters",
            },
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
          {isUpdateSession ? "Update Class" : "Add Class"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateClassForm;
