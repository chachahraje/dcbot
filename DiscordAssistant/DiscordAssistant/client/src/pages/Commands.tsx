import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Command } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Commands = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCommand, setNewCommand] = useState({ name: "", description: "", enabled: true });

  const { data: commands = [], isLoading } = useQuery<Command[]>({
    queryKey: ['/api/commands'],
  });

  const { mutate: createCommand, isPending: isCreating } = useMutation({
    mutationFn: async (command: { name: string; description: string; enabled: boolean }) => {
      return apiRequest('POST', '/api/commands', command);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/commands'] });
      setIsDialogOpen(false);
      setNewCommand({ name: "", description: "", enabled: true });
      toast({
        title: "Command created",
        description: "Your command has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create command",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const { mutate: toggleCommand, isPending: isToggling } = useMutation({
    mutationFn: async ({ id, enabled }: { id: number; enabled: boolean }) => {
      return apiRequest('PATCH', `/api/commands/${id}`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/commands'] });
      toast({
        title: "Command updated",
        description: "Command status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update command",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const handleCreateCommand = () => {
    if (!newCommand.name || !newCommand.description) {
      toast({
        title: "Missing information",
        description: "Please provide both name and description for the command.",
        variant: "destructive",
      });
      return;
    }
    
    createCommand(newCommand);
  };

  const handleToggleCommand = (id: number, enabled: boolean) => {
    toggleCommand({ id, enabled: !enabled });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Commands</h1>
          <p className="text-muted-foreground">Manage your Discord bot commands</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Command
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Command</DialogTitle>
              <DialogDescription>
                Create a new command for your Discord bot.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Command Name</Label>
                <Input
                  id="name"
                  placeholder="ping"
                  value={newCommand.name}
                  onChange={(e) => setNewCommand({ ...newCommand, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Replies with Pong!"
                  value={newCommand.description}
                  onChange={(e) => setNewCommand({ ...newCommand, description: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newCommand.enabled}
                  onCheckedChange={(checked) => setNewCommand({ ...newCommand, enabled: checked })}
                />
                <Label htmlFor="enabled">Enabled</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCommand} disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bot Commands</CardTitle>
          <CardDescription>
            Manage commands that users can use with your bot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : commands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No commands found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                You don't have any commands set up yet. Click the "Add Command" button to create your first command.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commands.map((command) => (
                  <TableRow key={command.id}>
                    <TableCell className="font-medium">{command.name}</TableCell>
                    <TableCell>{command.description}</TableCell>
                    <TableCell>
                      {command.enabled ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={command.enabled}
                        onCheckedChange={() => handleToggleCommand(command.id, command.enabled)}
                        disabled={isToggling}
                      />
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

export default Commands;
