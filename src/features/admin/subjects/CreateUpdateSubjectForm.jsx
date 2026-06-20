import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import SelectForm from "../../../ui/SelectForm";
import useSubjectMutations from "./useSubjectMutations";

function CreateUpdateSubjectForm({ subjectToUpdate = {}, onCloseModal }) {
  console.log(subjectToUpdate);
  const { id: editId } = subjectToUpdate;
  const isUpdateSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isUpdateSession ? subjectToUpdate : {},
  });
  const { errors } = formState;

  const { isCreating, createSubject, isUpdating, updateSubject } =
    useSubjectMutations();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data) {
    console.log(data);

    if (isUpdateSession) {
      updateSubject(
        {
          newSubjectData: data,
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
      createSubject(data, {
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
      <FormRow label="Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking || isUpdateSession}
          {...register("name", {
            required: "Full name is required",
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

      {/* CODE */}
      <FormRow label="Code" error={errors?.code?.message}>
        <Input
          type="text"
          id="code"
          disabled={isWorking || isUpdateSession}
          placeholder="e.g. ENG201"
          {...register("code", {
            required: "Subject code is required!",
            pattern: {
              value: /^[A-Z]{2,10}\d{1,5}$/i,
              message: "Subject code must follow the format ENG201",
            },
          })}
        />
      </FormRow>

      {/* TYPE */}
      <FormRow label="Subject Type" error={errors?.type?.message}>
        <SelectForm
          id="type"
          disabled={isWorking}
          options={[
            { value: "", label: "Select type..." },
            { value: "core", label: "Core" },
            { value: "elective", label: "Elective" },
          ]}
          {...register("type", { required: "Subject type is required" })}
        />
      </FormRow>

      {/* CREDITS */}
      <FormRow label="Credits" error={errors?.credits?.message}>
        <Input
          type="number"
          id="credits"
          disabled={isWorking}
          placeholder="e.g. 3"
          {...register("credits", {
            required: "Credits are required",
            min: { value: 1, message: "Must be at least 1 credit" },
            max: { value: 10, message: "Must not exceed 10 credits" },
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <textarea
          type="text"
          id="description"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 resize-none"
          rows={4}
          disabled={isWorking}
          {...register("description", {
            required: "Description is required",
            maxLength: {
              value: 255,
              message: "Description must not exceed 255 characters",
            },
            minLength: {
              value: 2,
              message: "Description must be at least 2 characters",
            },
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
          disabled={isWorking}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isUpdateSession ? "Update Subject" : "Add Subject"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateSubjectForm;
