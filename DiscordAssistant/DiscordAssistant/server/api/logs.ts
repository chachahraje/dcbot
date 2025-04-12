import { Router } from 'express';
import { storage } from '../storage';
import { insertErrorLogSchema } from '@shared/schema';

const router = Router();

// Get all error logs
router.get('/', async (req, res) => {
  try {
    const logs = await storage.getAllErrorLogs();
    res.json(logs);
  } catch (error) {
    console.error('Error getting error logs:', error);
    res.status(500).json({ message: 'Failed to get error logs' });
  }
});

// Create new error log
router.post('/', async (req, res) => {
  try {
    const logData = insertErrorLogSchema.parse(req.body);
    const newLog = await storage.createErrorLog(logData);
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating error log:', error);
    res.status(500).json({ message: 'Failed to create error log' });
  }
});

// Clear all error logs
router.delete('/', async (req, res) => {
  try {
    await storage.clearErrorLogs();
    res.status(204).end();
  } catch (error) {
    console.error('Error clearing error logs:', error);
    res.status(500).json({ message: 'Failed to clear error logs' });
  }
});

export default router;
