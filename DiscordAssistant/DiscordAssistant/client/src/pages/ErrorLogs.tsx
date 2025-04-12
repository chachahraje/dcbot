import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ErrorLog } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle, Trash2, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ErrorLogs = () => {
  const { toast } = useToast();
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);
  
  const { data: logs = [], isLoading } = useQuery<ErrorLog[]>({
    queryKey: ['/api/logs'],
  });
  
  const { mutate: clearLogs, isPending: isClearing } = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', '/api/logs', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/logs'] });
      toast({
        title: "Logs cleared",
        description: "All error logs have been cleared.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to clear logs",
        description: String(error),
        variant: "destructive",
      });
    },
  });
  
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Error Logs</h1>
          <p className="text-muted-foreground">Monitor and troubleshoot your Discord bot</p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading || logs.length === 0 || isClearing}>
              {isClearing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Clear Logs
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Logs?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All error logs will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => clearLogs()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bot Error Logs</CardTitle>
          <CardDescription>
            View and manage error logs from your Discord bot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No error logs</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Your bot is running smoothly! No errors have been recorded.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                    <TableCell className="truncate max-w-md">{log.message}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Error Details</DialogTitle>
                            <DialogDescription>
                              {formatTimestamp(selectedLog?.timestamp || new Date())}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <h3 className="font-medium mb-2">Error Message</h3>
                            <p className="text-sm mb-4">{selectedLog?.message}</p>
                            
                            {selectedLog?.stack && (
                              <>
                                <h3 className="font-medium mb-2">Stack Trace</h3>
                                <ScrollArea className="h-80 w-full rounded-md border p-4">
                                  <pre className="text-xs font-mono whitespace-pre-wrap">
                                    {selectedLog.stack}
                                  </pre>
                                </ScrollArea>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorLogs;
