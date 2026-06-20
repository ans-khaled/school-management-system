import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, update, deleteItem } from "../../../services/apiFunctions";

export default function useTeacherMutation() {
  const queryClient = useQueryClient();
  const inValidate = () =>
    queryClient.invalidateQueries({ queryKey: ["teachers"] });

  const createTeacher = useMutation({
    mutationFn: (newTeacher) =>
      create({ category: "teachers", newItem: newTeacher }),

    onSuccess: () => {
      toast.success("New teacher successfully created");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const updateTeacher = useMutation({
    mutationFn: ({ id, item }) => update({ category: "teachers", id, item }),

    onSuccess: () => {
      toast.success("Teacher successfully updated");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const deleteTeacher = useMutation({
    mutationFn: (id) => deleteItem({ category: "teachers", id }),

    onSuccess: () => {
      toast.success("Teacher successfully deleted");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    // actions
    createTeacher: createTeacher.mutate,
    updateTeacher: updateTeacher.mutate,
    deleteTeacher: deleteTeacher.mutate,

    // loading states
    isCreating: createTeacher.isPending ?? createTeacher.isLoading,
    isUpdating: updateTeacher.isPending ?? updateTeacher.isLoading,
    isDeleting: deleteTeacher.isPending ?? deleteTeacher.isLoading,
  };
}
