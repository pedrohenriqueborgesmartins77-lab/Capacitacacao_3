// /src/utils/requestContext.ts

import pino, { Logger } from 'pino';

// Logger base da aplicação (pode ser configurado em um arquivo central de inicialização)
const baseLogger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
  },
});

export interface RequestContext {
  requestId: string;
  logger: Logger;
  timeoutBudget: number; // Orçamento de tempo total para a operação em ms
}

/**
 * Cria um contexto de requisição com um logger filho contendo o requestId.
 * @param requestId O ID único da requisição.
 * @param baseTimeout O tempo limite base para operações dentro deste contexto.
 * @returns O objeto de contexto da requisição.
 */
export function createRequestContext(
  requestId: string,
  baseTimeout = 5000,
): RequestContext {
  return {
    requestId,
    logger: baseLogger.child({ requestId }),
    timeoutBudget: baseTimeout,
  };
}