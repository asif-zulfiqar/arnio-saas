import { useState } from "react";
import ToggleButton from "../global/small/ToggleButton";
import { set } from "date-fns";

const CiaraAiAgent = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => setIsEnabled(!isEnabled);

  return (
    <div className="flex items-center gap-2 mt-6">
      <ToggleButton isChecked={isEnabled} onToggle={handleToggle} />
      <span className="text-sm font-medium text-gray-800">Ciara AI Agent</span>
    </div>
  );
};

export default CiaraAiAgent;
