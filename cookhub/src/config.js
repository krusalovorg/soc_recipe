import { AsyncStorage } from 'react-native';

const storageName = "settings";

export let config = {
    SERVER_IP: "192.168.137.1",
    SERVER_PORT: 3030,
    WEBSOCKET_PORT: 3003
}

export async function getIpServer() {
    const data = JSON.parse(await AsyncStorage.getItem(storageName))
    config.SERVER_IP = data != null ? data.ip : config.SERVER_IP
    console.log('SERVER_IP:',config.SERVER_IP)
    return data != null ? data.ip : config.SERVER_IP
}

export async function setIpServer(ip) {
    await AsyncStorage.setItem(storageName, JSON.stringify({
        ip
    }))
    return true;  
}