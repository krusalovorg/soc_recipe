import React, { useEffect, useState, useContext } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { ScrollView, View, Text, Image, Animated, StyleSheet, TouchableHighlight, Dimensions, TextInput, SafeAreaView } from 'react-native';
import Comments from '../components/recipe_comments';
import RecipeContent from '../components/recipe_content';
import blur2 from '../assets/blur2.jpg';
import back from '../assets/back.png';

const RecipeScreen = ({ navigation }) => {
    const [inputValue, setInputValue] = useState('');

    // Обработчик события изменения значения input элемента
    const handleInputChange = (value) => {
        setInputValue(value);
    };

    // Обработчик события отправки комментария на сервер
    const handleCommentSubmit = () => {
        // отправка комментария на сервер
        setInputValue('');
    };

    const data = [
        { type: "list", list: ["text1", "text2", "text3"] },
        { type: "text", text: "просто текст" },
        {
            type: "table",
            table: [
                ['огурец', '10 грамм'],
                ['помидор', '1 шт.'],
                ['соль', '1 столовая ложка']
            ]
        }
    ]

    const comments = [
        { text: "отличный рецепт", avtor: { name: "Egor", id: 100 }, likes: [1003, 4583, 2345], answers: [{ text: "согласен", answers: [], likes: [1003], id: 1003 }], id: 1002 },
        { text: "плохой рецепт", avtor: { name: "Egor", id: 100 }, likes: [], answers: [], id: 1034 },
        { text: "норм", avtor: { name: "Egor", id: 100 }, likes: [], answers: [], id: 2356 }
    ]

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                resizeMode='cover'
                source={{ uri: "https://www.ermolino-produkty.ru/recipes/picts/recipes/tnw682-670%D1%85430_salat-cezar-s-kuricey.jpg" }}
                blurRadius={200}>
                <View style={styles.title_contanier}>
                    <Text style={styles.title}>Салат Цезарь</Text>
                    <TouchableOpacity style={styles.back} onPress={() => { navigation.goBack() }}>
                        <Image style={styles.back_image} source={back} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.page_contanier}>
                    <Image style={styles.image} source={{ uri: "https://www.ermolino-produkty.ru/recipes/picts/recipes/tnw682-670%D1%85430_salat-cezar-s-kuricey.jpg" }} />
                    <View style={styles.content}>
                        <Text style={styles.desc}>
                            Простой салат Цезарь с курицей — народный вариант любимого классического блюда.
                            А народное не может быть сложным, поэтому я внес небольшие коррективы. Как известно, традиционный салат славится своей заправкой.
                        </Text>
                        <RecipeContent data={data} />


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