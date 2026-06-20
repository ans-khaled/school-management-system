import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, update, deleteItem } from "../../../services/apiFunctions";

export default function useExamMutation() {
  const queryClient = useQueryClient();
  const inValidate = () =>
    queryClient.invalidateQueries({ queryKey: ["exams"] });

  const { mutate: createExam, isPending: isCreating } = useMutation({
    mutationFn: (newExam) => create({ category: "exams", newItem: newExam }),

    onSuccess: () => {
      toast.success("New exam successfully created");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateExam, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, item }) => update({ category: "exams", id, item }),

    onSuccess: () => {
      toast.success("Exam successfully updated");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteExam, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteItem({ category: "exams", id }),

    onSuccess: () => {
      toast.success("Exam successfully deleted");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    // actions
    createExam,
    updateExam,
    deleteExam,

    // loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
}
