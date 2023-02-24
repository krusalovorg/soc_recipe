/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './pages/HomeScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerProfile from './components/profile';
import RecipeScreen from './pages/RecipeScreen';

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
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
            drawerItemStyle: {height: 0}
          }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;