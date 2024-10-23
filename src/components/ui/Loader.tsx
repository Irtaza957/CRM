const Loader = () => {
  return (
    <div className="fixed left-0 top-0 z-[99999999999999999] flex h-screen w-screen items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex h-11 w-20 items-center justify-center rounded-lg bg-white shadow-lg">
        <div className="flex items-center">
          <div className="shadow-dot mx-1 h-2 w-2 animate-fadeDots rounded-full bg-primary"></div>
          <div
            className="shadow-dot mx-1 h-2 w-2 animate-fadeDots rounded-full bg-secondary"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="shadow-dot mx-1 h-2 w-2 animate-fadeDots rounded-full bg-primary"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
