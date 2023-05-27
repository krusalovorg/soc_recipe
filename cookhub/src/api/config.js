import { AsyncStorage } from 'react-native';

export const server_ip = async () => {
    const ip = AsyncStorage.getItem()
    return "http://192.168.0.12:8000/api"
};