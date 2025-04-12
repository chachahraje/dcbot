import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
  iconColor?: string;
  iconBgColor?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  linkText,
  linkHref,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/20",
}) => {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{title}</h3>
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", iconBgColor)}>
            {React.cloneElement(icon as React.ReactElement, { className: cn("h-5 w-5", iconColor) })}
          </div>
        </div>
        <p className="text-sm mb-4 text-muted-foreground">{description}</p>
        <Link href={linkHref}>
          <a className="text-primary hover:underline text-sm flex items-center">
            <span>{linkText}</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ActionCard;
