import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, Text, Image, Animated, StyleSheet, TouchableHighlight, Dimensions, TextInput, SafeAreaView } from 'react-native';
import Recipe from '../components/recipe';
import search_png from '../assets/search.png';

const HomeScreen = ({navigation}) => {
    const [findValue, setFindValue] = useState("");
    return (
        <SafeAreaView>
            <ScrollView style={styles.page_contanier}>
                <View style={styles.searchSection}>
                    <TextInput
                        placeholder='Цезарь'
                        value={findValue}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => { setFindValue(text) }}
                    />
                    <Image style={styles.searchIcon} source={search_png} />
                </View>
                <View style={styles.categorys}>
                    <TouchableHighlight style={styles.category}>
                        <Text>
                            Ужин
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category}>
                        <Text>
                            Обед
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category}>
                        <Text>
                            Завтрак
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.category}>
                        <Text>
                            Другое
                        </Text>
                    </TouchableHighlight>
                </View>
                <Text style={styles.title_contanier}>Актуальное</Text>
                <Recipe navigation={navigation}/>
                <Recipe navigation={navigation}/>
                <Recipe navigation={navigation}/>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page_contanier: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    categorys: {
        flexDirection: "row",
        marginTop: 10,
        marginHorizontal: 15
    },
    category: {
        marginHorizontal: 5,
        paddingHorizontal: 20,
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
        marginHorizontal: 15
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