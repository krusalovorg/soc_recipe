import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Comments = ({ comments, level = 0 }) => {
    // Используем useState hook для управления состоянием input элемента
    const [inputValue, setInputValue] = useState('');

    // Обработчик события изменения значения input элемента
    const handleInputChange = (value) => {
        setInputValue(value);
    };

    // Обработчик события отправки комментария на сервер
    const handleCommentSubmit = () => {
        // отправка комментария на сервер
        setInputValue('');
    };

    return (
        <View style={{ marginLeft: level * 20 }}>
            {/* Комментарии */}
            {comments.map((comment) => (
                <View key={comment.id}>
                    {/* Отображаем текст комментария и количество лайков */}
                    <Text style={styles.commentText}>
                        {comment.text}{' '}
                        {comment.likes.length > 0 && (
                            <Text style={styles.likesCount}>
                                {comment.likes.length} {comment.likes.length > 1 ? 'лайков' : 'лайк'}
                            </Text>
                        )}
                    </Text>

                    {/* Если есть ответы на комментарий, рекурсивно вызываем этот же компонент */}
                    {comment.answers.length > 0 && (
                        <Comments comments={comment.answers} level={level + 1} />
                    )}
                </View>
            ))}
            {/* Инпут для ввода комментария и кнопка отправки */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder="Оставьте комментарий..."
                    placeholderTextColor="#777"
                />
                <TouchableOpacity style={styles.button} onPress={handleCommentSubmit}>
                    <Text style={styles.buttonText}>Отправить</Text>
                </TouchableOpacity>
            </View>

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
    likesCount: {
        color: '#2196F3',
    },
});

export default Comments;