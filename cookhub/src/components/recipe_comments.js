import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

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
            {/* Инпут для ввода комментария и кнопка отправки */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    style={{ flex: 1, marginRight: 10 }}
                    value={inputValue}
                    onChangeText={handleInputChange}
                />
                <TouchableOpacity onPress={handleCommentSubmit}>
                    <Text>Отправить</Text>
                </TouchableOpacity>
            </View>
            {/* Комментарии */}
            {comments.map((comment) => (
                <View key={comment.id}>
                    {/* Отображаем текст комментария и количество лайков */}
                    <Text>
                        {comment.text}{' '}
                        {comment.likes.length > 0 && `${comment.likes.length} лайка`}
                    </Text>

                    {/* Если есть ответы на комментарий, рекурсивно вызываем этот же компонент */}
                    {comment.answers.length > 0 && (
                        <Comments comments={comment.answers} level={level + 1} />
                    )}
                </View>
            ))}
        </View>
    );
};

export default Comments;