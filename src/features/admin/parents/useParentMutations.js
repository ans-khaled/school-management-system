import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create } from "../../../services/apiFunctions";
import { update } from "../../../services/apiFunctions";
import { deleteItem } from "../../../services/apiFunctions";

export default function useParentMutations() {
  const queryClient = useQueryClient();

  const inValidate = () =>
    queryClient.invalidateQueries({ queryKey: ["parents"] });

  const { mutate: createParent, isPending: isCreating } = useMutation({
    mutationFn: (newParent) =>
      create({ category: "parents", newItem: newParent }),
    onSuccess: () => {
      toast.success("Parent created successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateParent, isPending: isUpdating } = useMutation({
    mutationFn: ({ newParentData, id }) =>
      update({ category: "parents", id, item: newParentData }),
    onSuccess: () => {
      toast.success("Parent updated successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteParent, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteItem({ category: "parents", id }),
    onSuccess: () => {
      toast.success("Parent deleted successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    // actions
    createParent,
    updateParent,
    deleteParent,

    // loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
}
