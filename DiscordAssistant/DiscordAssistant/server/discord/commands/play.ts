import { Message, TextChannel, DMChannel } from 'discord.js';
import { Command } from './index';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';
import play from 'play-dl';
import { logError } from '../utils/errorHandler';

// Map to store audio players per guild
const audioPlayers = new Map();

export const playCommand: Command = {
  name: 'play',
  description: 'Plays a song from YouTube',
  execute: async (message: Message, args: string[]): Promise<void> => {
    try {
      // Check if there are arguments
      if (!args.length) {
        await message.reply('Potřebuji URL nebo název skladby pro vyhledání!');
        return;
      }

      // Check if user is in a voice channel
      const member = message.member;
      if (!member || !member.voice.channel) {
        await message.reply('Musíš být v hlasovém kanálu, abych ti mohl pustit hudbu!');
        return;
      }

      const voiceChannel = member.voice.channel;
      const guildId = message.guild?.id;

      if (!guildId) {
        await message.reply('Tento příkaz lze použít pouze na serveru.');
        return;
      }

      // Create loading message
      const loadingMsg = await message.reply('🔍 Hledám skladbu...');

      // Search or direct URL
      const query = args.join(' ');
      let songInfo;
      
      try {
        // Check if it's a valid YouTube URL
        if (query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
          songInfo = await play.video_info(query);
        } else {
          // Search for the song on YouTube
          const searchResults = await play.search(query, { limit: 1 });
          if (!searchResults || searchResults.length === 0) {
            await loadingMsg.edit('❌ Nenašel jsem žádnou skladbu!');
            return;
          }
          songInfo = await play.video_info(searchResults[0].url);
        }
      } catch (error) {
        console.error('Error fetching song info:', error);
        await loadingMsg.edit('❌ Nepodařilo se získat informace o skladbě.');
        return;
      }

      if (!songInfo || !songInfo.video_details) {
        await loadingMsg.edit('❌ Nepodařilo se získat informace o skladbě.');
        return;
      }

      // Connect to voice channel
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: message.guild?.voiceAdapterCreator,
      });

      // Create audio player if it doesn't exist for this guild
      if (!audioPlayers.has(guildId)) {
        const player = createAudioPlayer();
        audioPlayers.set(guildId, player);
        
        // Subscribe connection to the player
        connection.subscribe(player);
        
        // Handle connection errors
        connection.on(VoiceConnectionStatus.Disconnected, async () => {
          try {
            await Promise.race([
              new Promise(resolve => connection.on(VoiceConnectionStatus.Ready, resolve)),
              new Promise((_, reject) => setTimeout(reject, 5000))
            ]);
          } catch (error) {
            connection.destroy();
            audioPlayers.delete(guildId);
          }
        });
        
        // Log when audio finishes
        player.on(AudioPlayerStatus.Idle, () => {
          console.log('Song finished playing');
        });
        
        // Handle errors
        player.on('error', error => {
          console.error('Error in audio player:', error);
          // Log the error but don't try to send message to avoid potential type issues
          // We'll rely on console logging instead
          logError('Audio player error', error);
        });
      }

      // Get the player for this guild
      const player = audioPlayers.get(guildId);

      // Get stream
      try {
        const stream = await play.stream(songInfo.video_details.url);
        const resource = createAudioResource(stream.stream, {
          inputType: stream.type,
        });
        
        // Play the song
        player.play(resource);
        
        // Update loading message with song info
        await loadingMsg.edit(`🎵 Přehrávám: **${songInfo.video_details.title}**`);
      } catch (error) {
        console.error('Error creating stream:', error);
        await loadingMsg.edit('❌ Nepodařilo se přehrát skladbu.');
      }
    } catch (error) {
      logError('Error in play command', error);
      await message.reply('❌ Došlo k chybě při zpracování příkazu!');
    }
  }
};