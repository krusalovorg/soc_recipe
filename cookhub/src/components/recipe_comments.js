import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Comments = ({ comments, level = 0 }) => {
    console.log("GETTTTTTTTTTTTT",comments)
    return (
        <View style={{ marginLeft: level * 20, marginBottom: 10 }}>
            {/* Комментарии */}
            {comments.map((comment, i) => (
                <>
                    <View key={i}>
                        <Text style={styles.avtor}>
                            {comment.avtor && comment.avtor.name}
                        </Text>
                        <Text style={styles.commentText}>
                            {comment.text}{' '}
                            {/* {comment.likes.length > 0 && (
                                <Text style={styles.likesCount}>
                                    {comment.likes.length} {comment.likes.length > 1 ? 'лайков' : 'лайк'}
                                </Text>
                            )} */}
                        </Text>

                        {/* {comment.answers.length > 0 && (
                        <Comments comments={comment.answers} level={level + 1} />
                    )} */}
                    </View>
                    <View style={{ width: "100%", paddingHorizontal: 10, backgroundColor: "black", height: 2, marginVertical: 5 }}></View>
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
    avtor: {

    },
    likesCount: {
        color: '#2196F3',
    },
});

export default Comments;