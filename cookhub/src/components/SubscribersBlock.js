import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, Animated, PanResponder, StyleSheet } from 'react-native';

const SubscribersBlock = ({ openSubscribers, type, user, onClose }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const [isFirstRender, setIsFirstRender] = useState(true);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return gestureState.dy > 0 && gestureState.dy > Math.abs(gestureState.dx);
            },
            onPanResponderMove: Animated.event(
                [null, { dy: translateY }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > 50) {
                    Animated.timing(translateY, {
                        toValue: 500,
                        duration: 300,
                        useNativeDriver: false,
                    }).start(onClose);
                } else {
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        if (openSubscribers) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: 500,
                duration: 300,
                useNativeDriver: false,
            }).start(onClose);
        }
    }, [openSubscribers]);

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={{
                opacity: translateY.interpolate({
                    inputRange: [0, 500],
                    outputRange: [1, 0],
                }),
                transform: [{ translateY }],
                position: 'absolute',
                top: 56,
                left: 0,
                zIndex: 1,
                paddingLeft: 15,
                paddingTop: 20,
                backgroundColor: 'white',
                height: '100%',
                width: '100%',
            }}>
            <Text style={[styles.title, { marginBottom: 20 }]}>
                {type == 'forme'
                    ? `Ваши подписчики`
                    : `Подписчики пользователя @${user.tag}`}
                :
            </Text>
            <ScrollView>
                {user.likes.length == 0 ? (
                    <Text style={[styles.title, { marginTop: 20 }]}>
                        {type == 'forme'
                            ? `У вас нет подписчиков`
                            : `Нет подписчиков`}
                    </Text>
                ) : (
                    user.likes.map((item) => {
                        return item;
                    })
                )}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "300",
        textAlign: 'left',
        color: 'black',
        fontFamily: 'Montserrat-Regular'
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
export default SubscribersBlock;