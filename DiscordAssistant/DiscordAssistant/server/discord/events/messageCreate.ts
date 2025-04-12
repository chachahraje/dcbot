import { Client, Message } from 'discord.js';
import { executeCommand } from '../commands';
import { getPrefix } from '../bot';
import { logError } from '../utils/errorHandler';

export function registerMessageCreateEvent(client: Client) {
  client.on('messageCreate', async (message: Message) => {
    try {
      // Ignore messages from bots
      if (message.author.bot) return;
      
      // Get the prefix
      const prefix = await getPrefix();
      
      // Check if the message starts with the prefix
      if (!message.content.startsWith(prefix)) return;
      
      // Parse the command name and arguments
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();
      
      if (!commandName) return;
      
      // Try to execute the command
      const success = await executeCommand(commandName, message, args);
      
      if (!success) {
        // Command not found or disabled
        // Uncomment if you want to notify users about unknown commands
        // await message.reply(`Unknown command: ${commandName}. Type ${prefix}help to see available commands.`);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      logError('Message handling failed', error);
    }
  });
}
