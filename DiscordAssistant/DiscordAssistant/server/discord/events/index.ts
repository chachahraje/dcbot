import { Client } from 'discord.js';
import { logError } from '../utils/errorHandler';

// Import event handlers
import { registerReadyEvent } from './ready';
import { registerMessageCreateEvent } from './messageCreate';

// Register all events
export function registerEvents(client: Client) {
  try {
    // Register ready event
    registerReadyEvent(client);
    
    // Register messageCreate event
    registerMessageCreateEvent(client);
    
    console.log('Discord events registered successfully');
  } catch (error) {
    console.error('Error registering Discord events:', error);
    logError('Failed to register Discord events', error);
  }
}
