type ButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "normal";
  startIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function Button({
  text,
  type = "button",
  variant = "primary",
  size = "normal",
  startIcon,
  onClick,
  className = "",
}: ButtonProps) {
  // Variant styles
  const variantClasses = {
    primary: "bg-foreground text-background border border-border-grey",
    secondary: "bg-transparent text-white border border-border",
  };

  // Size styles
  const sizeClasses = {
    small: "px-3 py-1 text-sm rounded-md",
    medium: "px-3 py-2 text-base rounded-lg",
    normal: "px-4 py-3 text-lg rounded-xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 cursor-pointer font-bold 
                  ${variantClasses[variant]} 
                  ${sizeClasses[size]} 
                  ${className}`}
    >
      {startIcon}
      {text}
    </button>
  );
}
