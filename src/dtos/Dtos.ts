// /src/dtos/empresaBasicoDto.ts

export interface EmpresaDto {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  situacaoCadastral: string;
  dataAbertura: string;
}

export interface EnderecoDto {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface DomainDto {
  fqdn: string;
}

export interface DddDto {
  state: string;
}

export interface FeriadosDto { 
  date: string;
  name: string; 
  type: string; 
  level: string; 
};

export interface IbgeUfDto {
  nome: string;
  codigo_ibge: string;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface EmpresaBasicoDto {
  empresa?: EmpresaDto;
  endereco?: EnderecoDto;
  warnings: string[];
}

export interface EmpresaPresencaDto {
  empresa?: EmpresaDto;
  endereco?: EnderecoDto;
  dominio?: DomainDto;
  warnings: string[];
}

export interface EmpresaContatoDto {
  empresa?: EmpresaDto;
  endereco?: EnderecoDto;
  uf?: IbgeUfDto;
  warnings: string[];
}

export interface ContatoDto {
  uf: string;
  cidades: string[];
  feriados: FeriadosDto[];
  warnings: string[];
}