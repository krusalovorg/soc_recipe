import React from "react";
import { TextInput, StyleSheet, Image, Text, View, TouchableHighlight } from "react-native";
import { server_ip } from "../api/config";

function getLikesText(likesCount) {
    if (likesCount === 1) {
        return "лайк";
    } else if (likesCount > 1 && likesCount < 5) {
        return "лайка";
    } else {
        return "лайков";
    }
}

function Recipe(props) {
    const parsedList = props.data.likes.split('|').filter(Boolean).map(item => parseInt(item));

    return (
        <>
            <TouchableHighlight
                style={styles.touch}
                onPress={() => {
                    props.navigation.dispatch(NavigationActions.reset(
                        {
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'recipe', data: props.data.id })
                            ]
                        }));

                    // props.navigation.navigate('recipe', { data: props.data.id })
                }}>
                <View style={styles.contanier}>
                    <Image style={styles.image} source={{ uri: server_ip + "/get_image/" + props.data.image }} />
                    <View style={styles.content}>
                        <Text style={styles.title}>{props.data.title}</Text>
                        <Text style={styles.name}>{props.data.author}</Text>
                        <Text style={styles.views}>{props.data.views} просмотров</Text>
                        <Text style={styles.views}>{parsedList.length} {getLikesText(parsedList.length)}</Text>
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