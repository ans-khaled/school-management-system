import { useEffect, useRef } from "react";

function useOutsideClick(handler, listenCapuring = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) handler();
      }

      document.addEventListener("click", handleClick, listenCapuring);

      return () =>
        document.removeEventListener("click", handleClick, listenCapuring);
    },
    [handler, listenCapuring],
  );

  return ref;
}

export default useOutsideClick;
