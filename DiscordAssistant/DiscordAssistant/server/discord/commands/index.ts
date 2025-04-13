import { Client } from 'discord.js';
import { storage } from '../../storage';
import { logError } from '../utils/errorHandler';

// Command interface
export interface Command {
  name: string;
  description: string;
  execute: (message: any, args: string[]) => Promise<void>;
}

// Commands collection
const commands = new Map<string, Command>();

// Import individual command handlers
import { pingCommand } from './ping';
import { helloCommand } from './hello';
import { helpCommand } from './help';
import { playCommand } from './play';
import { stopCommand } from './stop';

// Register default commands
export function registerCommands(client: Client) {
  try {
    // Register built-in commands
    commands.set(pingCommand.name, pingCommand);
    commands.set(helloCommand.name, helloCommand);
    commands.set(helpCommand.name, helpCommand);
    
    // Register music commands
    commands.set(playCommand.name, playCommand);
    commands.set(stopCommand.name, stopCommand);
    
    console.log(`Registered ${commands.size} commands`);
  } catch (error) {
    console.error('Error registering commands:', error);
    logError('Failed to register commands', error);
  }
}

// Get all registered commands
export function getCommands(): Map<string, Command> {
  return commands;
}

// Execute a command by name
export async function executeCommand(commandName: string, message: any, args: string[]): Promise<boolean> {
  try {
    // Check if command exists and is enabled in the database
    const dbCommand = await storage.getCommandByName(commandName);
    
    if (!dbCommand || !dbCommand.enabled) {
      return false;
    }
    
    // Get the command handler
    const command = commands.get(commandName);
    if (!command) {
      return false;
    }
    
    // Execute the command
    await command.execute(message, args);
    return true;
  } catch (error) {
    console.error(`Error executing command "${commandName}":`, error);
    logError(`Command execution failed: ${commandName}`, error);
    return false;
  }
}
