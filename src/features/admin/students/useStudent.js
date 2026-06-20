import { useQuery } from "@tanstack/react-query";
import { getItem } from "../../../services/apiFunctions";
import { useParams } from "react-router-dom";

export default function useStudent() {
  const { id } = useParams();

  const { isLoading, data, error } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getItem({ category: "students", id }),

    retry: false,
    // Don't make request untill id exist.
    enabled: !!id,
  });

  return { isLoading, student: data?.data, error };
}
