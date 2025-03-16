
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  className,
  iconClassName,
}) => {
  return (
    <div className={cn(
      "glass-card p-6 transition-all duration-300 hover:shadow-xl",
      className
    )}>
      <div className={cn(
        "w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4",
        iconClassName
      )}>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
