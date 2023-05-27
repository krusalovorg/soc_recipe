import React, { useEffect, useState, useContext, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { ToastAndroid, View, Text, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import Loader from '../components/loader';

import { UserContext } from '../context/auth.context';
import { AsyncStorage } from 'react-native';

let ipv4 = /(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])/;

const SettingsScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [ip, setIp] = useState("");
    const user = useContext(UserContext);

    useEffect(() => {
        setLoading(false)
        loadIp();
    }, [SettingsScreen])

    async function loadIp() {
        const ip_load = await AsyncStorage.getItem("ip");
        setIp(ip_load)
    }

    async function saveIp() {
        if (ip.match(ipv4)) {
            await AsyncStorage.setItem(
                'ip',
                ip
            );
            ToastAndroid.showWithGravity(
                'Айпи адрес изменен успешно!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        } else {
            ToastAndroid.showWithGravity(
                'Айпи адрес не валидный',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.page_contanier, styles.content, { height: '100%' }]}>
                <Text style={[styles.title, { marginTop: 0, marginBottom: 20 }]}>Сеть:</Text>
                <Text style={[styles.title, { fontSize: 15, marginBottom: 5 }]}>Айпи адрес</Text>
                <View style={styles.input_contanier}>
                    <TextInput
                        style={styles.input}
                        value={ip}
                        onChangeText={(text) => {
                            setIp(text);
                        }}
                        placeholder="Ip address"
                        placeholderTextColor="#777"
                    />
                    <TouchableOpacity style={styles.button} onPress={() => { saveIp() }}>
                        <Text style={styles.buttonText}>Сохранить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    content: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 0,
        shadowColor: 'transparent',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    container: {
        flex: 1,
        backgroundColor: "white"
    },

    desc: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
        fontFamily: 'Montserrat-Regular'
    },

    page_contanier: {
        flexGrow: 1,
    },

    title: {
        fontSize: 20,
        fontWeight: "300",
        textAlign: 'left',
        color: 'black',
        fontFamily: 'Montserrat-Regular'
    },

    back: {
        marginLeft: "auto",
        padding: 10
    },

    title_contanier: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 15,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)"
    },

    input_contanier: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F4F5',
        paddingHorizontal: 15,
        borderColor: '#F2F4F5',
        borderWidth: 2,
        borderRadius: 20,
        marginHorizontal: 0,
        marginBottom: 20,
        maxHeight: 56
    },
    input: {
        width: "100%",
        height: 56,
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#F2F4F5',
        color: 'black',
    },
})

export default SettingsScreen;