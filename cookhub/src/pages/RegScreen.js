import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { server_ip } from '../api/config';
import InputAuth from '../components/InputAuth';

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
}

const RegScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tag, setTag] = useState('');

    const [error, setError] = useState({});
    
    const handleRegistration = async () => {
        setError({
            name: (name ? "" : "Заполните поле!"),
            surname: (surname ? "" : "Заполните поле!"),
            email: (validateEmail(email) ? "" : "Почта не валидная!"),
            tag: (tag ? "" : "Заполните поле!"),
            password: (validatePassword(password) ? "" : "Минимум 8 символов!"),
        })

        Object.keys(error).map((key) => {
            const item = error[key];
            if (item != '') {
                return false;
            }
        })

        try {
            const response = await axios.post(await server_ip() + '/user_reg', {
                name,
                surname,
                email,
                password,
                tag
            });
            console.log(response.data)
            if (response.data.status == true) {
                navigation.navigate('login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.contanier_scroll}>
                    <Text style={styles.title}>Регистрация</Text>
                    <View style={styles.form}>
                        <InputAuth placeholder="Введите ваше имя" onChangeText={setName} value={name} label={"Имя"} error={error.name} />
                        <InputAuth placeholder="Введите вашу фамилию" onChangeText={setSurname} value={surname} label={"Фамилия"} error={error.surname} />
                        <InputAuth placeholder="Введите ваш тэг" onChangeText={setTag} value={tag} label={"Тэг"} keyboardType={"name"} autoCapitalize="none" error={error.tag} />
                        <InputAuth placeholder="Введите ваш email" onChangeText={setEmail} value={email} label={"Email"} keyboardType={"email-address"} autoCapitalize="none" error={error.email} />
                        <InputAuth placeholder="Введите ваш пароль" onChangeText={setPassword} value={password} label={"Пароль"} secureTextEntry={true} error={error.password} />

                        <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                            <Text style={styles.buttonText}>Зарегистрироваться</Text>
                        </TouchableOpacity>
                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginLinkText}>Уже зарегистрированы?</Text>
                            <TouchableOpacity onPress={()=>{navigation.navigate("login")}}>
                                <Text style={styles.loginLink}> Войти</Text>
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

export default RegScreen;