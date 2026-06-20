import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../services/apiFunctions";

export default function useStudents() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["students"],
    queryFn: () => getItems("students"),

    retry: false,
  });

  return { isLoading, data, students: data?.data?.data ?? [], error };
}
