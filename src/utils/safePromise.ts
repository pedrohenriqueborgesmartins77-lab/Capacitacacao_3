// /src/utils/safePromise.ts

export type SafePromiseResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error; warning: string };

/**
 * Executa uma Promise e captura qualquer erro, retornando um objeto de resultado
 * que indica sucesso ou falha sem lançar uma exceção.
 *
 * @param promise A Promise a ser executada com segurança.
 * @param warningMessage A mensagem de aviso a ser retornada em caso de falha.
 * @returns Um objeto indicando o resultado da operação.
 */
export async function safePromise<T>(
  promise: Promise<T>,
  warningMessage: string,
): Promise<SafePromiseResult<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { success: false, error: err, warning: warningMessage };
  }
}