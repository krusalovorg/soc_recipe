/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './pages/HomeScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerProfile from './components/profile';
import RecipeScreen from './pages/RecipeScreen';
import RegScreen from './pages/RegScreen';

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const App = () => {
  const [token, setToken] = useState(null);
  const [dataUser, setDataUser] = useState(null);

  function login() {

  }


  return (
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
  );
};

export default App;