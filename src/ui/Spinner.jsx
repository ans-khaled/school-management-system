// import styled, { keyframes } from "styled-components";

function Spinner() {
  return (
    <div className="flex justify-center my-20">
      <div
        className="w-15 aspect-square rounded-full animate-spin"
        style={{
          background: `
        radial-gradient(farthest-side, #3b82f6 94%, transparent) top/10px 10px no-repeat,
        conic-gradient(transparent 30%, #3b82f6)
      `,
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 10px), black 0)",
        }}
      />
    </div>
  );
}

export default Spinner;

/* export default Spinner; */
