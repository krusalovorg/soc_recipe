import React, { useContext, useEffect, useState } from 'react';

import { View, Text, StyleSheet, Image, ImageBackground, TouchableHighlight, Dimensions } from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
import { AuthContext, UserContext } from '../context/auth.context';
import { formateName } from '../utils/formate';
import { getProfile } from '../api/auth';

export default function DrawerProfile(props) {
    const [open, setOpen] = useState(false);
    const { navigation } = props;
    const user = useContext(UserContext);
    const auth = useContext(AuthContext);

    async function loadProfile() {
        const data = await getProfile(auth.token);
        if (data) {
            user.setUser(data);
        }
    }

    useEffect(() => {
        loadProfile();
    }, [DrawerProfile])

    return (
        <DrawerContentScrollView {...props} style={{ ...props.style, height: Dimensions.get("window").height }}>
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
                        <Text style={[styles.level_sel, { marginLeft: 5 }]}>{user.subscriptions.length}</Text><Text style={[styles.level, { marginLeft: 3 }]}>Подписчиков</Text>
                    </View>
                </>
            </TouchableHighlight>
            <DrawerItem
                label="Блюда"
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
                onPress={() => { setOpen(!open) }} />
            {
                open &&
                <View style={{ paddingLeft: 15 }}>
                    <DrawerItem
                        label="Завтрак"
                        style={styles.drawerItem}
                        labelStyle={[styles.drawerLabel, styles.drawerSelect]}
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'home', params: { categories: ['Завтрак'], title: 'Блюда на завтрак' } }]
                            })
                        }}
                    />
                    <DrawerItem
                        style={styles.drawerItem}
                        labelStyle={[styles.drawerLabel, styles.drawerSelect]}
                        label="Обед"
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'home', params: { categories: ['Обед'], title: 'Блюда на обед' } }]
                            })
                        }}
                    />
                    <DrawerItem
                        style={styles.drawerItem}
                        labelStyle={[styles.drawerLabel, styles.drawerSelect]}
                        label="Ужин"
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'home', params: { categories: ['Ужин'], title: 'Блюда на ужин' } }]
                            })
                        }}
                    />
                </View>
            }
            {/* <View style={{ height: 2, width: '100%', backgroundColor: '#F2F4F5' }} /> */}

            <DrawerItem
                label="Рецепты"
                onPress={() => props.navigation.navigate('home')}
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
            // icon={() => <Icon name="recipes" size={24} />}
            />
            <DrawerItem
                label="Добавить рецепт"
                onPress={() => props.navigation.navigate('add')}
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
            />
            <DrawerItem
                label="Чат"
                onPress={() => props.navigation.navigate('chat')}
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
            />

            <DrawerItem
                label="Выйти из аккаунта"
                onPress={() => { auth.logout() }}
                style={styles.drawerItem}
                labelStyle={styles.drawerLabel}
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
    },
    drawerItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#F2F4F5',
        backgroundColor: 'white',
        paddingLeft: 15
    },
    drawerLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: 'black',
        marginLeft: -16,
    },
    drawerSelect: {
        fontFamily: "Montserrat-Medium"
    }
})