import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import axios from 'axios';

const RegScreen = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tag, setTag] = useState('');

    const handleRegistration = async () => {
        try {
            const response = await axios.post('https://localhost:8000/api/user_reg', {
                name,
                surname,
                email,
                password,
                tag
            }, {method: 'POST'});
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Имя</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите ваше имя"
                        onChangeText={setName}
                        value={name}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Фамилия</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите вашу фамилию"
                        onChangeText={setSurname}
                        value={surname}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите ваш email"
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Тэг</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите ваш тэг"
                        onChangeText={setTag}
                        value={tag}
                        keyboardType="default"
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Пароль</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите ваш пароль"
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                    <Text style={styles.buttonText}>Зарегистрироваться</Text>
                </TouchableOpacity>
                <View style={styles.loginLinkContainer}>
                    <Text style={styles.loginLinkText}>Уже зарегистрированы?</Text>
                    <TouchableOpacity>
                        <Text style={styles.loginLink}> Войти</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
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