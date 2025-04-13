import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CodeBlock from "@/components/dashboard/CodeBlock";

const basicBotExample = `const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);`;

const commandHandlerExample = `// Command handler structure
const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(\`[WARNING] The command at \${filePath} is missing a required "data" or "execute" property.\`);
  }
}`;

const environmentSetupExample = `# .env file
DISCORD_BOT_TOKEN=your_bot_token_here
BOT_PREFIX=!`;

const Documentation = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Documentation</h1>
      
      <Tabs defaultValue="getting-started">
        <TabsList className="mb-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Learn how to set up and run your Discord bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Node.js 16.9.0 or higher</li>
                  <li>Discord.js library</li>
                  <li>A Discord account and a bot token</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Creating a Discord Application</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Go to the <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Discord Developer Portal</a></li>
                  <li>Click "New Application" and give it a name</li>
                  <li>Navigate to the "Bot" tab and click "Add Bot"</li>
                  <li>Under the token section, click "Reset Token" to reveal your bot token</li>
                  <li>Store this token securely in your environment variables</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Bot Setup</h3>
                <CodeBlock
                  code={basicBotExample}
                  title="index.js"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Environment Setup</h3>
                <CodeBlock
                  code={environmentSetupExample}
                  title=".env"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Running Your Bot</h3>
                <p className="text-muted-foreground mb-2">After setting up your code and environment variables, you can run your bot with:</p>
                <div className="bg-muted p-2 rounded font-mono text-sm">
                  node index.js
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commands">
          <Card>
            <CardHeader>
              <CardTitle>Commands</CardTitle>
              <CardDescription>
                Learn how to create and handle commands in your Discord bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Command Structure</h3>
                <p className="text-muted-foreground mb-4">
                  Commands are structured as modules that can be loaded by your bot. Each command should export at minimum:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>name:</strong> The name of the command</li>
                  <li><strong>description:</strong> A brief description of what the command does</li>
                  <li><strong>execute:</strong> A function that runs when the command is called</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Command Handler</h3>
                <p className="text-muted-foreground mb-2">
                  A command handler allows you to organize commands into separate files:
                </p>
                <CodeBlock
                  code={commandHandlerExample}
                  title="Command Handler"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Message Command Example</h3>
                <CodeBlock
                  code={`// commands/ping.js
module.exports = {
  name: 'ping',
  description: 'Replies with Pong!',
  execute: async (message, args) => {
    try {
      const sentMessage = await message.reply('Calculating ping...');
      const pingTime = sentMessage.createdTimestamp - message.createdTimestamp;
      
      await sentMessage.edit(\`Pong! 🏓 Latency is \${pingTime}ms\`);
    } catch (error) {
      console.error('Error executing ping command:', error);
      message.reply('There was an error executing the ping command!');
    }
  }
};`}
                  title="commands/ping.js"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                Learn about Discord.js events and how to use them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Common Discord.js Events</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Use Case</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs">ready</TableCell>
                      <TableCell>Emitted when the bot is ready</TableCell>
                      <TableCell>Set bot status and log initialization</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">messageCreate</TableCell>
                      <TableCell>Emitted when a message is sent</TableCell>
                      <TableCell>Process commands from users</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">guildCreate</TableCell>
                      <TableCell>Emitted when bot joins a server</TableCell>
                      <TableCell>Welcome messages and setup</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs">interactionCreate</TableCell>
                      <TableCell>Emitted for slash commands</TableCell>
                      <TableCell>Handle slash command responses</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Event Handler Structure</h3>
                <CodeBlock
                  code={`// Event handler example
const fs = require('fs');
const path = require('path');

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}`}
                  title="Event Handler"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Event Example</h3>
                <CodeBlock
                  code={`// events/ready.js
module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(\`Ready! Logged in as \${client.user.tag}\`);
    
    client.user.setActivity('Serving commands!', { type: 'PLAYING' });
  },
};`}
                  title="events/ready.js"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Learn how to configure your Discord bot and manage its settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Bot Token Configuration</h3>
                <p className="text-muted-foreground mb-2">
                  Your bot token should always be stored in environment variables, never in your code.
                </p>
                <CodeBlock
                  code={`// Loading environment variables
require('dotenv').config();

// Accessing the token
const token = process.env.DISCORD_BOT_TOKEN;

// Login with the token
client.login(token);`}
                  title="Token Usage"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Bot Status and Presence</h3>
                <p className="text-muted-foreground mb-2">
                  You can set your bot's status and activity:
                </p>
                <CodeBlock
                  code={`// Set the bot's status
client.once('ready', () => {
  // Options: 'online', 'idle', 'dnd' (do not disturb), 'invisible'
  client.user.setStatus('online');
  
  // Set the activity
  client.user.setActivity('Serving commands!', { type: 'PLAYING' });
  
  // Activity types: PLAYING, STREAMING, LISTENING, WATCHING, COMPETING
});`}
                  title="Setting Bot Presence"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Prefix Configuration</h3>
                <p className="text-muted-foreground mb-2">
                  Configure and use a command prefix:
                </p>
                <CodeBlock
                  code={`// Store the prefix in a variable or configuration file
const prefix = process.env.BOT_PREFIX || '!';

client.on('messageCreate', message => {
  // Ignore messages without prefix or from bots
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Parse command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  
  // Execute command
  // ...
});`}
                  title="Using a Command Prefix"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
