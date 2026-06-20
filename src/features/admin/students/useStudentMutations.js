import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create } from "../../../services/apiFunctions";
import { update } from "../../../services/apiFunctions";
import { deleteItem } from "../../../services/apiFunctions";

export default function useStudentMutation() {
  const queryClient = useQueryClient();

  const inValidate = () =>
    queryClient.invalidateQueries({ queryKey: ["students"] });

  const { mutate: createStudent, isPending: isCreating } = useMutation({
    mutationFn: (newStudent) =>
      create({ category: "students", newItem: newStudent }),
    onSuccess: () => {
      toast.success("Student created successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateStudent, isPending: isUpdating } = useMutation({
    mutationFn: ({ newStudentData, id }) =>
      update({ category: "students", id, item: newStudentData }),
    onSuccess: () => {
      toast.success("Student updated successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteStudent, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteItem({ category: "students", id }),
    onSuccess: () => {
      toast.success("Student deleted successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    // actions
    createStudent,
    updateStudent,
    deleteStudent,

    // loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
}
