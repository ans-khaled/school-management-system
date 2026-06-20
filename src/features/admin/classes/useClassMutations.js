import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create, update, deleteItem } from "../../../services/apiFunctions";
import {
  removeStudent as removeStudentApi,
  assignStudent as assignStudentApi,
  assignSubject as assignSubjectApi,
  removeSubject as removeSubjectApi,
  updateSubjectTeacher as updateSubjectTeacherApi,
  updateSubjectHours as updateSubjectHoursApi,
  assignTeacher as assignTeacherApi,
  removeTeacher as removeTeacherApi,
  updateTeacherRole as updateTeacherRoleApi,
} from "../../../services/apiRelationShips";

function useClassMutations() {
  const queryClient = useQueryClient();
  const inValidate = () => {
    queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    queryClient.invalidateQueries({ queryKey: ["students"] });
    queryClient.invalidateQueries({ queryKey: ["subjects"] });
    queryClient.invalidateQueries({ queryKey: ["teachers"] });
  };

  const { mutate: createClass, isPending: isCreating } = useMutation({
    mutationFn: (newItem) => create({ category: "classrooms", newItem }),

    onSuccess: () => {
      toast.success("Class is created successfully");
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateClass, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, item }) => update({ category: "classrooms", id, item }),

    onSuccess: () => {
      toast.success("Class is updated successfully");
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: deleteClass, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deleteItem({ category: "classrooms", id }),

    onSuccess: () => {
      toast.success("Class is deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },

    onError: (err) => toast.error(err.message),
  });

  // ============ Assign students to classroom
  const { mutate: assignStudent, isPending: isAssigningStudent } = useMutation({
    mutationFn: assignStudentApi,

    onSuccess: () => {
      toast.success("Student is enrolled successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: removeStudent, isPending: isRemovingStudent } = useMutation({
    mutationFn: removeStudentApi,

    onSuccess: () => {
      toast.success("Student is removed successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: assignSubject, isPending: isAssigningSubject } = useMutation({
    mutationFn: assignSubjectApi,

    onSuccess: () => {
      toast.success("Subject is assigned successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: removeSubject, isPending: isRemovingSubject } = useMutation({
    mutationFn: removeSubjectApi,

    onSuccess: () => {
      toast.success("Subject is removed successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateSubjectTeacher, isPending: isUpdatingSubjectTeacher } =
    useMutation({
      mutationFn: updateSubjectTeacherApi,

      onSuccess: () => {
        toast.success("Subject teacher is updated successfully");
        inValidate();
      },

      onError: (err) =>
        toast.error(
          "This Teacher was already choosen, choose another teacher",
          err.message,
        ),
    });

  const { mutate: updateHours, isPending: isUpdatingHours } = useMutation({
    mutationFn: updateSubjectHoursApi, // PATCH /assignments or /subjects/:id/classrooms/:id
    onSuccess: () => {
      toast.success("Weekly hours updated");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: assignTeacher, isPending: isAssigningTeacher } = useMutation({
    mutationFn: assignTeacherApi,

    onSuccess: () => {
      toast.success("Teacher is assigned successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: removeTeacher, isPending: isRemovingTeacher } = useMutation({
    mutationFn: removeTeacherApi,

    onSuccess: () => {
      toast.success("Teacher is removed successfully");
      inValidate();
    },

    onError: (err) => toast.error(err.message),
  });

  const { mutate: updateTeacherRole, isPending: isUpdatingTeacherRole } =
    useMutation({
      mutationFn: updateTeacherRoleApi,

      onSuccess: () => {
        toast.success("Teacher Role is updated successfully");
        inValidate();
      },

      onError: (err) =>
        toast.error(
          "This Teacher role was already choosen, choose another role",
          err.message,
        ),
    });

  return {
    createClass,
    updateClass,
    deleteClass,

    removeStudent,
    assignStudent,
    assignSubject,
    removeSubject,
    updateSubjectTeacher,
    updateHours,
    assignTeacher,
    removeTeacher,
    updateTeacherRole,

    isCreating,
    isUpdating,
    isDeleting,

    isAssigningStudent,
    isRemovingStudent,
    isAssigningSubject,
    isRemovingSubject,
    isUpdatingSubjectTeacher,
    isUpdatingHours,
    isAssigningTeacher,
    isRemovingTeacher,
    isUpdatingTeacherRole,
  };
}

export default useClassMutations;
