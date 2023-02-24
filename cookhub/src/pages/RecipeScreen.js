import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, Image, Animated, StyleSheet, TouchableHighlight, Dimensions, TextInput, SafeAreaView } from 'react-native';
import Comments from '../components/recipe_comments';
import RecipeContent from '../components/recipe_content';

const RecipeScreen = () => {
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
        { text: "отличный рецепт", likes: [1003, 4583, 2345], answers: [{ text: "согласен", answers: [], likes: [1003], id: 1003 }], id: 1002 },
        { text: "плохой рецепт", likes: [], answers: [], id: 1034 },
        { text: "норм", likes: [], answers: [], id: 2356 }
    ]

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.page_contanier}>
                <Text style={styles.title}>Салат Цезарь</Text>
                <Image style={styles.image} source={{ uri: "https://www.ermolino-produkty.ru/recipes/picts/recipes/tnw682-670%D1%85430_salat-cezar-s-kuricey.jpg" }} />
                <View style={styles.content}>
                    <Text style={styles.desc}>
                        Простой салат Цезарь с курицей — народный вариант любимого классического блюда.
                        А народное не может быть сложным, поэтому я внес небольшие коррективы. Как известно, традиционный салат славится своей заправкой.
                    </Text>
                    <RecipeContent data={data} />
                    <Comments comments={comments} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: '#000',
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
    },

    page_contanier: {
        flexGrow: 1,
        backgroundColor: 'white',
    },

    title: {
        fontSize: 20,
        fontWeight: "400",
        textAlign: 'left',
        color: 'black',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
    },

    image: {
        width: "100%",
        height: 200,
    }

})

export default RecipeScreen;