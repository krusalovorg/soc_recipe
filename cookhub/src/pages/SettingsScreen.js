import React, { useEffect, useState, useContext, useRef } from 'react';
import { FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { ScrollView, View, Text, Image, Animated, StyleSheet, TouchableHighlight, Dimensions, TextInput, SafeAreaView } from 'react-native';

import Loader from '../components/loader';

import { UserContext } from '../context/auth.context';

const SettingsScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const user = useContext(UserContext);

    useEffect(() => {
        setLoading(false)
    }, [SettingsScreen])

    if (loading) {
        return <Loader />
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.page_contanier, styles.content, { height: '100%' }]}>
                <View style={styles.input_contanier}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={(text) => {
                            setText(text);
                        }}
                        placeholder="Ip address"
                        placeholderTextColor="#777"
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Сохранить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    content: {
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

    back_image: {
        width: 20,
        height: 20,
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
        flex: 1,
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
        height: 50
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