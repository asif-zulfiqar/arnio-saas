// components/global/CampaignToast.jsx
import React from "react";
import { X, Check } from "lucide-react";
import { toast } from "react-hot-toast"; // Named import

const CampaignToast = ({ t, title, message }) => {
  const handleClose = () => {
    toast.dismiss(t.id);
  };

  return (
    <div className="pointer-events-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-4 max-w-[320px] w-full animate-slide-up">
      <div className="flex items-start justify-between ">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-1">
            <div
              className=" w-9 h-9 rounded-lg flex items-center justify-center p-2 mb-2"
              style={{ backgroundColor: "#F0FDF4" }}
            >
              <Check className="w-5 h-5 text-green-600 stroke-[3]" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 leading-4 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 leading-5">{message}</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CampaignToast;
