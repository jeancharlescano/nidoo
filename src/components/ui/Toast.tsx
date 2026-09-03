type ToastProps = {
  message: string;
  show: boolean;
};

const Toast = ({ message, show }: ToastProps) => {
  return (
    <div
      className={`
        fixed top-6 left-1/2 z-50
        -translate-x-1/2
        rounded-xl bg-[#4F8A69]/20
        px-5 py-3
        text-sm font-semibold text-white
        transition-all duration-300 ease-out
        ${
          show
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0 pointer-events-none"
        }
      `}
    >
      {message}
    </div>
  );
};

export default Toast;
