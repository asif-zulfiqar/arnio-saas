import React, { forwardRef } from 'react';

const WorkspaceHandleInput = forwardRef(({ 
  label, 
  placeholder, 
  error, 
  value, 
  onChange, 
  onBlur, 
  name,
  ...props 
}, ref) => {
  const PREFIX = "dashboard.arnio.co/";
  
  // Extract the handle part (everything after the prefix)
  const handleValue = value ? value.replace(PREFIX, "") : "";
  
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    // Only allow alphanumeric characters, hyphens, and underscores
    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\-_]/g, '');
    const fullValue = PREFIX + sanitizedValue;
    onChange({
      target: {
        name: name,
        value: fullValue
      }
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">
            {PREFIX}
          </span>
        </div>
        <input
          ref={ref}
          type="text"
          value={handleValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          name={name}
          placeholder="my-workspace"
          className={`w-full pl-[140px] pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

WorkspaceHandleInput.displayName = 'WorkspaceHandleInput';

export default WorkspaceHandleInput;
