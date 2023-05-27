import { AsyncStorage } from 'react-native';
import { Cache } from 'react-native-cache';

const cache = new Cache({
    namespace: "auth",
    policy: {
        maxEntries: 50000,
        stdTTL: 0
    },
    backend: AsyncStorage
});

export async function server_ip() {
    const ip = await cache.get("ip")
    console.log('get', ip)
    return ip || "http://192.168.0.12:8000/api"
};