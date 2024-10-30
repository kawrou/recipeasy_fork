import {
  SuccessIcon,
  FailureIcon,
  WarningIcon,
  CloseIcon,
} from "../Icons/ToastIcons";

import { useState, useEffect } from "react";

const Toast = ({ message, type, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  const iconMap = {
    success: <SuccessIcon />,
    failure: <FailureIcon />,
    warning: <WarningIcon />,
  };

  const toastIcon = iconMap[type] || null;

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const handleCloseToast = () => {
    setIsVisible(false);
  };

  return (
    // Wrapper
    <div
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2
         bg-gray-100 text-black px-8 py-4 rounded-xl shadow-lg max-w-lg 
        transition-all duration-500 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      role="alert"
      aria-label={`notification-${type}`}
    >
      {/* Icon + Message */}
      <div className="inline-flex items-center space-x-2">
        {toastIcon && <div className="">{toastIcon}</div>}
        <p>{message}</p>
      </div>
      {/* Close toast button */}
      <button
        className="absolute top-2 right-2 ml-4"
        aria-label="close-notification"
        onClick={handleCloseToast}
      >
        <span className="icon">
          <CloseIcon />
        </span>
      </button>
    </div>
  );
};

export default Toast;
