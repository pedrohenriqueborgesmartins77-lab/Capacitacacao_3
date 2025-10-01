import axios from "axios";

export async function getCnpjInfo(cnpj: string) {
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)

        return response.data
    }catch (error) {
        throw new Error ("CNPJ não encontrado ou inválido.")
    }
}