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

import { formateName } from '../utils/formate';

function getBackground(value) {
    var minVal = 0;
    var maxVal = 100;

    var minColor = [222, 247, 246]; // #4BD8EA
    var maxColor = [232, 237, 234]; // #4282F6

    var red = ((maxColor[0] - minColor[0]) * (value - minVal)) / (maxVal - minVal) + minColor[0];
    var green = ((maxColor[1] - minColor[1]) * (value - minVal)) / (maxVal - minVal) + minColor[1];
    var blue = ((maxColor[2] - minColor[2]) * (value - minVal)) / (maxVal - minVal) + minColor[2];

    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

const ProfileScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const user = useContext(UserContext);
    const { token } = useContext(AuthContext);

    const { id, type } = route.params;

    useEffect(() => {
        // loadRecipe();
        setLoading(false)
        console.log(user)
    }, [route.params.data])

    if (loading) {
        return <Loader />
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                resizeMode='cover'
                // source={{ uri: server_ip + "/get_image/" + data.image }}
                blurRadius={200}>
                <View style={styles.title_contanier}>
                    <Text style={styles.title}>@{user.tag}</Text>
                    <TouchableOpacity style={styles.back} onPress={() => {
                        navigation.navigate("home")
                    }}>
                        <Image style={styles.back_image} source={back} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.page_contanier}>
                    <View style={[styles.ava, { backgroundColor: getBackground(user.recipes.length) }]}>
                        <Text style={[styles.title, { color: "black", fontSize: 25 }]}>{formateName(user.name)} {formateName(user.surname)}</Text>
                        {type == "forme" && <Text style={[styles.title, { color: "black", fontSize: 14 }]}>{user.email}</Text>}
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.title}>Популярные рецепты:</Text>
                        {
                            user.recipes.map((item) => {
                                console.log(item)
                                return <Recipe key={item.id} data={item} navigation={navigation} />
                            })
                        }
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    ava: {
        width: "100%",
        height: 200,
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
        height: "100%",
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
})

export default ProfileScreen;