/**
 * Festiya Health and Reliability Telemetry
 * Provides active service readiness monitoring and exponential retry utilities.
 */

export interface SystemHealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  endpoint: string;
  version: string;
}

/**
 * Health check probe simulator for /healthz and /ready endpoints
 * @returns {Promise<SystemHealthStatus>} Current system health state
 */
export async function checkSystemHealth(): Promise<SystemHealthStatus> {
  const healthEndpoint = '/healthz';
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: typeof performance !== 'undefined' ? performance.now() : 0,
    endpoint: healthEndpoint,
    version: '1.0.0'
  };
}

/**
 * Executes an asynchronous action with exponential backoff and retry strategy.
 * @param fn Asynchronous task to execute
 * @param retries Maximum retry attempts
 * @param delay Initial backoff delay in ms
 * @returns Result of the task
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 500
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return executeWithRetry(fn, retries - 1, delay * 2);
  }
}
