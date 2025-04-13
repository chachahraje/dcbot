import { Message } from 'discord.js';
import { Command } from './index';

export const pingCommand: Command = {
  name: 'ping',
  description: 'Replies with Pong!',
  execute: async (message: Message, args: string[]) => {
    const sentMessage = await message.reply('Calculating ping...');
    
    const pingTime = sentMessage.createdTimestamp - message.createdTimestamp;
    
    await sentMessage.edit(`Pong! 🏓 Latency is ${pingTime}ms`);
  }
};
