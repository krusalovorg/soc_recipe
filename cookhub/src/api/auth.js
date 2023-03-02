import axios from "axios";
import { server_ip } from "./config";

export const checkSSHkey = async (sshkey) => {
    try {
        const response = await axios.post(server_ip+'/correct_key', {
            sshkey
        });
        console.log(response.data);
        return response.data.status
    } catch (error) {
        console.log(error);
        return false
    }
};

export const getProfile = async (sshkey) => {
    try {
        const response = await axios.post(server_ip+'/get_profile', {
            sshkey
        });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
        return false
    }
};

export const getProfileId = async (sshkey, tag) => {
    try {
        const response = await axios.post(server_ip+'/get_user_profile', {
            sshkey, tag
        });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
        return false
    }
};

export const subscribeUser = async (sshkey, user_for) => {
    try {
        const response = await axios.post(server_ip + `/sub_profile`, {sshkey, user_for});
        return response.data;
    } catch (error) {
        console.log(error);
        return null
    }
};

export const unSubscribeUser = async (sshkey, user_for) => {
    try {
        const response = await axios.post(server_ip + `/unssub_profile`, {sshkey, user_for});
        return response.data;
    } catch (error) {
        console.log(error);
        return null
    }
};