import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../../services/apiFunctions";

export default function useDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => getItems("student/dashboard"),

    retry: false,
  });

  return { dashboardData: data?.data ?? [], isLoading };
}
