import { Check, RefreshCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const PhoneLineStatusPopup = ({ 
  status, 
  phoneNumber, 
  progress, 
  onClose, 
  isVisible 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    if (status === 'PENDING' || status === 'INACTIVE') {
      // Simulate progress animation for pending states
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= 75) return 75; // Cap at 75% for pending
          return prev + Math.random() * 5;
        });
      }, 2000);

      return () => clearInterval(interval);
    } else if (status === 'ACTIVE') {
      // Animate to 100% when active
      setAnimatedProgress(100);
    }
  }, [status]);

  if (!isVisible) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          icon: <Check className="size-4 text-primary" />,
          iconBg: "bg-[#EEF6FF]",
          title: "Phone line activated",
          message: `Your phone line ${phoneNumber || ""} is now active and ready to use.`,
          showProgress: false,
          showClose: true
        };
      case 'PENDING':
      case 'INACTIVE':
      default:
        return {
          icon: <RefreshCcw className="size-4 text-primary animate-spin duration-75" />,
          iconBg: "bg-[#EEF6FF]",
          title: "Activating phone line...",
          message: `Your phone line ${phoneNumber || ""} is being set up. We'll notify you once it's ready.`,
          showProgress: true,
          showClose: true
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-96 p-4 relative">
        {/* Close Button */}
        {config.showClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-9 p-[10px] rounded-lg ${config.iconBg} mb-4`}>
          {config.icon}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {config.message}
        </p>

        {/* Progress Bar */}
        {config.showProgress && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
            <div className="flex justify-end">
              <span className="text-sm text-gray-500">{Math.round(animatedProgress)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneLineStatusPopup;
