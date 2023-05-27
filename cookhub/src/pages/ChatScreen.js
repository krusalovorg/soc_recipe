import React, { useEffect, useState, useContext, useRef } from 'react';
import { FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import { ScrollView, View, Text, Image, Animated, StyleSheet, TouchableHighlight, Dimensions, TextInput, SafeAreaView } from 'react-native';
import Comments from '../components/recipe_comments';
import RecipeContent from '../components/recipe_content';
import blur2 from '../assets/blur2.jpg';
import back from '../assets/back.png';

import like_fill from '../assets/like_fill.png';
import like_unfill from '../assets/like_unfill.png';

import Loader from '../components/loader';
import { addComment, getRecipe, likeRecipe } from '../api/recipes';
import { server_ip } from '../api/config';

import { AuthContext, UserContext } from '../context/auth.context';

import { formateName } from '../utils/formate';
import Recipe from '../components/recipe';
import { getProfile, getProfileId } from '../api/auth';
import { sendMessage } from '../api/chat';

const ChatScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState([{ from: 'bot', text: "Привет! Я могу помочь найти рецепты, обратись ко мне - \'найди рецепт ингредиенты\'." }]);
    const [text, setText] = useState("");
    const user = useContext(UserContext);
    const { token } = useContext(AuthContext);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef();

    function updateAnim() {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }
        ).start();
    }

    useEffect(() => {
        updateAnim()
    }, [dialog, fadeAnim]);

    async function handleChatSubmit() {
        if (text.length > 0) {
            const msg = await sendMessage(token, text);
            console.log('get', msg)
            setDialog([...dialog, { 'from': "@" + user.tag, text }, msg['answer']])
            updateAnim();
            setText("");
        }
    }

    useEffect(() => {
        setLoading(false)
    }, [ChatScreen])

    if (loading) {
        return <Loader />
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                resizeMode='cover'
                // source={{ uri: server_ip + "/get_image/" + data.image }}
                blurRadius={200}>
                {/* <ScrollView style={styles.page_contanier}> */}
                <View style={[styles.page_contanier, styles.content, { height: '100%' }]}>
                    {/* {dialog.length > 0 &&
                            dialog.map((item, index) => {
                                if (item && item.answer && item.answer.data) {
                                    return (
                                        <>
                                            <Text key={index}>{item.answer.from}: {item.answer.text}</Text>
                                            {item.answer.data.map((recipe) => {
                                                if (recipe)
                                                    return <Recipe key={recipe.id} data={recipe} navigation={navigation} />
                                            })}
                                        </>)
                                } else if (item.answer) {
                                    return <Text key={index}>{item.answer.from}: {item.answer.text}</Text>
                                }
                            })
                        } */}
                    <FlatList
                        data={dialog}
                        style={{
                            maxHeight: "83%"
                        }}
                        renderItem={({ item }) => {
                            if (item != null && item) {
                                if (item.data) {
                                    return (
                                        <>
                                            <Animated.View style={{ opacity: fadeAnim }}>
                                                <Text style={{ fontSize: 20, color: "black", marginTop: 5 }}>{item.from == 'bot' ? "CookHub" : item.from}</Text>
                                                <View style={styles.message}>
                                                    <Text>{item.text}</Text>
                                                </View>
                                                {item.data.map((recipe) => {
                                                    if (recipe)
                                                        return <Recipe key={recipe.id} data={recipe} navigation={navigation} />
                                                })}
                                            </Animated.View>
                                        </>)
                                } else {
                                    return (
                                        <>
                                            <Animated.View style={{ opacity: fadeAnim }}>
                                                <Text style={{ fontSize: 20, color: "black", marginTop: 5 }}>{item.from == 'bot' ? "CookHub" : item.from}</Text>
                                                <View style={styles.message}>
                                                    <Text>{item.text}</Text>
                                                </View>
                                            </Animated.View>
                                        </>)
                                }
                            }
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                        ref={flatListRef}
                    />
                    <View style={styles.input_contanier}>
                        <TextInput
                            style={styles.input}
                            value={text}
                            onChangeText={(text) => {
                                setText(text);
                            }}
                            placeholder="Задайте вопрос.."
                            placeholderTextColor="#777"
                        />
                        <TouchableOpacity style={styles.button} onPress={handleChatSubmit}>
                            <Text style={styles.buttonText}>Отправить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* </ScrollView> */}
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    ava: {
        width: "100%",
        height: 150,
        backgroundColor: "black",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingLeft: 20,
        paddingBottom: 20,
        borderBottomColor: "black",
        borderBottomWidth: 1
    },
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

        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,

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

    message: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f2f2f2',
        borderRadius: 16,
        marginVertical: 4,
    },

})

export default ChatScreen;