import { storage } from '../../storage';

export async function logError(message: string, error?: unknown): Promise<void> {
  try {
    const errorMessage = message || 'Unknown error';
    let errorStack = '';
    
    if (error instanceof Error) {
      errorStack = error.stack || error.message;
    } else if (error) {
      errorStack = String(error);
    }
    
    // Log to console
    console.error(`[ERROR] ${errorMessage}:`, errorStack || 'No stack trace');
    
    // Log to storage
    await storage.createErrorLog({
      message: errorMessage,
      stack: errorStack
    });
  } catch (storageError) {
    // If logging to storage fails, at least log to console
    console.error('Error while logging error to storage:', storageError);
    console.error('Original error:', message, error);
  }
}
