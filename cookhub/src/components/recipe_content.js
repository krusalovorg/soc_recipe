import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RecipeContent = ({ data }) => {
    const renderList = () => {
        return data.map((item, index) => {
            if (item.type === 'list') {
                return (
                    <View key={index} style={styles.listContainer}>
                        {item.list.map((listItem, i) => {
                            return (
                                <Text key={i} style={styles.listItem}>
                                    {`${i + 1}. ${listItem.text}`}
                                </Text>
                            );
                        })}
                    </View>
                );
            } else if (item.type === 'text') {
                return (
                    <Text key={index} style={[styles.text, item.style]}>
                        {item.text}
                    </Text>
                );
            } else if (item.type === 'table') {
                return (
                    <View key={index} style={styles.tableContainer}>
                        {item.table.map((row, i) => {
                            return (
                                <View key={i} style={styles.tableRow}>
                                    <Text style={[styles.tableCell]}>
                                        {row.name}
                                    </Text>
                                    <Text style={[styles.tableCell]}>
                                        {row.amount}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                );
            }
        });
    };

    return <View>{renderList()}</View>;
};

const styles = StyleSheet.create({
    listContainer: {
        marginVertical: 10,
        marginLeft: 15
    },
    listItem: {
        fontSize: 16,
        lineHeight: 24,
        marginVertical: 5,
        color: 'black',
        fontFamily: 'Montserrat-Regular'
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 10,
        fontFamily: 'Montserrat-Regular'
    },
    tableContainer: {
        marginTop: 10,
        borderWidth: 2,
        borderColor: 'black',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    tableCell: {
        fontSize: 16,
        lineHeight: 24,
        color: "black"
    },
});

export default RecipeContent;