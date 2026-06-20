import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import SelectForm from "../../../ui/SelectForm";
import Button from "../../../ui/Button";
import useUserMutations from "./useUserMutations";
// import useCurrentUser from "../../Authentication/useCurrentUser";
import { useAuth } from "../../../contexts/AuthContext";

function CreateUpdateUserForm({ userToUpdate = {}, onCloseModal }) {
  const { id: editId } = userToUpdate;
  const isUpdateSession = Boolean(editId);

  console.log(userToUpdate);

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: isUpdateSession
      ? {
          name: userToUpdate.name,
          email: userToUpdate.email,
          role: userToUpdate.role,
        }
      : {},
  });

  const { errors } = formState;

  const { createUser, isCreating, updateUser, isUpdating } = useUserMutations();
  const isWorking = isCreating || isUpdating;

  const { user: currentUser } = useAuth();
  console.log(currentUser);
  const isSuperAdmin = currentUser?.role === "super_admin";

  const roleOptions = [
    { value: "", label: "Select role..." },
    // only super_admin can assign super_admin or admin
    ...(isSuperAdmin
      ? [
          { value: "super_admin", label: "Super Admin" },
          { value: "admin", label: "Admin" },
        ]
      : []),
    { value: "teacher", label: "Teacher" },
    { value: "student", label: "Student" },
    { value: "parent", label: "Parent" },
  ];

  // For role field when need to updating it
  const cantChangeRole =
    !isSuperAdmin &&
    (userToUpdate.role === "super_admin" || userToUpdate.role === "admin");

  function onSubmit(data) {
    console.log(data);

    if (isUpdateSession) {
      updateUser(
        {
          item: {
            name: data.name,
            role: data.role,
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
      createUser(data, {
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
    <Form onSubmit={handleSubmit(onSubmit, onError)} type="modal">
      {/* NAME */}
      <FormRow label="Full Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          placeholder="e.g. John Doe"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
            maxLength: {
              value: 255,
              message: "Name must not exceed 255 characters",
            },
          })}
        />
      </FormRow>

      {/* EMAIL */}
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking || isUpdateSession}
          placeholder="e.g. john@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Please enter a valid email",
            },
          })}
        />
      </FormRow>

      {/* PASSWORD — only on create */}
      {!isUpdateSession && (
        <FormRow label="Password" error={errors?.password?.message}>
          <Input
            type="password"
            id="password"
            disabled={isWorking}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
        </FormRow>
      )}

      {/* ROLE */}
      <FormRow label="Role" error={errors?.role?.message}>
        <SelectForm
          id="role"
          disabled={isWorking || cantChangeRole}
          options={roleOptions}
          {...register("role", { required: "Role is required" })}
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
          {isUpdateSession ? "Update User" : "Add User"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateUserForm;
