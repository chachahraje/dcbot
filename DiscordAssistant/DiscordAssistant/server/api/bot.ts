import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { insertBotConfigSchema } from '@shared/schema';

const router = Router();

// Get bot configuration
router.get('/', async (req, res) => {
  try {
    const config = await storage.getBotConfig();
    
    if (!config) {
      return res.json({
        token: process.env.DISCORD_BOT_TOKEN ? '••••••••••••••••••••••••••' : '',
        prefix: '!',
        status: 'online',
        statusMessage: 'Serving commands!'
      });
    }
    
    // Don't send the actual token, just indicate if it exists
    const response = {
      ...config,
      token: config.token ? '••••••••••••••••••••••••••' : ''
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting bot config:', error);
    res.status(500).json({ message: 'Failed to get bot configuration' });
  }
});

// Update bot configuration
router.post('/', async (req, res) => {
  try {
    const configData = insertBotConfigSchema.parse(req.body);
    
    // If token is being set, use environment variable
    if (req.body.token === true) {
      configData.token = process.env.DISCORD_BOT_TOKEN || '';
    }
    
    const updatedConfig = await storage.createOrUpdateBotConfig(configData);
    
    // Don't send the actual token back
    const response = {
      ...updatedConfig,
      token: updatedConfig.token ? '••••••••••••••••••••••••••' : ''
    };
    
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid bot configuration data', errors: error.errors });
    }
    
    console.error('Error updating bot config:', error);
    res.status(500).json({ message: 'Failed to update bot configuration' });
  }
});

// Get bot status
router.get('/status', async (req, res) => {
  try {
    const botModule = await import('../discord/bot');
    const isReady = botModule.isBotReady();
    const lastRestart = botModule.getLastRestartTime();
    
    res.json({
      isOnline: isReady,
      lastRestart
    });
  } catch (error) {
    console.error('Error getting bot status:', error);
    res.status(500).json({ message: 'Failed to get bot status' });
  }
});

// Restart bot
router.post('/restart', async (req, res) => {
  try {
    const botModule = await import('../discord/bot');
    await botModule.restartBot();
    
    res.json({ message: 'Bot restarting...' });
  } catch (error) {
    console.error('Error restarting bot:', error);
    res.status(500).json({ message: 'Failed to restart bot' });
  }
});

export default router;
