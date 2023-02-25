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

import Spinner from 'react-native-loading-spinner-overlay';

import { Cache } from "react-native-cache";
import { checkSSHkey } from './api/auth';
import LoginScreen from './pages/LoginScreen';
import { AuthContext } from './context/auth.context';

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuth] = useState(false);

  const [dataUser, setDataUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const cache = new Cache({
    namespace: "auth",
    policy: {
      maxEntries: 50000,
      stdTTL: 0
    },
    backend: AsyncStorage
  });

  async function checkLogin() {
    const sshkey = await cache.get("token");
    if (sshkey) {
      const res = await checkSSHkey(sshkey)
      if (res) {
        setToken(sshkey);
        setIsAuth(true);
      } else {
        console.log("GETETSTT FALSE")
        await cache.remove("token");
        setToken('');
        setIsAuth(false);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    checkLogin();
  }, [App])

  if (loading) {
    return (
      <SafeAreaView>
        <View>
          <Spinner visible={true} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <>
      <AuthContext.Provider value={{token, userId, checkLogin, isAuthenticated}}>
        <NavigationContainer>
          {token == null ?
            <Stack.Navigator>
              <Stack.Screen
                name="reg"
                component={RegScreen}
                options={{
                  title: "Регистрация",
                  headerShown: false
                }} />
              <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{
                  title: "Вход",
                  headerShown: false
                }} />
            </Stack.Navigator>
            :
            <Drawer.Navigator
              drawerContent={(props) => <DrawerProfile {...props} />}
              initialRouteName={"home"}>
              <Drawer.Screen
                name="home"
                component={HomeScreen}
                options={{
                  title: 'Рецепты',
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
      </AuthContext.Provider>
    </>
  );
};

export default App;