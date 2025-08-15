const ToggleButton = ({ isChecked, onToggle }) => {
  return (
    <div
      className="relative inline-flex items-center cursor-pointer"
      onClick={onToggle}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => {}}
        className="sr-only"
      />
      <div
        className={`block w-10 h-5 rounded-full relative ${
          isChecked ? "bg-primary" : "bg-gray-200"
        }`}
      >
        <div
          className={`dot absolute top-[2px] left-[2px] size-4 rounded-full transition-all bg-white ${
            isChecked ? "transform translate-x-5" : ""
          }`}
          style={{ transition: "all 0.3s" }}
        ></div>
      </div>
    </div>
  );
};

export default ToggleButton;
