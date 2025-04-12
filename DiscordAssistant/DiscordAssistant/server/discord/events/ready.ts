import { Client } from 'discord.js';
import { storage } from '../../storage';

export function registerReadyEvent(client: Client) {
  client.once('ready', async () => {
    if (!client.user) {
      console.error('Client user is not defined');
      return;
    }
    
    console.log(`Logged in as ${client.user.tag}!`);
    
    try {
      // Get the bot configuration
      const config = await storage.getBotConfig();
      
      if (config) {
        // Set the activity status
        client.user.setActivity(config.statusMessage, { type: 0 });
      } else {
        // Set default activity
        client.user.setActivity('Serving commands!', { type: 0 });
      }
      
      console.log('Bot is ready and status is set!');
    } catch (error) {
      console.error('Error in ready event:', error);
    }
  });
}
