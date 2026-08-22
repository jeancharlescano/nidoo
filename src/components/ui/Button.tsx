const Button = ({ buttonText }: { buttonText: string }) => {
  return (
    <button
      type="submit"
      className="bg-[#4F8A69] text-white py-3 w-full rounded-xl text-md font-semibold mb-2 cursor-pointer"
    >
      {buttonText}
    </button>
  );
};

export default Button;
