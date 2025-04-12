import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, RefreshCw, User, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { toast } = useToast();
  const isMobile = useMobile();

  const { data: botStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ['/api/bot/status'],
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { mutate: restartBot, isPending: isRestarting } = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/bot/restart', {});
    },
    onSuccess: () => {
      toast({
        title: "Bot is restarting",
        description: "The bot will be back online shortly."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to restart bot",
        description: String(error),
        variant: "destructive"
      });
    }
  });

  return (
    <header className="bg-card p-4 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold">Discord Bot Template</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => restartBot()}
            disabled={isRestarting || isStatusLoading || !botStatus?.isOnline}
          >
            {isRestarting ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Restart Bot
          </Button>
          
          <div className="rounded-full w-8 h-8 bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
