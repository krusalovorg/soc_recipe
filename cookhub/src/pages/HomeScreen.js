import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, Image, Animated, StyleSheet, TouchableHighlight, Dimensions, TextInput, SafeAreaView, RefreshControl } from 'react-native';
import Recipe from '../components/recipe';
import search_png from '../assets/search.png';
import { getRecipies, searchRecipe, searchRecipeOnlyCategorys } from '../api/recipes';
import Loader from '../components/loader';
import User from '../components/user';
import { AuthContext } from '../context/auth.context';
import CategoryList from '../components/CategoryList';

const HomeScreen = ({ navigation, route }) => {
    const [findValue, setFindValue] = useState(null);
    const [recipies, setRecipies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchRecipies, setSearchRecipes] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [title, setTitle] = useState("Актуальное");

    const { token } = useContext(AuthContext);

    async function loadRecipies() {
        setRefreshing(true);
        setTitle("Актуальное");
        const recipies = await getRecipies(token);
        if (recipies && recipies.length > 0) {
            setRecipies(recipies);
        }
        setLoading(false);
        setRefreshing(false);
    }

    async function handleRefresh() {
        setRecipies([]);
        await loadRecipies();
        setRefreshing(false);
    };

    async function searchRecipeLive(text, filters = [], categories = []) {
        const recipes = await searchRecipe(text, filters, categories);
        setSearchRecipes(recipes.recipes);
        setSearchUsers(recipes.users)
        setLoading(false);
    }

    async function loadRecipesWithCategories(text, categories) {
        const recipes = await searchRecipeOnlyCategorys(text, categories);
        if (recipes != null && typeof recipes.recipes != undefined) {
            console.log("GET", text, categories, recipes.recipes)
            setRecipies(recipes.recipes);
            console.log('EXIT', recipies)
        } else {
            setRecipies([])
        }
        setLoading(false);
    }

    useEffect(() => {
        if (route.params && route.params.categories) {
            console.log(route.params);
            loadRecipesWithCategories("", route.params.categories);
        } else {
            loadRecipies();
        }
    }, [HomeScreen]);

    async function openCategories(cat, title) {
        setTitle(title)
        setRecipies([]);
        await loadRecipesWithCategories("", [cat]);
        setLoading(false);
    }

    if (loading) {
        return <Loader />
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white', height: '100%' }}>
            <ScrollView
                style={styles.page_contanier}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#0080ff']}
                    />
                }
            >
                <View style={styles.searchSection}>
                    <TextInput
                        placeholder={'Салат..'}
                        value={findValue}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => {
                            setFindValue(text);
                            searchRecipeLive(text);
                        }}
                    />
                    <Image style={styles.searchIcon} source={search_png} />
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categories}>
                    <TouchableHighlight style={styles.category} onPress={() => loadRecipies()}>
                        <Text>
                            Актуальное
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category} onPress={() => openCategories("Ужин", "Блюда на ужин")}>
                        <Text>
                            Ужин
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category} onPress={() => openCategories("Обед", "Блюда на обед")}>
                        <Text>
                            Обед
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category} onPress={() => openCategories("Завтрак", "Блюда на завтрак")}>
                        <Text>
                            Завтрак
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category} onPress={() => openCategories("Вегетарианское", "Блюда вегатерианские")}>
                        <Text>
                            Вегетарианское
                        </Text>
                    </TouchableHighlight>
                </ScrollView>
                <View style={{ width: "100%", paddingHorizontal: 10, backgroundColor: "#F2F4F5", height: 2, marginVertical: 5 }}></View>
                <Text style={styles.desc_c}>Калорийность</Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categories}>
                    <TouchableHighlight style={styles.category} onPress={() => openCategories("200k", "Блюда для похудения")}>
                        <Text>
                            Похудение
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category} onPress={() => openCategories("300k", "Блюда сбалансированные")}>
                        <Text>
                            Сбалансированное
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category} onPress={() => openCategories("400k", "Блюда до 400 калорий")}>
                        <Text>
                            До 400
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category} onPress={() => openCategories("500k", "Блюда до 500 калорий")}>
                        <Text>
                            До 500
                        </Text>
                    </TouchableHighlight>
                </ScrollView>
                {findValue != null && findValue != "" && searchRecipies != undefined &&
                    <View>
                        <Text style={styles.title_contanier}>{(searchRecipies.length == 0 && searchUsers.length == 0) ? "Ничего не найдено по запросу" : "Поиск по запросу"}: {findValue.toString()}</Text>
                        {
                            searchUsers.map((item) => {
                                return <User key={item.id} data={item} navigation={navigation} />
                            })
                        }
                        {
                            searchRecipies.map((item) => {
                                return <Recipe key={item.id} data={item} navigation={navigation} />
                            })
                        }
                    </View>
                }
                <View style={{ width: "100%", paddingHorizontal: 10, backgroundColor: "#F2F4F5", height: 2, marginVertical: 5 }}></View>
                <Text style={styles.title_contanier}>{title}</Text>
                {
                    recipies.map((item) => {
                        return <Recipe key={item.id} data={item} navigation={navigation} />
                    })
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page_contanier: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    categories: {
        flexDirection: "row",
        marginTop: 10,
        marginHorizontal: 15
    },
    category: {
        marginRight: 4,
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: "#F2F4F5",
        borderRadius: 20,
    },
    title_contanier: {
        fontSize: 20,
        fontWeight: "400",
        textAlign: 'left',
        color: 'black',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        fontFamily: 'Montserrat-Regular'
    },

    desc_c: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        fontWeight: "400",
        paddingLeft: 10
    },

    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F4F5',
        paddingHorizontal: 20,
        borderColor: '#F2F4F5',
        borderWidth: 2,
        borderRadius: 20,
        marginHorizontal: 15,
        marginTop: 10
    },
    searchIcon: {
        padding: 10,
        width: 20,
        height: 20
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

export default HomeScreen;