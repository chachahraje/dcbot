import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { insertCommandSchema } from '@shared/schema';

const router = Router();

// Get all commands
router.get('/', async (req, res) => {
  try {
    const commands = await storage.getAllCommands();
    res.json(commands);
  } catch (error) {
    console.error('Error getting commands:', error);
    res.status(500).json({ message: 'Failed to get commands' });
  }
});

// Get a specific command
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid command ID' });
    }
    
    const command = await storage.getCommand(id);
    if (!command) {
      return res.status(404).json({ message: 'Command not found' });
    }
    
    res.json(command);
  } catch (error) {
    console.error('Error getting command:', error);
    res.status(500).json({ message: 'Failed to get command' });
  }
});

// Create a new command
router.post('/', async (req, res) => {
  try {
    const commandData = insertCommandSchema.parse(req.body);
    
    // Check if command with the same name already exists
    const existing = await storage.getCommandByName(commandData.name);
    if (existing) {
      return res.status(409).json({ message: 'Command with this name already exists' });
    }
    
    const newCommand = await storage.createCommand(commandData);
    res.status(201).json(newCommand);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid command data', errors: error.errors });
    }
    
    console.error('Error creating command:', error);
    res.status(500).json({ message: 'Failed to create command' });
  }
});

// Update a command
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid command ID' });
    }
    
    // Validate partial command data
    const validatedData = insertCommandSchema.partial().parse(req.body);
    
    // Check if command exists
    const existing = await storage.getCommand(id);
    if (!existing) {
      return res.status(404).json({ message: 'Command not found' });
    }
    
    // If name is being updated, check for conflicts
    if (validatedData.name && validatedData.name !== existing.name) {
      const nameConflict = await storage.getCommandByName(validatedData.name);
      if (nameConflict) {
        return res.status(409).json({ message: 'Command with this name already exists' });
      }
    }
    
    const updatedCommand = await storage.updateCommand(id, validatedData);
    if (!updatedCommand) {
      return res.status(404).json({ message: 'Command not found' });
    }
    
    res.json(updatedCommand);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid command data', errors: error.errors });
    }
    
    console.error('Error updating command:', error);
    res.status(500).json({ message: 'Failed to update command' });
  }
});

// Delete a command
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid command ID' });
    }
    
    const success = await storage.deleteCommand(id);
    if (!success) {
      return res.status(404).json({ message: 'Command not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting command:', error);
    res.status(500).json({ message: 'Failed to delete command' });
  }
});

export default router;
