import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export default function InputAuth(props) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                style={styles.input}
                placeholder={props.placeholder}
                onChangeText={props.onChangeText}
                keyboardType={props.keyboardType}
                value={props.value}
                {...props}
            />
            {props.error != '' && <Text style={[styles.label, { color: 'red', marginBottom: 0 }]}>{props.error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 10,
        fontFamily: "Montserrat-Regular",
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 10,
        borderRadius: 8
    },
});