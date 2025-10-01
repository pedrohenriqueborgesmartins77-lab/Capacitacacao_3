import { getDddInfo } from '../../clients/getddd';
import { getHolidaysInfo } from '../../clients/getFeriados';
import { ContatoDto, FeriadosDto } from '../../dtos/Dtos';
import { mapDddToInfo, mapFeriados } from '../../mappers/contatoMapper';

import { withRetry } from '../../policies/retry';
import { withTimeout } from '../../policies/timeout';
import { getFromCache, setInCache } from '../../utils/cache';
import { RequestContext } from '../../utils/requestContext';
import { safePromise } from '../../utils/safePromise';

const CACHE_TTL_SECONDS = 3600; // 1 hora

/**
 * Agrega informações de DDD e feriados para fornecer insights de contato.
 * @param ddd - O DDD a ser consultado.
 * @param ano - O ano para consulta de feriados (opcional, usa o ano atual como padrão).
 * @param ctx - O contexto da requisição para logging e timeouts.
 * @returns Um DTO com informações de UF, cidades, feriados e avisos.
 */
export async function getContato(
  ddd: string,
  ano: string | undefined,
  ctx: RequestContext,
): Promise<ContatoDto> {
  const targetYear = ano || new Date().getFullYear().toString();
  const cacheKey = `insight-contato:${ddd}:${targetYear}`;
  
  const cachedData = await getFromCache<ContatoDto>(cacheKey, ctx.logger);
  if (cachedData) {
    return cachedData;
  }
  
  const warnings: string[] = [];

  // 1. Buscar dados do DDD (essencial para continuar)
  const dddResult = await safePromise(
    getDddInfo(ddd),
    'Falha ao buscar dados do DDD. A consulta não pode prosseguir.'
  );

  if (!dddResult.success) {
    ctx.logger.error({ err: dddResult.error }, dddResult.warning);
    // Sem o DDD, não podemos obter o estado para buscar feriados, então retornamos o erro.
    throw new Error(dddResult.warning);
  }

  const { uf, cidades } = mapDddToInfo(dddResult.data);
  let feriados: FeriadosDto[] = [];
  
  // 2. Com o UF, buscar os feriados (tarefa secundária)
  const holidaysPromise = withTimeout(
    () => withRetry(() => getHolidaysInfo(parseInt(targetYear), uf), { logger: ctx.logger }),
    ctx.timeoutBudget
  );

  const holidaysResult = await safePromise(
    holidaysPromise,
    `Falha ao buscar feriados para ${uf} em ${targetYear}. A resposta será parcial.`
  );
  
  if (holidaysResult.success) {
    feriados = mapFeriados(holidaysResult.data);
  } else {
    warnings.push(holidaysResult.warning);
    ctx.logger.warn({ err: holidaysResult.error }, holidaysResult.warning);
  }

  const resultDto: ContatoDto = {
    uf,
    cidades,
    feriados,
    warnings,
  };

  await setInCache(cacheKey, resultDto, CACHE_TTL_SECONDS);

  return resultDto;
}
