const Loading = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-paper">
      <div className="flex gap-2">
        <div className="size-2.5 animate-bounce rounded-full bg-ink"></div>
        <div className="size-2.5 animate-bounce rounded-full bg-ink [animation-delay:-0.2s]"></div>
        <div className="size-2.5 animate-bounce rounded-full bg-accent outline outline-ink [animation-delay:-0.4s]"></div>
      </div>
    </div>
  );
};

export default Loading;
