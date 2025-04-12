import { Client, GatewayIntentBits, ActivityType, PresenceStatusData } from 'discord.js';
import { storage } from '../storage';
import { registerCommands } from './commands';
import { registerEvents } from './events';
import { logError } from './utils/errorHandler';

// Create a Discord.js client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let isInitialized = false;
let lastRestartTime = new Date();

// Initialize the bot
export async function initializeBot() {
  if (isInitialized) {
    return;
  }
  
  try {
    // Register events
    registerEvents(client);
    
    // Register commands
    registerCommands(client);
    
    // Load config from storage
    const config = await storage.getBotConfig();

    // Use token from environment variable or storage
    const token = process.env.DISCORD_BOT_TOKEN || config?.token;
    
    if (!token) {
      console.log('No Discord bot token found. Bot will not start.');
      return;
    }

    // Login to Discord with the token
    await client.login(token);
    
    // Update bot status
    if (config) {
      updateBotStatus(config.status as PresenceStatusData, config.statusMessage);
    }
    
    isInitialized = true;
    lastRestartTime = new Date();
    console.log('Discord bot initialized successfully');
  } catch (error) {
    console.error('Error initializing Discord bot:', error);
    logError('Bot initialization failed', error);
    throw error;
  }
}

// Update bot status and activity
export function updateBotStatus(status: PresenceStatusData, statusMessage: string) {
  if (!client || !client.user) {
    return false;
  }
  
  try {
    client.user.setPresence({
      status,
      activities: [{
        name: statusMessage,
        type: ActivityType.Playing
      }]
    });
    
    return true;
  } catch (error) {
    console.error('Error updating bot status:', error);
    logError('Failed to update bot status', error);
    return false;
  }
}

// Restart the bot
export async function restartBot() {
  try {
    if (client) {
      // Destroy the current client instance
      await client.destroy();
    }
    
    // Reset initialization state
    isInitialized = false;
    
    // Re-initialize the bot
    await initializeBot();
    
    return true;
  } catch (error) {
    console.error('Error restarting bot:', error);
    logError('Bot restart failed', error);
    return false;
  }
}

// Check if the bot is ready
export function isBotReady(): boolean {
  return isInitialized && client.isReady();
}

// Get the bot client instance
export function getClient(): Client {
  return client;
}

// Get the last restart time
export function getLastRestartTime(): Date {
  return lastRestartTime;
}

// Export the prefix getter
export async function getPrefix(): Promise<string> {
  const config = await storage.getBotConfig();
  return config?.prefix || '!';
}
