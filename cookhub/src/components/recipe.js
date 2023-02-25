import React from "react";
import { TextInput, StyleSheet, Image, Text, View, TouchableHighlight } from "react-native";

function Recipe(props) {
    return (
        <>
            <TouchableHighlight
                style={styles.touch}
                onPress={() => {
                    props.navigation.navigate('recipe')
                }}>
                <View style={styles.contanier}>
                    <Image style={styles.image} source={{ uri: "https://www.ermolino-produkty.ru/recipes/picts/recipes/tnw682-670%D1%85430_salat-cezar-s-kuricey.jpg" }} />
                    <View style={styles.content}>
                        <Text style={styles.title}>{props.data.title}</Text>
                        <Text style={styles.name}>{props.data.author}</Text>
                        <Text style={styles.views}>{props.data.views} просмотров</Text>
                        <Text style={styles.views}>{props.data.likes} лайков</Text>
                    </View>
                </View>
            </TouchableHighlight>

            <View style={{ width: "100%", paddingHorizontal: 10, backgroundColor: "#F2F4F5", height: 2, marginVertical: 5 }}></View>
        </>
    )
}

const styles = StyleSheet.create({
    touch: {
        marginVertical: 10,
    },
    contanier: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingHorizontal: 15
    },
    image: {
        height: 150,
        width: 150,
        borderRadius: 20
    },
    content: {
        paddingHorizontal: 20
    },
    title: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'Montserrat-Medium'
    },
    views: {
        marginTop: 10
    },
    name: {
        fontSize: 15,
        fontFamily: 'Lato-Regular'
    }
})

export default Recipe;