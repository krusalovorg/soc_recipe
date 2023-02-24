import {useState, useCallback, useEffect} from 'react'
import { AsyncStorage } from 'react-native';

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const [authPin, setAuthPin] = useState(null)
  const [IncludedPinCode, SetIncludedPinCode] = useState(false)
  const [ThisPinCode, SetPinCode] = useState(null)

  const login = useCallback(async (jwtToken, id) => {
    setToken(jwtToken)
    setUserId(id)

    console.log(jwtToken,id)

    await AsyncStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }))
    //window.href = '../home';
  }, [])

  const logout = useCallback(async () => {
    setToken(null)
    setUserId(null)
    await AsyncStorage.removeItem(storageName)
  }, [])

  const setNewPinCode = useCallback(async (pincode) => {
    const new_data = JSON.parse(await AsyncStorage.getItem(storageName)); 
    new_data['pin_code'] = pincode;
    await AsyncStorage.setItem(storageName, JSON.stringify(new_data));
    const data = JSON.parse(await AsyncStorage.getItem(storageName));
    SetPinCode(pincode)
    SetIncludedPinCode(true)
    console.log(data)
  }, [])

  const AuthPinCode = useCallback(async (pincode) => {
    const pin = JSON.parse(await AsyncStorage.getItem(storageName)).pin_code;
    console.log(pincode == pin)
    if (pincode == pin) {
      setAuthPin(true);
      return true;
    }
    return false;
  }, [])


  useEffect(() => {
    async function init() {
      const data = JSON.parse(await AsyncStorage.getItem(storageName))
      console.log(data)
      if (data && data.token) {
        await login(data.token, data.userId)
        await setNewPinCode(data.pin_code)
        SetIncludedPinCode(data.pin_code ? true : false)
        SetPinCode(data.pin_code != undefined && data.pin_code ? data.pin_code : null)
      }
      setReady(true)  
    }
    init()
  }, [login])


  return { login, logout, token, userId, ready, authPin, IncludedPinCode, setNewPinCode, ThisPinCode, AuthPinCode }
}