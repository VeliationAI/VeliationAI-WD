import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomButtonProps extends ButtonProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const Button = ({ 
  href, 
  className, 
  children, 
  ...props 
}: CustomButtonProps) => {
  // If href is provided, render as an anchor tag
  if (href) {
    return (
      <ShadcnButton 
        className={cn("font-medium", className)} 
        asChild 
        {...props}
      >
        <a href={href}>{children}</a>
      </ShadcnButton>
    );
  }

  // Otherwise, render as a regular button
  return (
    <ShadcnButton 
      className={cn("font-medium", className)} 
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
