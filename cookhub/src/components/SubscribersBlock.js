import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ScrollView, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import AnimatedPanel from './AnimatedPanel';

const SubscribersBlock = ({ open, setOpen, type, user }) => {
    return (
        <AnimatedPanel open={open} setOpen={setOpen} height={500}>
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
        </AnimatedPanel>
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