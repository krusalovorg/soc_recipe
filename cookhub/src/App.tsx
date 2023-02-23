/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import HomeScreen from './screens/HomeScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

function App(): JSX.Element {
  return (
    <SafeAreaView>
      <NavigationContainer>
        <Drawer.Navigator /*drawerContent={(props) => <DrawerProfile {...props} />}*/>
          <Drawer.Screen
            name="home"
            component={HomeScreen}
            options={{
              title: 'Главная',
            }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
