import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchBar = ({ value, onChangeText, cartItemCount, onCartPress }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={value}
      placeholder="Rechercher un produit..."
    />
    <TouchableOpacity onPress={onCartPress} style={styles.cartIcon}>
      <MaterialCommunityIcons name="cart" size={24} color="black" />
      {cartItemCount > 0 && (
        <Badge style={styles.badge}>{cartItemCount}</Badge>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  cartIcon: {
    position: 'relative',
    marginLeft: 10,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
  },
});

export default SearchBar;