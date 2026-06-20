import useMoveBack from "../hooks/useMoveBack";

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <main className="flex items-center justify-center h-screen bg-gray-50">
      <div className="border-solid border-gray-100 border-2 p-[4.5rem] text-center">
        <h1 className="text-[2rem] font-semibold">
          The page you are looking for could not be found 😢
        </h1>
        <button
          onClick={moveBack}
          size="large"
          className="cursor-pointer text-blue-500 hover:underline mt-3 text-xl"
        >
          &larr; Go back
        </button>
      </div>
    </main>
  );
}

export default PageNotFound;
