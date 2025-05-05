import React from "react";

const Button = ({
  type = "button",
  disabled = false,
  isLoading = false,
  loadingText = "Processing...",
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "text-white  w-full py-2 rounded-2xl mt-5  cursor-pointer";
  const gradientClasses = "bg-gradient-to-r from-primary-light to-primary-dark";
  const disabledClasses = "disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${gradientClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default Button;