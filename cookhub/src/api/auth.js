import axios from "axios";
import { server_ip } from "./config";

export const checkSSHkey = async (sshkey) => {
    try {
        const response = await axios.post(server_ip+'/correct_key', {
            sshkey
        });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
};