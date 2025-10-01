import axios from "axios";

export async function getUfInfo(siglaUF: string) {
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/ibge/municipios/v1/${siglaUF}?providers=dados-abertos-br,gov,wikipedia`)

        return response.data
    }catch (error) {
        throw new Error ("Sigla inexistente ou inválida.")
    }
}