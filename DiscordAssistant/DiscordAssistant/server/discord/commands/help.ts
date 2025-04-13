import { Message, EmbedBuilder } from 'discord.js';
import { Command, getCommands } from './index';
import { storage } from '../../storage';
import { getPrefix } from '../bot';

export const helpCommand: Command = {
  name: 'help',
  description: 'Shows available commands',
  execute: async (message: Message, args: string[]) => {
    try {
      const prefix = await getPrefix();
      const registeredCommands = getCommands();
      const dbCommands = await storage.getAllCommands();
      
      // Only include enabled commands
      const enabledCommands = dbCommands.filter(cmd => cmd.enabled);
      
      // Create embed message
      const helpEmbed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('Available Commands')
        .setDescription(`Here are the commands you can use with the prefix \`${prefix}\`:`)
        .setTimestamp();
      
      // Add fields for each command
      enabledCommands.forEach(cmd => {
        const registeredCommand = registeredCommands.get(cmd.name);
        if (registeredCommand) {
          helpEmbed.addFields({
            name: `${prefix}${cmd.name}`,
            value: cmd.description || registeredCommand.description || 'No description available'
          });
        }
      });
      
      await message.reply({ embeds: [helpEmbed] });
    } catch (error) {
      console.error('Error executing help command:', error);
      await message.reply('Sorry, I had trouble generating the help information.');
    }
  }
};
