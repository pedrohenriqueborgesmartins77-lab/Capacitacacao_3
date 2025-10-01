import axios from "axios";

const TOKEN = "22079|bZIBnpz4PsUBEmNBkX2dNO18c2QBKPQy"

export async function getHolidaysInfo(ano: number, estado: string) {
  try {
    const response = await axios.get(
      `https://api.invertexto.com/v1/holidays/${ano}?state=${estado}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

        return response.data
    }catch (error) {
        throw new Error ("Ano fora do intervalo suportado.")
    }
}