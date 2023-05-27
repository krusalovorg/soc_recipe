import axios from "axios";
import { server_ip } from "./config";

export const sendMessage = async (sshkey, text) => {
    try {
        const response = await axios.post(await server_ip() + `/chat`, {sshkey, text});
        return response.data
    } catch (error) {
        console.log(error);
        return null
    }
};
