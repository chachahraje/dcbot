import { Message, TextChannel, DMChannel } from 'discord.js';
import { Command } from './index';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, NoSubscriberBehavior } from '@discordjs/voice';
// Používáme ytdl-core místo play-dl kvůli problémům s limitováním API
import ytdl from 'ytdl-core';
// Stále ponecháváme play-dl pro vyhledávání, ale ne pro stahování
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
      
      // Definujeme typ pro songInfo, abychom se vyhnuli problémům s implicitním 'any'
      let songInfo: any = null;
      let videoUrl = '';
      let videoTitle = '';
      
      try {
        // Check if it's a valid YouTube URL
        if (query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
          console.log('Using direct YouTube URL');
          songInfo = await play.video_info(query);
        } else {
          // Search for the song on YouTube
          console.log(`Searching for: ${query}`);
          const searchResults = await play.search(query, { limit: 1 });
          if (!searchResults || searchResults.length === 0) {
            await loadingMsg.edit('❌ Nenašel jsem žádnou skladbu!');
            return;
          }
          console.log(`Found result: ${searchResults[0].title}`);
          songInfo = await play.video_info(searchResults[0].url);
        }
        
        // Ověříme, že máme všechny potřebné informace
        if (!songInfo || !songInfo.video_details) {
          throw new Error('Chybějící informace o videu');
        }
        
        videoUrl = songInfo.video_details.url;
        videoTitle = songInfo.video_details.title;
        
        console.log(`Video info found: "${videoTitle}" at ${videoUrl}`);
      } catch (error: any) {
        console.error('Error fetching song info:', error);
        await loadingMsg.edit(`❌ Nepodařilo se získat informace o skladbě: ${error.message || 'Neznámá chyba'}`);
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
        // Vytvořit přehrávač s explicitním nastavením chování
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Play, // Pokračovat v přehrávání i bez aktivního posluchače
          }
        });
        audioPlayers.set(guildId, player);
        
        // Připojit přehrávač ke spojení
        const subscription = connection.subscribe(player);
        if (!subscription) {
          console.error('Failed to subscribe to the audio player');
          await loadingMsg.edit('❌ Nepodařilo se připojit audio přehrávač.');
          return;
        }
        
        console.log('Successfully subscribed to the audio player');
        
        // Handle connection errors
        connection.on(VoiceConnectionStatus.Disconnected, async () => {
          console.log('Voice connection disconnected');
          try {
            // Try to reconnect
            await Promise.race([
              new Promise(resolve => connection.on(VoiceConnectionStatus.Ready, resolve)),
              new Promise((_, reject) => setTimeout(() => {
                console.log('Connection reconnect timeout');
                reject(new Error('Connection reconnect timeout'));
              }, 5000))
            ]);
            console.log('Connection successfully reconnected');
          } catch (error) {
            console.error('Failed to reconnect, destroying connection:', error);
            connection.destroy();
            audioPlayers.delete(guildId);
          }
        });
        
        // Handle ready state
        connection.on(VoiceConnectionStatus.Ready, () => {
          console.log('Voice connection is ready!');
        });
        
        // Log when audio finishes
        player.on(AudioPlayerStatus.Idle, () => {
          console.log('Song finished playing');
        });
        
        // Logování přehrávaného stavu
        player.on(AudioPlayerStatus.Playing, () => {
          console.log('Audio player is now playing!');
        });
        
        // Logování ostatních stavů
        player.on(AudioPlayerStatus.Paused, () => {
          console.log('Audio player is paused.');
        });
        
        player.on(AudioPlayerStatus.AutoPaused, () => {
          console.log('Audio player is auto-paused.');
        });
        
        // Handle errors
        player.on('error', error => {
          console.error('Error in audio player:', error);
          // Log the error to help with debugging
          logError('Audio player error', error);
        });
      }

      // Get the player for this guild
      const player = audioPlayers.get(guildId);

      try {
        // Použijeme ytdl-core pro přímé získání streamu, abychom se vyhnuli omezením API
        console.log(`Creating audio stream for: ${songInfo.video_details.title}`);
        
        // Získání URL videa
        const videoUrl = songInfo.video_details.url;
        console.log(`Using video URL: ${videoUrl}`);
        
        // Vytvoření streamu pomocí ytdl-core
        const stream = ytdl(videoUrl, { 
          filter: 'audioonly',  // Pouze audio
          quality: 'highestaudio', // Nejvyšší kvalita audia
          highWaterMark: 1 << 25, // Zvýšený buffer pro plynulé přehrávání
        });
        
        console.log("Stream created using ytdl-core");
        
        // Vytvoření audio zdroje
        const resource = createAudioResource(stream, {
          // Použití inline úpravy hlasitosti
          inlineVolume: true
        });
        
        console.log("Audio resource created, playing now...");
        
        // Přehrání skladby
        player.play(resource);
        
        // Aktualizace zprávy s informacemi o skladbě
        await loadingMsg.edit(`🎵 Přehrávám: **${songInfo.video_details.title}**`);
      } catch (error: any) {
        console.error('Error creating stream:', error);
        
        // Pokud selže přehrávání, informujeme uživatele
        await loadingMsg.edit(`❌ Nepodařilo se přehrát skladbu: ${error.message || 'Neznámá chyba'}`);
      }
    } catch (error) {
      logError('Error in play command', error);
      await message.reply('❌ Došlo k chybě při zpracování příkazu!');
    }
  }
};