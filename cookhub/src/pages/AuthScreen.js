import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useAuth } from '../hooks/auth.hook';
import { Loader } from '../components/loader';
import SFButton from '../components/Button/button';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/auth.context';
import InteractiveTextInput from "react-native-text-input-interactive";
import ExStyles from '../styles/global';

const AuthScreen = ({navigation}) => {
    const { isAuthenticated } = useAuth();
    const auth = useContext(AuthContext)
    const {loading, error, request, clearError} = useHttp()
    const [isLogin, setIsLogin] = useState();

    const [form, setForm] = useState({
        name: '', email: '', password: ''
    })
    const [toLogin, setToLogin] = useState({
        login: false
    })    
    const changeHandler = (key, value) => {
        setForm({ ...form, [key]: value })
        console.log(form)
    }
    
    const registerHandler = async () => {
        console.log({...form})
        try {
            const data = await request('/api/auth/register','POST', {...form})
            if (data.message === "User created") { 
                setIsLogin(true);
            }
            console.log(data)
        } catch (e) {
            
        }
    }
    const loginHandler = async () => {
        console.log({...form})
        try {
            const data = await request('/api/auth/login','POST', {...form});
            console.log('login:',data)
            auth.login(data.token, data.userId);
            console.log(isAuthenticated)
            if (!data.message)
                navigation.navigate('home')
        } catch (e) {
            console.log(e)
        }
    }

    //email, password, name, lastname, patronymic, nickname
    return (
        <ScrollView contentContainerStyle={{...styles.container, height: '100%'}}>
            <View style={{ minHeight: "10%" }}>
                <Text style={{...styles.title}}>
                    { isLogin ? "Вход в аккаунт" : "Регестрация аккаунта"}
                </Text>
            </View>
            <View>
                { !isLogin &&
                    <>
                        <TextInput style={ExStyles.input} placeholder='Имя' onChangeText={(text)=>{changeHandler("name", text)}} />
                        <TextInput style={ExStyles.input} placeholder='Фамилия' onChangeText={(text)=>{changeHandler("lastname", text)}}/>
                        <TextInput style={ExStyles.input} placeholder='Отчество' onChangeText={(text)=>{changeHandler("patronymic", text)}}/>
                        <TextInput style={ExStyles.input} placeholder='Ник' onChangeText={(text)=>{changeHandler("nickname", text)}}/>
                    </>
                }
                <TextInput placeholder='Почта' style={ExStyles.input} onChangeText={(text)=>{changeHandler("email", text)}}/>
                <TextInput placeholder='Пароль' style={ExStyles.input} onChangeText={(text)=>{changeHandler("password", text)}}/>
                { !isLogin && <TextInput placeholder='Повторите пароль' style={ExStyles.input} onChangeText={(text)=>{changeHandler("password", text)}}/> }
            </View>

            <View style={{ minHeight: 300, paddingVertical: 25}}>
                { !isLogin && <SFButton title={"Зарегестрироваться"} style={styles.btn} onPress={registerHandler}/> }
                { !isLogin && <SFButton title={"Войти в аккаунт"} style={{...styles.btn}} onPress={()=>{setIsLogin(true)}}/> }

                { isLogin && <SFButton title={"Войти"} style={styles.btn} onPress={loginHandler}/> }
                { isLogin && <SFButton title={"Создать аккаунт"} style={styles.btn} onPress={()=>{setIsLogin(false)}}/>}
            </View>
       </ScrollView>
   );
};
const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        textAlign: 'center',
        color: 'black',
        fontWeight: '400',
    },
    container: {
      flex: 1,

      backgroundColor: "#E4E9F7",
      padding: 20,
      margin: 0,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 3,
        padding: 10,
        marginVertical: 10
    },
    btn: {
        marginVertical: 10
    }
});

export default AuthScreen;