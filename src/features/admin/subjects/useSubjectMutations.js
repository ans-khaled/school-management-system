import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create } from "../../../services/apiFunctions";
import { update } from "../../../services/apiFunctions";
import { deleteItem } from "../../../services/apiFunctions";

export default function useSubjectMutations() {
  const queryClient = useQueryClient();
  const inValidate = () =>
    queryClient.invalidateQueries({ queryKey: "subjects" });

  const { mutate: createSubject, isPending: isCreating } = useMutation({
    mutationFn: (newSubject) =>
      create({ category: "subjects", newItem: newSubject }),
    onSuccess: () => {
      toast.success("Subject created successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateSubject, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, newSubjectData }) =>
      update({ category: "subjects", id, item: newSubjectData }),
    onSuccess: () => {
      toast.success("Subject updated successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteSubject, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteItem({ category: "subjects", id }),
    onSuccess: () => {
      toast.success("Subject deleted successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    createSubject,
    updateSubject,
    deleteSubject,

    isCreating,
    isUpdating,
    isDeleting,
  };
}
