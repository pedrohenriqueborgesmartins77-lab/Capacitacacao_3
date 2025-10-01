// /src/policies/retry.ts

import { Logger } from 'pino';

interface RetryOptions {
  retries?: number;
  initialDelay?: number;
  factor?: number;
  logger: Logger;
}

// Função de espera auxiliar
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executa uma função que retorna uma Promise com uma política de novas tentativas
 * e backoff exponencial.
 *
 * @param fn A função assíncrona a ser executada.
 * @param options Opções de retry, incluindo o logger para registrar as tentativas.
 * @returns O resultado da Promise se for bem-sucedida.
 * @throws O último erro capturado se todas as tentativas falharem.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const { retries = 3, initialDelay = 100, factor = 3, logger } = options;
  let currentDelay = initialDelay;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === retries - 1) {
        // Última tentativa, lança o erro
        logger.error(
          { attempt: i + 1, totalAttempts: retries, err: error.message },
          'Retry failed on the last attempt',
        );
        throw error;
      }

      logger.warn(
        {
          attempt: i + 1,
          totalAttempts: retries,
          delay: currentDelay,
          err: error.message,
        },
        'Retry attempt failed, waiting before next retry',
      );

      await delay(currentDelay);
      currentDelay *= factor; // Backoff exponencial
    }
  }

  // Este ponto não deve ser alcançado, mas é um fallback para satisfazer o TypeScript
  throw new Error('Retry logic failed unexpectedly.');
}