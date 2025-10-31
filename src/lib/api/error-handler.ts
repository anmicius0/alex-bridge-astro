// src/lib/errorHandler.ts
// Centralized error handling utilities

/**
 * LogLevel type for consistent logging
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Configuration for error handling
 */
interface ErrorConfig {
  logLevel?: LogLevel;
  shouldThrow?: boolean;
  context?: string;
}

/**
 * Centralized error logging function
 * @param error - The error object or message
 * @param config - Configuration options
 */
export function logError(error: unknown, config: ErrorConfig = {}): void {
  const { logLevel = 'error', shouldThrow = false, context = '' } = config;

  const timestamp = new Date().toISOString();
  const errorInfo = formatError(error);

  // Build message with context
  let message = `[${timestamp}] [${logLevel.toUpperCase()}]`;
  if (context) {
    message += ` [${context}]`;
  }
  message += ` ${errorInfo}`;

  // Log according to level
  switch (logLevel) {
    case 'debug':
      console.debug(message);
      break;
    case 'info':
      console.info(message);
      break;
    case 'warn':
      console.warn(message);
      break;
    case 'error':
    default:
      console.error(message);
      break;
  }

  // Optionally re-throw the error
  if (shouldThrow && error instanceof Error) {
    throw error;
  }
}

/**
 * Format error object or message for consistent logging
 */
function formatError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (error && typeof error === 'object') {
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error);
}

/**
 * Safe try-catch wrapper for consistent error handling
 */
export async function safeExecute<T>(
  operation: () => T | Promise<T>,
  config: ErrorConfig = {}
): Promise<{ success: boolean; data?: T; error?: unknown }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    logError(error, config);
    return { success: false, error };
  }
}

/**
 * Handle API response errors consistently
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  context?: string
): Response {
  // Log the error
  logError(message, {
    logLevel: 'error',
    context: context || 'API Response',
  });

  // Return appropriate response
  return new Response(
    JSON.stringify({
      error: true,
      message: sanitizeErrorMessage(message),
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

/**
 * Sanitize error messages for client responses to avoid exposing sensitive information
 */
function sanitizeErrorMessage(message: string): string {
  // Remove potentially sensitive information from error messages
  return message
    .replace(/private_key.*?"([^"]*)"/gi, 'private_key: [REDACTED]')
    .replace(/client_email.*?"([^"]*)"/gi, 'client_email: [REDACTED]')
    .replace(/project_id.*?"([^"]*)"/gi, 'project_id: [REDACTED]');
}

/**
 * Format error for client-side display (safe for users)
 */
export function formatClientError(error: unknown, context?: string): string {
  const config: ErrorConfig = {
    logLevel: 'warn',
    context: context || 'Client Error',
  };

  logError(error, config);

  // Return a user-friendly message
  if (error instanceof Error) {
    // Don't expose internal error details to users
    return 'An error occurred. Please try again.';
  }

  return 'An unexpected error occurred.';
}
