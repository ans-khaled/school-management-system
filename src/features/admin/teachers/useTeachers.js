import { useQuery } from "@tanstack/react-query";
import { get } from "../../../services/apiFunctions";

export default function useTeachers(category) {
  const { isLoading, data: teachers } = useQuery({
    queryKey: [category],
    queryFn: () => get(category),
  });

  return { isLoading, teachers };
}
