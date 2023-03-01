import React, { useEffect, useState, useContext, useRef, useMemo, useCallback } from 'react';
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
import Recipe from '../components/recipe';
import { getProfile, getProfileId, subscribeUser } from '../api/auth';
import BottomSheet from '@gorhom/bottom-sheet';

function getBackground(value) {
    var minVal = 0;
    var maxVal = 100;

    var minColor = [222, 247, 246]; // #4BD8EA
    var maxColor = [232, 237, 234]; // #4282F6

    var numColors = 33;

    var colorIndex = Math.floor((value - minVal) / (maxVal - minVal) * numColors);
    var colorRange = [
        [minColor[0], minColor[1], minColor[2]],
        [(minColor[0] + maxColor[0]) / 2, (minColor[1] + maxColor[1]) / 2, (minColor[2] + maxColor[2]) / 2],
        [maxColor[0], maxColor[1], maxColor[2]]
    ];

    var red = colorRange[colorIndex][0];
    var green = colorRange[colorIndex][1];
    var blue = colorRange[colorIndex][2];

    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

const ProfileScreen = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [openSubscribers, setOpenSubscribes] = useState(false);
    const [sortedRecipes, setSortRecipes] = useState([]);
    const [profileData, setProfileData] = useState({});
    const user = useContext(UserContext);
    const { token } = useContext(AuthContext);

    const { tag, type } = route.params;

    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => ['1%', '23%', '50'], []);

    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
        if (index == 0)
            setOpenSubscribes(false);
    }, []);

    async function loadProfile() {
        let profile;
        if (type == "forme" || tag == user.tag) {
            profile = await getProfile(token);
            setProfileData({...user, ...profile});
            setLoading(false)
        } else {
            profile = await getProfileId(token, tag);
            setProfileData(profile);
            setLoading(false)
        }

        setSortRecipes(profile.recipes.sort((a, b) => {
            if (a.views > b.views) {
                return -1;
            }
            if (a.views < b.views) {
                return 1;
            }
            return 0;
        }))
    }

    useEffect(() => {
        loadProfile();
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
                    <Text style={styles.title}>@{tag}</Text>
                    <TouchableOpacity style={styles.back} onPress={() => {
                        navigation.navigate("home")
                    }}>
                        <Image style={styles.back_image} source={back} />
                    </TouchableOpacity>
                </View>
                {/* <SubscribersBlock open={openSubscribers} setOpen={setOpenSubscribes} type={type} user={user}/> */}
                { openSubscribers &&
                    <View style={styles.bottom_sheep}>
                        <BottomSheet
                            ref={bottomSheetRef}
                            index={1}
                            snapPoints={snapPoints}
                            onChange={handleSheetChanges}
                        >
                            <View style={styles.bottom_sheep_content}>
                                {/* {type != 'forme' &&
                                    <Text style={[styles.title, { marginBottom: 20 }]}>
                                        Подписчики пользователя @{tag}:
                                    </Text>} */}
                                <ScrollView>
                                    {profileData.likes.length == 0 ? (
                                        <Text style={[styles.title]}>
                                            {type == 'forme'
                                                ? `У вас нет подписчиков`
                                                : `Нет подписчиков`}
                                        </Text>
                                    ) : (
                                        profileData.likes.map((item) => {
                                            return item;
                                        })
                                    )}
                                </ScrollView>
                            </View>
                        </BottomSheet>
                    </View>
                }
                <ScrollView style={styles.page_contanier}>
                    <View style={[styles.ava, { backgroundColor: getBackground(profileData.recipes.length) }]}>
                        <Text style={[styles.title, { color: "black", fontSize: 25 }]}>{formateName(profileData.name)} {formateName(profileData.surname)}</Text>
                        <View style={{
                            width: 700,
                            flexDirection: "row",
                            flexWrap: 'wrap',
                            alignContent: "space-between"
                        }}>
                            {type == "forme" && <Text style={[styles.title, { color: "black", fontSize: 14, flex: 1 }]}>{profileData.email}</Text>}
                            <Text style={[styles.title, { fontSize: 14, flex: 2 }]} onPress={() => {
                                setOpenSubscribes(true);
                                console.log(openSubscribers)
                            }}>Подписчиков: {profileData.likes.length}</Text>
                        </View>
                    </View>
                    <TouchableHighlight style={styles.subscribe} onPress={()=>{
                        console.log(profileData.likes)
                        subscribeUser(token, tag);
                    }}>
                        <Text style={styles.textSubscribe}>Подписаться</Text>
                    </TouchableHighlight>
                    <View style={styles.content}>
                        <Text style={[styles.title, { marginBottom: 20 }]}>Популярные рецепты:</Text>
                        {
                            sortedRecipes.map((item) => {
                                console.log(item)
                                return <Recipe key={item.id} data={item} navigation={navigation} />
                            })
                        }
                        <View style={{ minHeight: 100 }}></View>
                    </View>
                </ScrollView>
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
    },
    subscribe: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#3A89FF",
        width: "100%",
        borderBottomColor: "black",
        borderBottomWidth: 1

    },
    textSubscribe: {
        color: "white"
    },
    bottom_sheep: {
        flex: 3,
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 100,
        height: Dimensions.get('window').height
    },
    bottom_sheep_content: {
        padding: 24,
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
})

export default ProfileScreen;