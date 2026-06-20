import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, update, deleteItem } from "../../../services/apiFunctions";

export default function useScheduleMutation() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["schedules"] });

  const { mutate: createSchedule, isPending: isCreating } = useMutation({
    mutationFn: (newSchedule) =>
      create({
        category: "schedules",
        newItem: newSchedule,
      }),

    onSuccess: () => {
      toast.success("New schedule successfully created");
      invalidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateSchedule, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, item }) =>
      update({
        category: "schedules",
        id,
        item,
      }),

    onSuccess: () => {
      toast.success("Schedule successfully updated");
      invalidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteSchedule, isPending: isDeleting } = useMutation({
    mutationFn: (id) =>
      deleteItem({
        category: "schedules",
        id,
      }),

    onSuccess: () => {
      toast.success("Schedule successfully deleted");
      invalidate();
    },

    onError: (err) => toast.error(err.message),
  });

  return {
    createSchedule,
    updateSchedule,
    deleteSchedule,

    isCreating,
    isUpdating,
    isDeleting,
  };
}
