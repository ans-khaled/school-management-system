import { useLocation } from "react-router-dom";

function useBackTitle(defaultTitle) {
  const location = useLocation();
  return location.state?.from ?? defaultTitle;
}

export default useBackTitle;
