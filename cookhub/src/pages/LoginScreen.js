import axios from 'axios';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, AsyncStorage } from 'react-native';
import { server_ip } from '../api/config';
import InputAuth from '../components/InputAuth';
import { Cache } from "react-native-cache";
import { AuthContext } from '../context/auth.context';

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const LoginScreen = ({ navigation }) => {
    const { checkLogin } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState({ email: '' });

    const cache = new Cache({
        namespace: "auth",
        policy: {
            maxEntries: 50000,
            stdTTL: 0
        },
        backend: AsyncStorage
    });

    const handleLogin = async () => {
        // setError({
        //     email: (validateEmail(email) ? "" : "Почта не валидная!"),
        // })

        try {
            const response = await axios.post(server_ip + '/user_login', {
                email,
                password,
            });
            if (response.data.status == true) {
                cache.set('token', response.data.sshkey)
                checkLogin();

            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.contanier_scroll}>
                    <Text style={styles.title}>Вход</Text>
                    <View style={styles.form}>
                        <InputAuth placeholder="Введите ваш email" onChangeText={setEmail} value={email} label={"Email"} keyboardType={"email-address"} autoCapitalize="none" error={error.email} />
                        <InputAuth placeholder="Введите ваш пароль" onChangeText={setPassword} value={password} label={"Пароль"} secureTextEntry={true} />

                        <TouchableOpacity style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Войти</Text>
                        </TouchableOpacity>
                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginLinkText}>Нет аккаунта?</Text>
                            <TouchableOpacity onPress={() => { navigation.navigate("reg") }}>
                                <Text style={styles.loginLink}> Зарегистрироваться</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView></SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contanier_scroll: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 50
    },
    title: {
        fontSize: 24,
        color: '#333333',
        fontFamily: "Montserrat-Bold",
        marginBottom: 30,
    },
    form: {
        width: '80%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 10,
        fontFamily: "Montserrat-Regular",
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 10,
        borderRadius: 8
    },
    button: {
        backgroundColor: '#FFA500',
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginLinkText: {
        fontSize: 16,
        color: '#666666',
    },
    loginLink: {
        fontSize: 16,
        color: '#FFA500',
    },
});

export default LoginScreen;