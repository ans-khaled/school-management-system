import { useQuery } from "@tanstack/react-query";
import { getItems } from "../services/apiFunctions";

export default function useGetItems(category) {
  const { isLoading, data, error } = useQuery({
    queryKey: [category],
    queryFn: () => getItems(category),

    retry: false,
  });

  console.log(data);

  return { isLoading, items: data?.data?.data ?? data?.data ?? [], error };
}
