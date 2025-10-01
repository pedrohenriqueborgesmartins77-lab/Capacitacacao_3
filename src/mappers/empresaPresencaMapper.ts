// /src/mappers/empresaBasicoMapper.ts

import { DomainDto, EmpresaDto, EnderecoDto } from '../dtos/Dtos';

// Tipos hipotéticos da resposta dos clients (eles já existem, estamos apenas inferindo a estrutura)
interface CnpjClientResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  situacao: string;
  data_abertura: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
}

interface CepClientResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface DomainClientResponse {
   status: string;
  fqdn: string;
  fqdnance: string;
  exempt: boolean;
  hosts: string[]  
  suggestions: string[]  
}

/**
 * Mapeia a resposta do client de CNPJ para o DTO de Empresa.
 * @param cnpjData A resposta bruta do client.
 * @returns O DTO de Empresa.
 */
export function mapCnpjToEmpresa(cnpjData: CnpjClientResponse): EmpresaDto {
  return {
    cnpj: cnpjData.cnpj.replace(/\D/g, ''), // Normaliza CNPJ
    razaoSocial: cnpjData.razao_social,
    nomeFantasia: cnpjData.nome_fantasia || null,
    situacaoCadastral: cnpjData.situacao,
    dataAbertura: cnpjData.data_abertura,
  };
}

/**
 * Mapeia a resposta do client de CEP para o DTO de Endereço.
 * @param cepData A resposta bruta do client.
 * @param cnpjData A resposta do client de CNPJ para buscar número e complemento.
 * @returns O DTO de Endereço.
 */
export function mapCepToEndereco(
  cepData: CepClientResponse,
  cnpjData: CnpjClientResponse,
): EnderecoDto {
  return {
    cep: cepData.cep.replace(/\D/g, ''), // Normaliza CEP
    logradouro: cepData.logradouro,
    numero: cnpjData.numero, // Pega número da fonte de CNPJ, como exemplo
    complemento: cepData.complemento || cnpjData.complemento || null,
    bairro: cepData.bairro,
    cidade: cepData.localidade,
    uf: cepData.uf,
  };
}

export function mapDomainToSite(
    cnpjData: CnpjClientResponse,
    domainData: DomainClientResponse,
): DomainDto {
    return {
        fqdn: domainData.fqdn,
        // suggestions: domainData.suggestions
    };
}