function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <input
        {...props}
        className="w-87.5 rounded-sm bg-white px-2 py-2 text-xs text-[#32343E] outline-none"
      />
    </>
  );
}
export default Input;
