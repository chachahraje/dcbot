import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

// Import API routes
import botRoutes from "./api/bot";
import commandRoutes from "./api/commands";
import logRoutes from "./api/logs";

// Import Discord bot initialization
import { initializeBot } from "./discord/bot";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix all routes with /api
  app.use('/api/bot', botRoutes);
  app.use('/api/commands', commandRoutes);
  app.use('/api/logs', logRoutes);
  
  // Initialize the Discord bot
  try {
    await initializeBot();
  } catch (error) {
    console.error('Failed to initialize Discord bot:', error);
  }

  const httpServer = createServer(app);

  return httpServer;
}
