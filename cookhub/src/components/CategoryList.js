import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, ScrollView } from 'react-native';

const CategoryList = ({ openCategories, loadRecipies }) => {
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const scrollViewRef = useRef();

  const handlePress = (index, title) => {
    setLastSelectedIndex(index);
    openCategories(title, cat);
    scrollToIndex(index);
  };

  const scrollToIndex = (index) => {
    scrollViewRef.current.scrollTo({
      x: index * 100, // assuming each element has width of 100
      y: 0,
      animated: true,
    });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.container}>
      {categories.map((category, index) => (
        <TouchableHighlight
          key={index}
          style={[
            styles.category,
            index === lastSelectedIndex && styles.lastSelectedCategory,
          ]}
          onPress={() => handlePress(index, category.title)}>
          <Text>{category.title}</Text>
        </TouchableHighlight>
      ))}
    </ScrollView>
  );
};

const categories = [
  { title: 'Блюдо' },
  { title: 'Обед' },
  { title: 'Завтрак' },
  { title: 'Актуальное' },
];

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
  },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F2F4F5",
    borderRadius: 16,
    marginHorizontal: 4,
  },
  lastSelectedCategory: {
    backgroundColor: '#c9c9c9',
  },
});

export default CategoryList;