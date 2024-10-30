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

  return (
    // Wrapper
    <div
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-100 text-black px-8 py-4 rounded-xl shadow-lg"
      role="alert"
      aria-label={`toast-${type}`}
    >
      {/* Icon + Message */}
      <div className="inline-flex">
        {toastIcon && <div className="">{toastIcon}</div>}
        <p>{message}</p>
      </div>
      {/* Close toast button */}
      <button className="">
        <span className="icon">
          <CloseIcon />
        </span>
      </button>
    </div>
  );
};

export default Toast;
