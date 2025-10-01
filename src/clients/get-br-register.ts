import axios from "axios";

export async function getRegisterInfo(domain: string) {
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/registrobr/v1/${domain}`)

        return response.data
    }catch (error) {
        throw new Error ("Domínio não encontrado.")        
    }  
}