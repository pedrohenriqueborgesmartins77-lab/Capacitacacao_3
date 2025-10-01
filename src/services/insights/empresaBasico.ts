import { getFromCache, setInCache } from '../../utils/cache';
import { RequestContext } from '../../utils/requestContext';
import { safePromise } from '../../utils/safePromise';
import { EmpresaBasicoDto } from '../../dtos/Dtos';
import { mapCnpjToEmpresa, mapCepToEndereco } from '../../mappers/empresaBasicoMapper';
import { withRetry } from '../../policies/retry';
import { withTimeout } from '../../policies/timeout';

// --- ASSUMPTIONS ---
// Os clients abaixo já existem e retornam os tipos inferidos nos mappers.
// Eles são injetados ou importados de um caminho conhecido.
import { getCnpjInfo } from '../../clients/getCnpj'; 
import { getCepInfo } from '../../clients/getCep';   

const CACHE_TTL_SECONDS = 3600; // 1 hora

/**
 * Orquestra a busca de dados básicos de uma empresa, combinando informações de CNPJ e CEP.
 * Lida com falhas parciais, acumulando avisos em vez de interromper o fluxo.
 *
 * @param cnpj O CNPJ a ser consultado (somente números).
 * @param ctx O contexto da requisição (requestId, logger, timeout).
 * @returns Um DTO contendo os dados da empresa, endereço e uma lista de avisos.
 */
export async function getEmpresaBasico(
  cnpj: string,
  ctx: RequestContext,
): Promise<EmpresaBasicoDto> {
  const cacheKey = `empresa-basico:${cnpj}`;
  const cachedData = getFromCache<EmpresaBasicoDto>(cacheKey, ctx.logger);
  if (cachedData) {
    return cachedData;
  }

  const warnings: string[] = [];
  let empresaDto;
  let enderecoDto;

  // --- 1. Busca de dados do CNPJ ---
  const cnpjPromise = withTimeout(
    () => withRetry(() => getCnpjInfo(cnpj), { logger: ctx.logger }),
    ctx.timeoutBudget,
  );

  const cnpjResult = await safePromise(
    cnpjPromise,
    'Falha ao buscar dados do CNPJ. A consulta pode estar incompleta.',
  );

  if (!cnpjResult.success) {
    warnings.push(cnpjResult.warning);
    ctx.logger.error({ err: cnpjResult.error }, cnpjResult.warning);

    // Falha crítica: sem dados do CNPJ, não podemos continuar.
    const resultDto = { warnings };
    setInCache(cacheKey, resultDto, CACHE_TTL_SECONDS); // Cache do resultado de falha
    return resultDto;
  }

  const cnpjData = cnpjResult.data;
  empresaDto = mapCnpjToEmpresa(cnpjData);
  const cep = cnpjData.cep?.replace(/\D/g, '');

  if (cep) {
    const remainingTimeout = ctx.timeoutBudget / 2;

    const cepPromise = withTimeout(
      () => withRetry(() => getCepInfo(cep), { logger: ctx.logger }),
      remainingTimeout,
    );
    const cepResult = await safePromise(
      cepPromise,
      `Falha ao buscar dados do CEP ${cep}. O endereço pode estar ausente ou incompleto.`,
    );

    if (cepResult.success) {
      enderecoDto = mapCepToEndereco(cepResult.data, cnpjData);
    } else {
      warnings.push(cepResult.warning);
      ctx.logger.warn({ err: cepResult.error, cep }, cepResult.warning);
    }
  } else {
    const warning = 'CNPJ não retornou um CEP para consulta de endereço.';
    warnings.push(warning);
    ctx.logger.info(warning);
  }

  // --- 3. Montagem do resultado final ---
  const finalDto: EmpresaBasicoDto = {
    // Adiciona a propriedade 'empresa' somente se 'empresaDto' tiver um valor
    ...(empresaDto && { empresa: empresaDto }),
    // Adiciona a propriedade 'endereco' somente se 'enderecoDto' tiver um valor
    ...(enderecoDto && { endereco: enderecoDto }),
    warnings,
  };

  setInCache(cacheKey, finalDto, CACHE_TTL_SECONDS);

  return finalDto;
}