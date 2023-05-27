import React from "react";
import { useState } from "react";
import { TextInput, StyleSheet, Image, Text, View, TouchableHighlight, ActivityIndicator } from "react-native";
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
    const [loading, setLoading] = useState(true);
    // const parsedList = props.data.likes.split('|').filter(Boolean).map(item => parseInt(item));

    function onLoadEnd() {
        setLoading(false);
    }

    return (
        <>
            <TouchableHighlight
                style={styles.touch}
                onPress={() => {
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'recipe', params: props.data.id }]
                    })
                    // props.navigation.navigate('recipe', { data: props.data.id })
                }}>
                <View style={styles.contanier}>
                    <Image
                        style={[styles.image, (loading?{width: 0, height: 0}:{})]}
                        onLoadEnd={onLoadEnd}
                        source={{ uri: server_ip + "/get_image/" + props.data.image }} />
                    <ActivityIndicator
                        style={[styles.activityIndicator, (loading?{}:{width: 0, height: 0})]}
                        animating={loading}
                        size={70}
                    />
                    <View style={styles.content}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{props.data.title}</Text>
                        <Text style={styles.name}>@{props.data.author}</Text>
                        <Text style={styles.views}>{props.data.views} просмотров</Text>
                        <Text style={styles.views}>{props.data.likes} {getLikesText(props.data.likes)}</Text>
                    </View>
                </View>
            </TouchableHighlight>

            <View style={{ width: "100%", paddingHorizontal: 10, backgroundColor: "#F2F4F5", height: 2, marginVertical: 5 }}></View>
        </>
    )
}

const styles = StyleSheet.create({
    activityIndicator: {
        width: 150,
        height: 150,
        paddingBottom: 20,
        color: "black"
    },
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
        fontFamily: 'Montserrat-Medium',
        textOverflow: 'ellipsis',
        width: '100%',
        maxWidth: 195
    },
    views: {
        marginTop: 4
    },
    name: {
        fontSize: 15,
        fontFamily: 'Lato-Regular'
    }
})

export default Recipe;