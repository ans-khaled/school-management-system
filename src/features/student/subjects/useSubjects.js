import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../../services/apiFunctions";

export default function useSubjects() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-subjects"],
    queryFn: () => getItems("student/subjects"),

    retry: false,
  });

  return { subjectsData: data?.data ?? [], isLoading };
}
