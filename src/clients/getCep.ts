import axios from "axios";

export async function getCepInfo(cep : string) {
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cep}`)

        return response.data
    }catch (error) {
        throw new Error ("CEP não encontrado ou inválido.")       
    }
}