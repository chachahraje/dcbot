import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BotConfig } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const configSchema = z.object({
  prefix: z.string().min(1, "Prefix is required"),
  status: z.enum(["online", "idle", "dnd", "invisible"]),
  statusMessage: z.string().min(1, "Status message is required"),
  token: z.boolean().optional(),
});

const Configuration = () => {
  const { toast } = useToast();
  
  const { data: config, isLoading } = useQuery<BotConfig>({
    queryKey: ['/api/bot'],
  });
  
  const form = useForm<z.infer<typeof configSchema>>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      prefix: config?.prefix || "!",
      status: (config?.status as any) || "online",
      statusMessage: config?.statusMessage || "Serving commands!",
      token: false,
    },
  });
  
  // Update form values when data is loaded
  React.useEffect(() => {
    if (config) {
      form.reset({
        prefix: config.prefix,
        status: config.status,
        statusMessage: config.statusMessage,
        token: false,
      });
    }
  }, [config, form]);
  
  const { mutate: updateConfig, isPending: isUpdating } = useMutation({
    mutationFn: async (data: z.infer<typeof configSchema>) => {
      return apiRequest('POST', '/api/bot', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bot'] });
      toast({
        title: "Configuration updated",
        description: "Your bot configuration has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update configuration",
        description: String(error),
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof configSchema>) => {
    updateConfig(data);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bot Configuration</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure your Discord bot token, prefix, and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="token">Bot Token</Label>
                <div className="flex mt-1">
                  <Input
                    id="token"
                    type="password"
                    value="••••••••••••••••••••••••••"
                    className="rounded-r-none"
                    readOnly
                  />
                  <Button
                    type="button"
                    className="rounded-l-none"
                    onClick={() => form.setValue("token", true)}
                  >
                    {config?.token ? "Update" : "Set Token"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {config?.token 
                    ? "Your bot token is stored securely in environment variables"
                    : "Set your bot token in the environment variables (DISCORD_BOT_TOKEN)"}
                </p>
              </div>
              
              <div>
                <Label htmlFor="prefix">Bot Prefix</Label>
                <div className="flex mt-1">
                  <Input
                    id="prefix"
                    {...form.register("prefix")}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  The character users will type before commands, e.g., !help
                </p>
                {form.formState.errors.prefix && (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.prefix.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="status">Bot Status</Label>
                <div className="flex space-x-4 mt-1">
                  <div className="w-1/3">
                    <Select 
                      value={form.watch("status")}
                      onValueChange={(value) => form.setValue("status", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                        <SelectItem value="dnd">Do Not Disturb</SelectItem>
                        <SelectItem value="invisible">Invisible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Input
                      id="statusMessage"
                      placeholder="Status message"
                      {...form.register("statusMessage")}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Status and activity shown in Discord
                </p>
                {form.formState.errors.statusMessage && (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.statusMessage.message}
                  </p>
                )}
              </div>
            </div>
            
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuration;
