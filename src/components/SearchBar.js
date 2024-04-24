import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const SearchBar = ({ value, onChangeText }) => (
  <TextInput
    style={styles.input}
    onChangeText={onChangeText}
    value={value}
    placeholder="Rechercher un produit..."
  />
);

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
});

export default SearchBar;