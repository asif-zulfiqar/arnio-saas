const Button = ({
  text,
  bgColor,
  color,
  width,
  type = "button",
  cn,
  ...rest
}) => {
  return (
    <button
      {...rest}
      type={type}
      className={`h-[34px] p-3 rounded-lg text-xs font-medium ${cn} ${
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
