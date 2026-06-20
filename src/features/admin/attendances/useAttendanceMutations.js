import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, update, deleteItem } from "../../../services/apiFunctions";

export default function useAttendanceMutation() {
  const queryClient = useQueryClient();
  const inValidate = () =>
    queryClient.invalidateQueries({ queryKey: ["attendances"] });

  const { mutate: createAttendance, isPending: isCreating } = useMutation({
    mutationFn: (newAttendance) =>
      create({ category: "attendances", newItem: newAttendance }),

    onSuccess: () => {
      toast.success("New attendance successfully created");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateAttendance, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, item }) => update({ category: "attendances", id, item }),

    onSuccess: () => {
      toast.success("Attendance successfully updated");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteAttendance, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteItem({ category: "attendances", id }),

    onSuccess: () => {
      toast.success("Attendance successfully deleted");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    // actions
    createAttendance,
    updateAttendance,
    deleteAttendance,

    // loading states
    isCreating,
    isUpdating,
    isDeleting,
  };
}
