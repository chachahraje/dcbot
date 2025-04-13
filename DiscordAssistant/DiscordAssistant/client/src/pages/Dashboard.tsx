import { Key, Code, ClipboardList } from "lucide-react";
import ActionCard from "@/components/dashboard/ActionCard";
import { useQuery } from "@tanstack/react-query";
import CodeBlock from "@/components/dashboard/CodeBlock";

const exampleCommandsCode = `// Basic command handling example
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Environment variables for token
require('dotenv').config();

// Bot prefix
const prefix = '!';

client.once('ready', () => {
  console.log(\`Logged in as \${client.user.tag}!\`);
  client.user.setActivity('Serving commands!');
});

client.on('messageCreate', message => {
  // Ignore messages without prefix or from bots
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Parse command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Command handler
  try {
    if (command === 'ping') {
      message.reply('Pong! 🏓');
    } else if (command === 'hello') {
      message.reply(\`Hello \${message.author.username}!\`);
    } else if (command === 'help') {
      message.reply('Available commands: !ping, !hello, !help');
    }
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!');
  }
});

// Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);`;

const tryCatchExample = `try {
  // Command execution code
} catch (error) {
  console.error(error);
  message.reply('An error occurred!');
}`;

const errorLoggingExample = `const fs = require('fs');

function logError(error) {
  const timestamp = new Date().toISOString();
  const logMessage = \`[\${timestamp}] \${error.stack}\\n\`;
  
  fs.appendFile('error.log', logMessage, (err) => {
    if (err) console.error('Failed to log error:', err);
  });
}`;

const Dashboard = () => {
  const { data: botConfig } = useQuery({
    queryKey: ['/api/bot'],
  });

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome to your Discord Bot Template</h1>
        <p className="text-muted-foreground">
          This is a basic template to help you get started with creating your Discord bot.
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ActionCard
          title="Setup Bot Token"
          description="Configure your Discord bot token in the environment variables."
          icon={<Key />}
          linkText="Configure Token"
          linkHref="/configuration"
          iconColor="text-blue-500"
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
        />
        
        <ActionCard
          title="Create Commands"
          description="Add new commands and functionality to your Discord bot."
          icon={<Code />}
          linkText="Add Commands"
          linkHref="/commands"
          iconColor="text-green-500"
          iconBgColor="bg-green-100 dark:bg-green-900/20"
        />
        
        <ActionCard
          title="View Logs"
          description="Check error logs and debug information for your bot."
          icon={<ClipboardList />}
          linkText="View Logs"
          linkHref="/logs"
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
        />
      </div>
      
      {/* Command Example Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Example Commands</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Here are some basic commands to get you started with your Discord bot.
        </p>
        
        <CodeBlock 
          code={exampleCommandsCode} 
          title="Basic Command Handler" 
        />
      </div>
      
      {/* Error Handling Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Error Handling</h2>
        <p className="text-sm mb-6 text-muted-foreground">
          Effective error handling will help you diagnose and fix issues with your bot.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Try-Catch Blocks</h3>
            <p className="text-sm mb-2 text-muted-foreground">
              Wrap your command execution code in try-catch blocks:
            </p>
            <CodeBlock code={tryCatchExample} />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Error Logging</h3>
            <p className="text-sm mb-2 text-muted-foreground">
              Log errors to a file for better debugging:
            </p>
            <CodeBlock code={errorLoggingExample} />
          </div>
        </div>
      </div>
      
      {/* Next Steps */}
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Next Steps</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
              <span className="text-primary-foreground text-xs">1</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Configure your .env file</h3>
              <p className="text-sm text-muted-foreground">
                Create a .env file with your Discord bot token
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
              <span className="text-primary-foreground text-xs">2</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Install dependencies</h3>
              <p className="text-sm text-muted-foreground">
                Run <code className="bg-muted px-1 py-0.5 rounded">npm install discord.js dotenv</code> to install required packages
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
              <span className="text-primary-foreground text-xs">3</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Run your bot</h3>
              <p className="text-sm text-muted-foreground">
                Start your bot with <code className="bg-muted px-1 py-0.5 rounded">node index.js</code>
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
              <span className="text-primary-foreground text-xs">4</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Add more commands</h3>
              <p className="text-sm text-muted-foreground">
                Expand your bot's functionality with additional commands
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
