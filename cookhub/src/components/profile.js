import React, { useContext, useEffect, useState } from 'react';

import { View, Text, StyleSheet, Image, ImageBackground, TouchableHighlight } from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';

export default function DrawerProfile(props) {
    const {navigation} = props;

    return (
      <DrawerContentScrollView {...props}>
          <TouchableHighlight style={{marginBottom: 20}} underlayColor="#DDDDDD" onPress={()=>{navigation.navigate('profile');navigation.closeDrawer();}}>
            <Text>Egor</Text>
          </TouchableHighlight>
          <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
}  

const styles = StyleSheet.create({
    contanier: {
        padding: 10,
        backgroundColor: 'transparent',
        marginHorizontal: 10,
        borderRadius: 10,
        minHeight: 250,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#ededed',
    },
    info_contanier: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    name_contanier: {
        marginLeft: 10
    },
    name_text: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})