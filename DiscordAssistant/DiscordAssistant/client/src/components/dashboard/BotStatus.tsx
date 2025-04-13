import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BotStatus as BotStatusType } from "@/types";

const BotStatus = () => {
  const { data, isLoading } = useQuery<BotStatusType>({
    queryKey: ['/api/bot/status'],
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bot Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-32 mt-2" />
        </CardContent>
      </Card>
    );
  }

  const formatLastRestartTime = (lastRestart: Date) => {
    const date = new Date(lastRestart);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              data?.isOnline ? "bg-green-500" : "bg-red-500"
            }`} 
          />
          <span className="text-sm font-medium">
            {data?.isOnline ? "Online" : "Offline"}
          </span>
        </div>
        {data?.lastRestart && (
          <div className="text-xs text-muted-foreground mt-2">
            Last restart: {formatLastRestartTime(data.lastRestart)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BotStatus;
