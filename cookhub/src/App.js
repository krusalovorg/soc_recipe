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

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const App = () => {
  const [token, setToken] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const cache = new Cache({
    namespace: "myapp",
    policy: {
      maxEntries: 50000,
      stdTTL: 0
    },
    backend: AsyncStorage
  });

  async function checkLogin() {
    const sshkey = await cache.get("sshkey");
    console.log('SSH',sshkey)
    if (sshkey) {
      checkSSHkey(sshkey);
      setToken(sshkey);
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
    </>
  );
};

export default App;