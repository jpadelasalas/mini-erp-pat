const Loading = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-50">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
      </div>
    </div>
  );
};

export default Loading;
