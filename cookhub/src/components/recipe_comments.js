import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Moment from 'moment';

function dateFormate(date) {
    const date = Moment(date)
    if (date.day == new Date().getDay()) {
        return `сегодня в ${date.lang('ru').format('HH:MM')}`
    }

    return Moment(date).lang("ru").format('MMM DD HH:MM')
}

const Comments = ({ comments, level = 0 }) => {
    Moment.locale('ru');
    return (
        <View style={{ marginLeft: level * 20, marginBottom: 10 }}>
            {/* Комментарии */}
            {comments.map((comment, i) => (
                <>
                    <View key={i}>
                        <Text style={styles.avtor}>
                            {comment.name} {comment.surname}
                        </Text>
                        <Text style={styles.commentText}>
                            {comment.text}
                        </Text>
                        <Text style={styles.date}>
                            {dateFormate(comment.date)}
                        </Text>
                    </View>
                    <View style={{ width: "100%", paddingHorizontal: 10, backgroundColor: "#dce0e0", height: 1, marginVertical: 5 }}></View>
                </>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        color: '#333',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    commentText: {
        marginBottom: 5,
    },
    date: {

    },
    avtor: {

    },
    likesCount: {
        color: '#2196F3',
    },
});

export default Comments;