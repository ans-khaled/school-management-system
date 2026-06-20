import { useSearchParams } from "react-router-dom";

function useFilterAttendances(searchedAttendances) {
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status") || "all";

  console.log(searchedAttendances);
  let filtered = [...searchedAttendances];

  if (status !== "all") filtered = filtered.filter((a) => a.status === status);

  return filtered;
}

export default useFilterAttendances;
