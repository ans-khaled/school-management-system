import { useForm } from "react-hook-form";
import useParentMutations from "./useParentMutations";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";

function CreateUpdateParentForm({ parentToUpdate = {}, onCloseModal }) {
  const { isCreating, createParent, isUpdating, updateParent } =
    useParentMutations();

  const isWorking = isCreating || isUpdating;

  const { id: editId } = parentToUpdate;
  const isUpdateSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isUpdateSession
      ? {
          ...parentToUpdate,
          name: parentToUpdate.user?.name,
          email: parentToUpdate.user?.email,
        }
      : {},
  });
  const { errors } = formState;

  function onSubmit(data) {
    const { name, phone, address, occupation } = data;

    if (isUpdateSession) {
      updateParent(
        { newParentData: { name, phone, address, occupation }, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      createParent(data, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError() {
    console.log(errors);
  }

  /*
  Create Parent:
  {
  "name": "Fatima Ahmed",
  "email": "fatima@example.com",
  "password": "password123",
  "parent_id": "PAR002",
  "phone": "+201234567895",
  "address": "666 Family St",
  "occupation": "Doctor"
}
  */

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type="modal">
      <FormRow label="Full Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Full name must be at least 2 characters",
            },
            maxLength: {
              value: 255,
              message: "Full name must not exceed 255 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking || isUpdateSession}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
      </FormRow>

      {!isUpdateSession && (
        <FormRow label="Password" error={errors?.password?.message}>
          <Input
            type="password"
            id="password"
            disabled={isWorking}
            {...register("password", {
              required: "Password is required!",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
        </FormRow>
      )}

      <FormRow label="Parent ID" error={errors?.parent_id?.message}>
        <Input
          type="text"
          id="parent_id"
          disabled={isWorking || isUpdateSession}
          placeholder="e.g. PAR001"
          {...register("parent_id", {
            required: "Student ID is required!",
            pattern: {
              value: /^PAR\d+$/i,
              message: "Student ID must follow the format PAR001",
            },
          })}
        />
      </FormRow>

      {/* Optional */}
      <FormRow label="Phone number" error={errors?.phone?.message}>
        <Input
          type="tel"
          id="phone"
          disabled={isWorking}
          placeholder="+201234567890"
          {...register("phone", {
            pattern: {
              value: /^\+20[0-9]{10}$/,
              message: "Enter a valid Egyptian phone number (+20XXXXXXXXXX)",
            },
          })}
        />
      </FormRow>

      {/* Optional */}
      <FormRow label="Address" error={errors?.address?.message}>
        <Input
          type="text"
          id="address"
          disabled={isWorking}
          {...register("address", {
            maxLength: {
              value: 500,
              message: "Address must not exceed 500 characters",
            },
          })}
        />
      </FormRow>

      {/* Optional */}
      <FormRow label="Occupation" error={errors?.occupation?.message}>
        <Input
          type="text"
          id="occupation"
          disabled={isWorking}
          {...register("occupation", {
            maxLength: {
              value: 500,
              message: "Occupation must not exceed 500 characters",
            },
          })}
        />
      </FormRow>

      {/* Actions */}
      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isUpdateSession ? "Update Parent" : "Add Parent"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateParentForm;
