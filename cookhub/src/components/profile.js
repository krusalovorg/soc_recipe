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
    const [open, setOpen] = useState(false);
    const { navigation } = props;
    const user = useContext(UserContext);

    return (
        <DrawerContentScrollView {...props}>
            <TouchableHighlight style={styles.contanier} underlayColor="#DDDDDD" onPress={() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'profile', params: { tag: user.tag, type: "forme" } }]
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
            <DrawerItem label="Блюда" onPress={() => { setOpen(!open) }} />
            {
                open &&
                <>
                    <DrawerItem
                        label="Завтрак"
                        onPress={() => {
                            
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'home', params: { categories: ['завтрак'] } }]
                            })            
                        }}
                    />
                    <DrawerItem label="Обед" />
                    <DrawerItem label="Ужин" />
                </>
            }
            <View style={{ height: 2, width: '100%', backgroundColor: '#F2F4F5' }} />

            <DrawerItem
                label="Рецепты"
                onPress={() => props.navigation.navigate('home')}
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
            // icon={() => <Icon name="settings" size={24} />}
            />
            <DrawerItem
                label="Добавить рецепт"
                onPress={() => props.navigation.navigate('add')}
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
            // icon={() => <Icon name="home" size={24} />}
            />
            <DrawerItem
                label="Чат"
                onPress={() => props.navigation.navigate('chat')}
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
            // icon={() => <Icon name="settings" size={24} />}
            />

            {/* <DrawerItemList {...props} /> */}
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