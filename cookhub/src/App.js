/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { AsyncStorage, SafeAreaView, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './pages/HomeScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerProfile from './components/profile';
import RecipeScreen from './pages/RecipeScreen';
import RegScreen from './pages/RegScreen';

import { Cache } from "react-native-cache";
import { checkSSHkey, getProfile } from './api/auth';
import LoginScreen from './pages/LoginScreen';
import { AuthContext, UserContext } from './context/auth.context';

import Loader from './components/loader';
import CreateRecipeScreen from './pages/CreateRecipeScreen';
import { server_ip } from './api/config';
import ProfileScreen from './pages/ProfileScreen';
import ChatScreen from './pages/ChatScreen';
import ErrorBoundary from './pages/ErrorScreen';
import RNRestart from 'react-native-restart'; 

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuth] = useState(false);

  const [dataUser, setDataUser] = useState({});
  const [loading, setLoading] = useState(true);

  const cache = new Cache({
    namespace: "auth",
    policy: {
      maxEntries: 50000,
      stdTTL: 0
    },
    backend: AsyncStorage
  });

  async function logout() {
    await cache.remove("token");
    await cache.remove("id");
    setToken(null);
    setIsAuth(false);
    setTimeout(()=>{
      RNRestart.Restart();
    },200)
  }

  async function checkLogin(login=false) {
    const sshkey = await cache.get("token");
    if (sshkey) {
      const res = await checkSSHkey(sshkey)
      if (res) {
        setToken(sshkey);
        const data = await getProfile(sshkey);
        setDataUser(data);
        cache.set('id', data.id);
        setIsAuth(true);
        if (login) {
          setTimeout(()=>{
            RNRestart.Restart();
          },200)
        }
      } else {
        await cache.remove("token");
        await cache.remove("id");
        setToken(null);
        setIsAuth(false);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    checkLogin();
  }, [App])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <AuthContext.Provider value={{ token, userId, checkLogin, isAuthenticated, logout }}>
        <UserContext.Provider value={{ ...dataUser, setUser: setDataUser }}>
          <ErrorBoundary>
            <NavigationContainer>
              {(!token || !isAuthenticated) ?
                <Stack.Navigator>
                  <Stack.Screen
                    name="reg"
                    component={RegScreen}
                    options={{
                      title: "??????????????????????",
                      headerShown: false
                    }} />
                  <Stack.Screen
                    name="login"
                    component={LoginScreen}
                    options={{
                      title: "????????",
                      headerShown: false
                    }} />
                </Stack.Navigator>
                :
                <Drawer.Navigator
                  drawerContent={(props) => <DrawerProfile {...props} />}
                  initialRouteName={"home"}>
                  <Drawer.Screen
                    name="profile"
                    component={ProfileScreen}
                    options={{
                      drawerItemStyle: { height: 0 },
                      headerShown: false
                    }} />
                  <Drawer.Screen
                    name="add"
                    component={CreateRecipeScreen}
                    options={{
                      title: '???????????????? ????????????',
                    }} />
                  <Drawer.Screen
                    name="home"
                    component={HomeScreen}
                    options={{
                      title: '??????????????',
                    }} />
                  <Drawer.Screen
                    name="chat"
                    component={ChatScreen}
                    options={{
                      title: 'CookBot',
                    }} />
                  <Drawer.Screen
                    name="recipe"
                    component={RecipeScreen}
                    options={{
                      drawerItemStyle: { height: 0 },
                      headerShown: false
                    }} />
                </Drawer.Navigator>
              }
            </NavigationContainer>
          </ErrorBoundary>
        </UserContext.Provider>
      </AuthContext.Provider>
    </>
  );
};

export default App;