import { useState, useCallback } from "react"
import { config } from "../config";

export const useHttp = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const proxy = "http://"+config.SERVER_IP+":"+config.SERVER_PORT;

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
                headers['Access-Control-Allow-Origin'] = proxy;
                headers['Access-Control-Allow-Credentials'] = true;
            }
            console.log(proxy+url);
            const respones = await fetch(proxy+url, {method, body, headers})
            const data = await respones.json()
            if (!respones.ok) {
                console.error('Что-то пошло не так:',data)
            }
            setLoading(false)
            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError}
}