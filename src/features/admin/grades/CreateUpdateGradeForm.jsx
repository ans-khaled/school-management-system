import { useForm, useWatch } from "react-hook-form";
import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import Input from "../../../ui/Input";
import SelectForm from "../../../ui/SelectForm";
import Button from "../../../ui/Button";
import useGradeMutations from "./useGradeMutations";
import useGetItems from "../../../hooks/useGetItems";

function CreateUpdateGradeForm({ gradeToUpdate = {}, onCloseModal }) {
  const { id: editId } = gradeToUpdate;
  const isUpdateSession = Boolean(editId);

  const { register, handleSubmit, formState, reset, control } = useForm({
    defaultValues: isUpdateSession ? { ...gradeToUpdate } : {},
  });

  const { errors } = formState;

  const { createGrade, isCreating, updateGrade, isUpdating } =
    useGradeMutations();
  const isWorking = isCreating || isUpdating;

  // fetch students and exams for dropdowns
  const { isLoading: isLoadingStudents, items: students } =
    useGetItems("students");
  const { isLoading: isLoadingExams, items: exams } = useGetItems("exams");

  // watch the selected exam_id
  const selectedExamId = useWatch({ control, name: "exam_id" });

  // find the max_score of the selected exam
  const selectedExamMaxScore =
    exams.find((e) => e.id === Number(selectedExamId))?.max_score ?? null;

  const studentOptions = [
    { value: "", label: "Select student..." },
    ...students.map((s) => ({
      value: s.id,
      label: `${s.user?.name}`,
    })),
  ];

  const examOptions = [
    { value: "", label: "Select exam..." },
    ...exams.map((e) => ({ value: e.id, label: e.name })),
  ];

  function onSubmit(data) {
    if (isUpdateSession) {
      updateGrade(
        {
          item: {
            student_id: Number(data.student_id),
            exam_id: Number(data.exam_id),
            score: Number(data.score),
            remarks: data.remarks || "",
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
      createGrade(
        {
          student_id: Number(data.student_id),
          exam_id: Number(data.exam_id),
          score: Number(data.score),
          remarks: data.remarks || "",
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

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type="modal">
      {/* STUDENT */}
      <FormRow label="Student" error={errors?.student_id?.message}>
        <SelectForm
          id="student_id"
          options={studentOptions}
          disabled={isWorking || isUpdateSession || isLoadingStudents}
          {...register("student_id", { required: "Student is required" })}
        />
      </FormRow>

      {/* EXAM */}
      <FormRow label="Exam" error={errors?.exam_id?.message}>
        <SelectForm
          id="exam_id"
          options={examOptions}
          disabled={isWorking || isUpdateSession || isLoadingExams}
          {...register("exam_id", { required: "Exam is required" })}
        />
      </FormRow>

      {/* SCORE */}
      <FormRow label="Score" error={errors?.score?.message}>
        <Input
          type="number"
          id="score"
          disabled={isWorking}
          placeholder={
            selectedExamMaxScore
              ? `Max: ${selectedExamMaxScore}`
              : "Select exam first"
          }
          {...register("score", {
            required: "Score is required",
            min: { value: 0, message: "Score cannot be negative" },
            max: selectedExamMaxScore
              ? {
                  value: selectedExamMaxScore,
                  message: `Score cannot exceed max score (${selectedExamMaxScore})`,
                }
              : undefined,
          })}
        />
      </FormRow>

      {/* REMARKS */}
      <FormRow label="Remarks (optional)" error={errors?.remarks?.message}>
        <Input
          type="text"
          id="remarks"
          disabled={isWorking}
          placeholder="e.g. Good performance"
          {...register("remarks", {
            maxLength: {
              value: 255,
              message: "Remarks must not exceed 255 characters",
            },
          })}
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
          {isUpdateSession ? "Update Grade" : "Add Grade"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateUpdateGradeForm;
