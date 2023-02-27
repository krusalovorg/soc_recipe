import React, { useEffect, useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
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

const RecipeScreen = ({ navigation, route }) => {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [steps, setSteps] = useState([]);
    const [comments, setComments] = useState([]);
    const [like, setLike] = useState(false);
    const user = useContext(UserContext);
    const [likes, setLikes] = useState([]);

    const { token } = useContext(AuthContext);

    const id = route.params;

    const handleInputChange = (value) => {
        setInputValue(value);
    };

    async function handleCommentSubmit() {
        const res = await addComment(id, token, inputValue);
        if (res) {
            setInputValue('');
        }
    };

    async function loadRecipe() {
        const recipe = await getRecipe(id);

        if (recipe) {
            const parsedList = recipe.likes.split('|').filter(Boolean).map(item => parseInt(item));
            setLikes(parsedList);
    
            setData(recipe);

            setComments(recipe.comments);

            console.warn(comments)

            if (parsedList.includes(user.user_id)) {
                setLike(true);
            }
            setSteps([
                { type: "list", list: recipe.steps },
                { type: "table", table: recipe.ingredients },
                { type: "text", text: "Энергетическая ценность:", style: { marginTop: 15, marginBottom: 5 } },
                {
                    type: "table", table: [
                        { name: "Углеводы", amount: recipe.carbohydrates },
                        { name: "Жиры", amount: recipe.fats },
                        { name: "Белки", amount: recipe.proteins },
                        { name: "Калории", amount: recipe.calories },
                    ]
                }]);
        }
        setTimeout(() => {
            setLoading(false);
        }, 500)
    }

    async function updateLike() {
        const res = await likeRecipe(data.id, token);
        if (res) {
            setLike(!like);
        }
    }

    useEffect(() => {
        loadRecipe();
    }, [route.params.data])

    // const data = [
    //     { type: "list", list: ["text1", "text2", "text3"] },
    //     { type: "text", text: "просто текст" },
    //     {
    //         type: "table",
    //         table: [
    //             ['огурец', '10 грамм'],
    //             ['помидор', '1 шт.'],
    //             ['соль', '1 столовая ложка']
    //         ]
    //     }
    // ]

    // const comments = [
    //     { text: "отличный рецепт", avtor: { name: "Egor", id: 100 }, likes: [1003, 4583, 2345], answers: [{ text: "согласен", answers: [], likes: [1003], id: 1003 }], id: 1002 },
    //     { text: "плохой рецепт", avtor: { name: "Egor", id: 100 }, likes: [], answers: [], id: 1034 },
    //     { text: "норм", avtor: { name: "Egor", id: 100 }, likes: [], answers: [], id: 2356 }
    // ]

    function getLikesText() {
        const likesCount = likes.length;
        if (likesCount === 1) {
            return "пользователю";
        } else if (likesCount > 1 && likesCount < 5) {
            return "пользователям";
        } else {
            return "пользователям";
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                resizeMode='cover'
                source={{ uri: server_ip + "/get_image/" + data.image }}
                blurRadius={200}>
                <View style={styles.title_contanier}>
                    <Text style={styles.title}>{data.title}</Text>
                    <TouchableOpacity style={styles.back} onPress={() => { navigation.navigate("home") }}>
                        <Image style={styles.back_image} source={back} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.page_contanier}>
                    <Image style={styles.image} source={{ uri: server_ip + "/get_image/" + data.image }} />
                    <View style={styles.content}>
                        <Text style={styles.desc}>
                            {data.description}
                        </Text>
                        <RecipeContent data={steps} />

                        <Text style={[styles.desc, { marginTop: 20, color: 'black' }]}>Время приготовления: {data.time > 1 ? data.time : data.time * 60} {data.time > 1 ? "час" : "минут"}</Text>
                        <Text style={styles.punkt_desc}>Категория: {data.category}</Text>
                        <Text style={styles.punkt_desc}>Автор: {data.author}</Text>
                        <Text style={styles.punkt_desc}>Просмотров: {data.views}</Text>
                        <Text style={styles.punkt_desc}>Рецепт понравился: {likes.length} {getLikesText()}</Text>
                        <View style={{ marginTop: 7, flexDirection: "row" }}>
                            <Text style={[styles.desc, { color: 'black', marginTop: 10 }]}>Вам понравился рецепт?</Text>
                            <TouchableOpacity onPress={updateLike} style={{ marginLeft: 30 }}>
                                <Image
                                    style={styles.like}
                                    source={like ? like_fill : like_unfill}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Инпут для ввода комментария и кнопка отправки */}
                        <Text style={{ ...styles.title, marginLeft: 0, marginTop: 20, marginBottom: 20 }}>Комментарии</Text>
                        <View style={styles.input_contanier}>
                            <TextInput
                                style={styles.input}
                                value={inputValue}
                                onChangeText={handleInputChange}
                                placeholder="Оставьте комментарий..."
                                placeholderTextColor="#777"
                            />
                            <TouchableOpacity style={styles.button} onPress={handleCommentSubmit}>
                                <Text style={styles.buttonText}>Отправить</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "100%", paddingHorizontal: 10, backgroundColor: "black", height: 2, marginVertical: 5 }}></View>
                        <Comments comments={comments} />
                        <View style={{ width: "100%", paddingHorizontal: 10, height: 100, marginVertical: 5 }}></View>
                    </View>
                </ScrollView>
            </ImageBackground>
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

    punkt_desc: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
        fontFamily: 'Montserrat-Regular',
        marginTop: 5,
        color: 'black'
    },

    like: {
        width: 37,
        height: 46,
        resizeMode: 'contain'
    },

    container: {
        flex: 1,
    },

    desc: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
        fontFamily: 'Montserrat-Regular'
    },

    page_contanier: {
        flexGrow: 1,
        backgroundColor: 'white',
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

    image: {
        width: "100%",
        height: 300,
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
        marginBottom: 20
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
    }

})

export default RecipeScreen;