import React, { useEffect } from "react";

const SMSNotification = ({ otp, onClose }) => {
  useEffect(() => {
    const audio = new Audio("/sounds/message-ping(2).aac");
    audio.play().catch((err) => console.warn("Audio error:", err));

    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 bg-white shadow-xl border-l-4 border-blue-500 px-5 py-4 rounded-lg z-50 w-[300px] animate-slide-in"
    >
      <div className="text-sm font-semibold">📩 New Message</div>
      <div className="text-sm text-gray-700 mt-1">
        Your OTP is <strong>{otp}</strong>
      </div>
    </div>
  );
};

export default SMSNotification;
