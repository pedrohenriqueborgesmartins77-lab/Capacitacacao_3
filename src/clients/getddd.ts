import axios from "axios";

export async function getDddInfo(ddd: string) {
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/ddd/v1/${ddd}`)

        return response.data
    }catch (error) {
        throw new Error("DDD não encontrado ou inválido.")
    }
}