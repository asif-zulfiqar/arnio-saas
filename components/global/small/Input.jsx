const Input = ({ label, type = "text", ...rest }) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-900">{label}</label>
      <input
        {...rest}
        type={type}
        className={`mt-2 outline-none px-4 h-[42px] border border-gray-300 bg-gray-50 rounded-lg w-full text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary`}
      />
    </div>
  );
};

export default Input;
