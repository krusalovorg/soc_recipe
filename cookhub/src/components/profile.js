import React, { useContext, useEffect, useState } from 'react';

import { View, Text, StyleSheet, Image, ImageBackground, TouchableHighlight } from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
import { UserContext } from '../context/auth.context';
import { formateName } from '../utils/formate';

export default function DrawerProfile(props) {
    const { navigation } = props;
    const user = useContext(UserContext);

    return (
        <DrawerContentScrollView {...props}>
            <TouchableHighlight style={styles.contanier} underlayColor="#DDDDDD" onPress={() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'profile', params: {tag: user.tag, type: "forme"} }]
                })
            }}>
                <>
                    <Text style={styles.name}>{formateName(user.name)} {formateName(user.surname)}</Text>
                    <Text style={styles.level}>@{user.tag}</Text>

                    <View style={styles.hor_menu}>
                        <Text style={styles.level_sel}>{user.recipes.length}</Text><Text style={[styles.level, { marginLeft: 3 }]}>Рецептов</Text>
                        <Text style={[styles.level_sel, { marginLeft: 5 }]}>{user.likes.length}</Text><Text style={[styles.level, { marginLeft: 3 }]}>Подписчиков</Text>
                    </View>
                </>
            </TouchableHighlight>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    contanier: {
        paddingLeft: 15,
        paddingTop: 20,
        paddingBottom: 15,
    },
    name: {
        fontSize: 20,
        fontFamily: "Montserrat-Medium",
        color: "black"
    },
    level: {
        fontFamily: "Montserrat-Regular",
        marginTop: 3
    },
    hor_menu: {
        flexDirection: "row",
        marginTop: 10
    },
    level_sel: {
        marginTop: 3,
        color: 'black',
        fontFamily: "Montserrat-Medium"
    }
})