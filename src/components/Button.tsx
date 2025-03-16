
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  className,
  href,
  external,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = "font-medium rounded-full inline-flex items-center justify-center transition-all duration-200 transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-primary/20 active:translate-y-0";
  
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "bg-transparent hover:bg-primary/5 text-foreground",
  };
  
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "px-5 py-2.5",
    lg: "text-lg px-7 py-3.5",
  };
  
  const buttonClasses = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
  
  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
        >
          {children}
        </a>
      );
    }
    return (
      <Link to={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
