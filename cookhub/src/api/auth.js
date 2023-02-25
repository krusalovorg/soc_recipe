import axios from "axios";

export const checkSSHkey = async (sshkey) => {
    try {
        const response = await axios.post('http://localhost:8000/api/correct_key', {
            sshkey
        });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
};