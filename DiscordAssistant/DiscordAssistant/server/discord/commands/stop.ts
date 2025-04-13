import { Message } from 'discord.js';
import { Command } from './index';
import { getVoiceConnection } from '@discordjs/voice';
import { logError } from '../utils/errorHandler';

export const stopCommand: Command = {
  name: 'stop',
  description: 'Stops playing music and leaves the voice channel',
  execute: async (message: Message, args: string[]): Promise<void> => {
    try {
      const guildId = message.guild?.id;
      
      if (!guildId) {
        await message.reply('Tento příkaz lze použít pouze na serveru.');
        return;
      }

      // Check if user is in a voice channel
      const member = message.member;
      if (!member || !member.voice.channel) {
        await message.reply('Musíš být v hlasovém kanálu, abys mohl zastavit přehrávání!');
        return;
      }

      // Get the voice connection for this guild
      const connection = getVoiceConnection(guildId);
      
      if (!connection) {
        await message.reply('Nejsem připojen k žádnému hlasovému kanálu!');
        return;
      }

      // Destroy the connection (will also stop playing)
      connection.destroy();
      
      await message.reply('🛑 Přehrávání zastaveno a odpojeno z hlasového kanálu.');
    } catch (error) {
      logError('Error in stop command', error);
      await message.reply('❌ Došlo k chybě při zpracování příkazu!');
    }
  }
};