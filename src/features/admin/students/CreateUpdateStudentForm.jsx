import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import Input from "../../../ui/Input";
import FormRow from "../../../ui/FormRow";
import Button from "../../../ui/Button";
import useStudentMutation from "./useStudentMutations";
import { formatDateInISO } from "../../../utils/helpers";
import SelectForm from "../../../ui/SelectForm";

function CreateUpdateStudentForm({ studentToUpdate = {}, onCloseModal }) {
  const { id: editId } = studentToUpdate;
  const isUpdateSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isUpdateSession
      ? {
          ...studentToUpdate,
          date_of_birth: formatDateInISO(studentToUpdate.date_of_birth),
          enrollment_date: formatDateInISO(studentToUpdate.enrollment_date),
        }
      : {},
  });
  const { errors } = formState;

  const { isCreating, createStudent, isUpdating, updateStudent } =
    useStudentMutation();

  const isWorking = isCreating || isUpdating;

  function onSubmit(data) {
    if (isUpdateSession) {
      const { name, gender, date_of_birth, phone, address } = data;

      updateStudent(
        {
          newStudentData: {
            name,
            gender,
            date_of_birth,
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
      createStudent(data, {
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
      <FormRow label="Full Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "Full name is required",
            maxLength: {
              value: 255,
              message: "Full name must not exceed 255 characters",
            },
            minLength: {
              value: 2,
              message: "Full name must be at least 2 characters",
            },
          })}
        />
      </FormRow>

      {/* Should be unique */}
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

      {/* Does should me added manually or should added base on exist students ?
      if Manually how to think in it.
      */}
      <FormRow label="Student ID" error={errors?.student_id?.message}>
        <Input
          type="text"
          id="student_id"
          disabled={isWorking || isUpdateSession}
          placeholder="e.g. STU001"
          {...register("student_id", {
            required: "Student ID is required!",
            pattern: {
              value: /^STU\d+$/i,
              message: "Student ID must follow the format STU001",
            },
          })}
        />
      </FormRow>

      {/* Optional, date format */}
      <FormRow label="Date of birth" error={errors?.date_of_birth?.message}>
        <Input
          type="date"
          id="date_of_birth"
          disabled={isWorking}
          // Can't be in the future
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

      {/* Optional */}
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
      <FormRow label="Enrollment Date" error={errors?.enrollment_date?.message}>
        <Input
          type="date"
          id="enrollment_date"
          disabled={isWorking || isUpdateSession}
          {...register("enrollment_date", {
            validate: (value) => {
              if (!value) return true; // optional
              const year = new Date(value).getFullYear();
              if (year < 2000 || year > 2100)
                return "Enter a valid enrollment date";
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isUpdateSession ? "Update Student" : "Add Student"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateStudentForm;
