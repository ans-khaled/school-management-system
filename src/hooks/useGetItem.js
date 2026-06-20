import { useQuery } from "@tanstack/react-query";
import { getItem } from "../services/apiFunctions";
import { useParams } from "react-router-dom";

export default function useGetItem(category) {
  const { id } = useParams();

  const { isLoading, data, error } = useQuery({
    queryKey: [category, id],
    queryFn: () => getItem({ category, id }),

    retry: false,
    enabled: !!id,
  });

  return { isLoading, item: data?.data ?? {}, error };
}
