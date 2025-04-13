import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Code, 
  Settings, 
  AlertTriangle, 
  HelpCircle, 
  Bot, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { NavItem } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: "Home" },
  { path: "/commands", label: "Commands", icon: "Code" },
  { path: "/configuration", label: "Configuration", icon: "Settings" },
  { path: "/logs", label: "Error Logs", icon: "AlertTriangle" },
  { path: "/docs", label: "Documentation", icon: "HelpCircle" },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  const isMobile = useMobile();

  const { data: botStatus } = useQuery({
    queryKey: ['/api/bot/status'],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Get formatted time for last restart
  const getLastRestartTime = () => {
    if (!botStatus?.lastRestart) return "Unknown";
    
    const lastRestart = new Date(botStatus.lastRestart);
    const now = new Date();
    const diffMs = now.getTime() - lastRestart.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    
    if (diffHrs > 0) {
      return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Home": return <Home className="h-5 w-5" />;
      case "Code": return <Code className="h-5 w-5" />;
      case "Settings": return <Settings className="h-5 w-5" />;
      case "AlertTriangle": return <AlertTriangle className="h-5 w-5" />;
      case "HelpCircle": return <HelpCircle className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  // If mobile and sidebar is closed, don't render
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <div 
      className={cn(
        "w-full md:w-64 bg-card flex-shrink-0 border-r z-50",
        isMobile && "fixed inset-0 w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-bold">Bot Template</h1>
          </div>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a 
                    className={cn(
                      "flex items-center px-4 py-2 rounded",
                      location === item.path 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    )}
                  >
                    {getIconComponent(item.icon)}
                    <span className="ml-3">{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bot Status */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <div 
              className={cn(
                "w-3 h-3 rounded-full",
                botStatus?.isOnline ? "bg-green-500" : "bg-red-500"
              )}
            ></div>
            <span className="text-sm">
              {botStatus?.isOnline ? "Bot Online" : "Bot Offline"}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Last restart: {getLastRestartTime()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
