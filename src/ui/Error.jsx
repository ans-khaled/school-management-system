function Error({ message = "Something went wrong" }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center border border-gray-200">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Error
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>
      </div>
    </div>
  );
}

export default Error;
