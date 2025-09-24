const Button = ({
  text,
  bgColor,
  color,
  width,
  type = "button",
  cn,
  height,
  ...rest
}) => {
  return (
    <button
      {...rest}
      type={type}
      className={`${
        height ? height : "h-[34px]"
      } p-3 rounded-lg text-xs font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg ${cn} ${
        bgColor ? bgColor : "bg-primary"
      } ${color ? color : "text-white"} ${
        width ? width : "w-full"
      } flex items-center justify-center`}
    >
      {text}
    </button>
  );
};

export default Button;
