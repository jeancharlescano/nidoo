const Button = ({
  buttonText,
  disabled,
}: {
  buttonText: string;
  disabled?: boolean;
}) => {
  return (
    <button
      type="submit"
      className="bg-[#4F8A69] text-white py-3 w-full rounded-xl text-md font-semibold mb-2 cursor-pointer"
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
};

export default Button;
