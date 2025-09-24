import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      error,
      icon,
      className = "",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const getInputStyles = () => {
      let baseStyles =
        "outline-none px-4 h-[42px] border rounded-lg w-full text-sm transition-all duration-200 ";

      // Add padding for icons
      if (icon) {
        baseStyles += "pl-9 ";
      }
      if (isPassword) {
        baseStyles += "pr-10 ";
      }

      // State-based styling
      if (error) {
        return (
          baseStyles +
          "border-red-300 bg-red-50 text-red-900 placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
        );
      } else if (disabled) {
        return (
          baseStyles +
          "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed placeholder:text-gray-400"
        );
      } else if (isFocused) {
        return (
          baseStyles +
          "border-primary bg-white text-gray-900 placeholder:text-gray-400 ring-1 ring-primary"
        );
      } else {
        return (
          baseStyles +
          "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white"
        );
      }
    };

    return (
      <div className={className}>
        {label && (
          <label className="text-sm font-medium text-gray-900 block mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className={`${error ? "text-red-400" : "text-gray-500"}`}>
                {icon}
              </div>
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className={getInputStyles()}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff
                  className={`h-4 w-4 ${
                    error ? "text-red-400" : "text-gray-500"
                  } hover:text-gray-600`}
                />
              ) : (
                <Eye
                  className={`h-4 w-4 ${
                    error ? "text-red-400" : "text-gray-500"
                  } hover:text-gray-600`}
                />
              )}
            </button>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
