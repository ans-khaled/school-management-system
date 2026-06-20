import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../../services/apiFunctions";

export default function useProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-profile"],
    queryFn: () => getItems("student/profile"),

    retry: false,
  });

  return { profileData: data?.data ?? [], isLoading };
}
