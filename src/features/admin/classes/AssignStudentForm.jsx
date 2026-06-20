import { useForm } from "react-hook-form";
import Form from "../../../ui/Form";
import Input from "../../../ui/Input";
import FormRow from "../../../ui/FormRow";
import Button from "../../../ui/Button";
import useGetItems from "../../../hooks/useGetItems";
import useClassMutations from "./useClassMutations";
import SelectForm from "../../../ui/SelectForm";

function AssignStudentForm({ classroomId, onCloseModal }) {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  function onSubmit(data) {
    const { student_id } = data;

    assignStudent(
      {
        ...data,
        student_id: Number(student_id),
        classroom_id: classroomId,
      },
      {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      },
    );
  }
  function onError() {
    console.log(errors);
  }

  const { items: students, isLoading } = useGetItems("students");
  const { assignStudent, isAssigningStudent } = useClassMutations();

  // const stuNotInClass = students.filter((stu) => stu);
  const studentOptions = [
    { value: "", label: "Select a student..." },
    ...(students?.map((s) => ({
      value: s.id,
      label: s.student_id,
    })) ?? []),
  ];

  return (
    <div className="flex flex-col gap-6 p-2 ">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Enroll Student</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Enroll a student into this classroom
        </p>
      </div>

      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-4"
        type="modal"
      >
        {/* Student */}
        <FormRow label="Student ID" error={errors?.student_id?.message}>
          <SelectForm
            name="student_id"
            options={studentOptions}
            disabled={isLoading || isAssigningStudent}
            {...register("student_id", {
              required: "Student ID is required",
            })}
          />
        </FormRow>

        <FormRow label="Enrolled At" error={errors?.enrolled_at?.message}>
          <Input
            type="date"
            disabled={isAssigningStudent}
            {...register("enrolled_at", {
              required: "Enrolled at date is required",
            })}
          />
        </FormRow>

        {/* Actions */}
        <FormRow>
          <Button
            variation="secondary"
            type="reset"
            disabled={isAssigningStudent}
            onClick={() => onCloseModal?.()}
          >
            Cancel
          </Button>
          <Button disabled={isAssigningStudent}>Assign Student</Button>
        </FormRow>
      </Form>
    </div>
  );
}

export default AssignStudentForm;
