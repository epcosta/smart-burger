type buttonType = {
  title: string;
  variant?: "default" | "outline" | "opacity";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ title, variant = "default", ...props }: buttonType) {
  const buttonVariant = () => {
    if (variant === "default") {
      return "w-full cursor-pointer rounded-sm border-2 border-[#C92A0E] bg-[#C92A0E] py-2 text-xs font-bold text-white";
    } else if (variant === "outline") {
      return "w-full cursor-pointer rounded-sm border-2 border-[#C92A0E] bg-white py-2 text-xs font-bold text-[#C92A0E]";
    } else if (variant === "opacity") {
      return "w-full cursor-not-allowed rounded-sm border-2 border-[#C92A0E] bg-[#C92A0E] py-2 text-xs font-bold text-white opacity-35 ";
    }
  };
  return (
    <>
      <button {...props} className={buttonVariant()}>
        {title}
      </button>
    </>
  );
}
export default Button;
