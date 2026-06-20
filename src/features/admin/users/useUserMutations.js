import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, update, deleteItem } from "../../../services/apiFunctions";

export default function useUserMutation() {
  const queryClient = useQueryClient();

  const inValidate = () =>
    queryClient.invalidateQueries({ queryKey: ["users"] });

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: (newUser) => create({ category: "users", newItem: newUser }),
    onSuccess: () => {
      toast.success("User created successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ item, id }) => update({ category: "users", id, item }),
    onSuccess: () => {
      toast.success("User updated successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteItem({ category: "users", id }),
    onSuccess: () => {
      toast.success("User deleted successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    // actions
    createUser,
    updateUser,
    deleteUser,

    // loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
}
