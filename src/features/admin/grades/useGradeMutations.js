import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, update, deleteItem } from "../../../services/apiFunctions";

export default function useGradeMutation() {
  const queryClient = useQueryClient();
  const inValidate = () =>
    queryClient.invalidateQueries({ queryKey: ["grades"] });

  const { mutate: createGrade, isPending: isCreating } = useMutation({
    mutationFn: (newGrade) => create({ category: "grades", newItem: newGrade }),

    onSuccess: () => {
      toast.success("New Grade successfully created");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateGrade, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, item }) => update({ category: "grades", id, item }),

    onSuccess: () => {
      toast.success("Grade successfully updated");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteGrade, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteItem({ category: "grades", id }),

    onSuccess: () => {
      toast.success("Grade successfully deleted");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    // actions
    createGrade,
    updateGrade,
    deleteGrade,

    // loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
}
