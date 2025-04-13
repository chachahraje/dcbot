import { Message } from 'discord.js';
import { Command } from './index';

export const helloCommand: Command = {
  name: 'hello',
  description: 'Greets the user',
  execute: async (message: Message, args: string[]) => {
    const username = message.author.username;
    await message.reply(`Hello ${username}! 👋`);
  }
};
