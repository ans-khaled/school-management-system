import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import SelectForm from "../../../ui/SelectForm";
import Button from "../../../ui/Button";
import useTeacherMutations from "./useTeacherMutations";
import { formatDateInISO } from "../../../utils/helpers";

function CreateUpdateTeacherForm({ teacherToUpdate = {}, onCloseModal }) {
  const { id: editId } = teacherToUpdate;
  const isUpdateSession = Boolean(editId);

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: isUpdateSession
      ? {
          ...teacherToUpdate,
          name: teacherToUpdate.user?.name,
          email: teacherToUpdate.user?.email,
          date_of_birth: formatDateInISO(teacherToUpdate.date_of_birth),
          hire_date: formatDateInISO(teacherToUpdate.hire_date),
        }
      : {},
  });

  const { errors } = formState;

  const { createTeacher, isCreating, updateTeacher, isUpdating } =
    useTeacherMutations();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data) {
    console.log(data);

    if (isUpdateSession) {
      const {
        name,
        gender,
        date_of_birth,
        hire_date,
        qualification,
        subject_specialization,
        phone,
        address,
      } = data;

      updateTeacher(
        {
          item: {
            name,
            gender,
            date_of_birth,
            hire_date,
            qualification,
            subject_specialization,
            phone,
            address,
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
      createTeacher(data, {
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
      <FormRow label="Teacher Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "Teacher name is required",
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

      {/* EMAIL */}
      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking || isUpdateSession}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Please enter a valid email",
            },
          })}
        />
      </FormRow>

      {/* PASSWORD */}
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

      {/* TEACHER ID */}
      <FormRow label="Teacher ID" error={errors?.teacher_id?.message}>
        <Input
          type="text"
          id="teacher_id"
          disabled={isWorking || isUpdateSession}
          placeholder="e.g. TCH001"
          {...register("teacher_id", {
            required: "Student ID is required!",
            pattern: {
              value: /^TCH\d+$/i,
              message: "Teacher ID must follow the format TCH001",
            },
          })}
        />
      </FormRow>

      {/* DATE OF BIRTH */}
      <FormRow label="Date of Birth" error={errors?.date_of_birth?.message}>
        <Input
          type="date"
          id="date_of_birth"
          disabled={isWorking}
          max={new Date().toISOString().split("T")[0]}
          {...register("date_of_birth", {
            validate: (value) => {
              if (!value) return true; // optional
              const age =
                new Date().getFullYear() - new Date(value).getFullYear();
              if (age < 3) return "Date of birth seems too recent";
              if (age > 100) return "Enter a valid date of birth";
              return true;
            },
          })}
        />
      </FormRow>

      {/* GENDER */}
      <FormRow label="Gender" error={errors?.gender?.message}>
        <SelectForm
          id="gender"
          disabled={isWorking}
          options={[
            {
              value: "",
              label: "Select gender...",
            },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ]}
          {...register("gender")}
        />
      </FormRow>

      {/* ADDRESS */}
      <FormRow label="Address" error={errors?.address?.message}>
        <Input id="address" disabled={isWorking} {...register("address")} />
      </FormRow>

      {/* PHONE */}
      <FormRow label="Phone" error={errors?.phone?.message}>
        <Input
          type="text"
          id="phone"
          disabled={isWorking}
          {...register("phone", {
            pattern: {
              value: /^\+?[0-9\s-]+$/,
              message: "Please enter a valid phone number",
            },
          })}
        />
      </FormRow>

      {/* HIRE DATE */}
      <FormRow label="Hire Date" error={errors?.hire_date?.message}>
        <Input
          type="date"
          id="hire_date"
          disabled={isWorking}
          {...register("hire_date")}
        />
      </FormRow>

      {/* QUALIFICATION */}
      <FormRow label="Qualification" error={errors?.qualification?.message}>
        <Input
          type="text"
          id="qualification"
          disabled={isWorking}
          {...register("qualification")}
        />
      </FormRow>

      {/* SUBJECT SPECIALIZATION */}
      <FormRow
        label="Subject Specialization"
        error={errors?.subject_specialization?.message}
      >
        <Input
          type="text"
          id="subject_specialization"
          disabled={isWorking}
          {...register("subject_specialization")}
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
          {isUpdateSession ? "Update Teacher" : "Add Teacher"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateTeacherForm;
