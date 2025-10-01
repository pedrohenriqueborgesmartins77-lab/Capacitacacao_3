import { getRegisterInfo } from "../../clients/get-br-register";
import { getCepInfo } from "../../clients/getCep";
import { getCnpjInfo } from "../../clients/getCnpj";
import { EmpresaPresencaDto } from "../../dtos/Dtos";
import { mapCepToEndereco, mapCnpjToEmpresa, mapDomainToSite } from "../../mappers/empresaPresencaMapper";
import { withRetry } from "../../policies/retry";
import { withTimeout } from "../../policies/timeout";
import { getFromCache, setInCache } from "../../utils/cache";
import { RequestContext } from "../../utils/requestContext";
import { safePromise } from "../../utils/safePromise";


const CACHE_TTL_SECONDS = 3600

export async function getEmpresaPresenca(
    cnpj: string,
    ctx: RequestContext,
): Promise<EmpresaPresencaDto> {
  const cacheKey = `empresa-basico:${cnpj}`;
  const cachedData = getFromCache<EmpresaPresencaDto>(cacheKey, ctx.logger);
  if (cachedData) {
    return cachedData;
  }

    const warnings: string[] = [];
    let empresaDto;
    let enderecoDto;
    let domainDto

    const cnpjPromise = withTimeout(
        () => withRetry(() => getCnpjInfo(cnpj), { logger: ctx.logger }),
        ctx.timeoutBudget
    );

    const cnpjResult = await safePromise(
        cnpjPromise,
        'Falaha ao buscar dados do CNPJ. A consulta pode estar incompleta.',
    );

  if (!cnpjResult.success) {
    warnings.push(cnpjResult.warning);
    ctx.logger.error({ err: cnpjResult.error }, cnpjResult.warning);

        const resultDto = { warnings };
        setInCache(cacheKey, resultDto, CACHE_TTL_SECONDS);
        return resultDto
    }

    const cnpjData = cnpjResult.data;
    empresaDto = mapCnpjToEmpresa(cnpjData);
    const cep = cnpjData.cep?.replace(/\D/g ,'');
    const domain = cnpjData.domain

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

    if (domain) {
      const remainingTimeout = ctx.timeoutBudget / 2;

      const domainPromise = withTimeout(
        () => withRetry(() => getRegisterInfo (domain), { logger: ctx.logger }),
        remainingTimeout,
      );
      const domainResult = await safePromise(
        domainPromise,
        `Falha ao buscar dados do domínio${domain}. Os dados de presença digital podem estar incompletos.`,
      );

      if (domainResult.success) {
        domainDto = mapDomainToSite(domainResult.data, cnpjData);
      } else {
        warnings.push(domainResult.warning);
        ctx.logger.warn({ err: domainResult.error, domain }, domainResult.warning);
      }
    } else {
      const warning = 'CNPJ não retornou um DOMINIO para consulta de registro.';
      warnings.push(warning);
      ctx.logger.info(warning);
    }

    // --- 3. Montagem do resultado final ---
    const finalDto: EmpresaPresencaDto = {
      ...(empresaDto && { empresa: empresaDto }),
      ...(enderecoDto && { endereco: enderecoDto }),
      ...(domainDto && { dominio: domainDto }),
      warnings,
    };
  
    setInCache(cacheKey, finalDto, CACHE_TTL_SECONDS);
  
    return finalDto;
}