import { FeriadosDto } from "../dtos/Dtos";

interface DddData {
  state: string;
  cities: string[];
}

interface FeriadosData {
  date: string;
  name: string;
  type: string;
  level: string;
}

export function mapDddToInfo(data: DddData) {
  return {
    uf: data.state,
    cidades: data.cities,
  };
}

export function mapFeriados(data: FeriadosData[]): FeriadosDto[] {
  if (!Array.isArray(data)) return [];
  
  // Agora o mapeamento é direto, apenas garantindo a estrutura
  return data.map((feriados) => ({
    date: feriados.date,
    name: feriados.name,
    type: feriados.type,
    level: feriados.level,
  }));
}