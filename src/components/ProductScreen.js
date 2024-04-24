import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Card, Title} from 'react-native-paper';
import SearchBar from './SearchBar';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetch('https://fakestoreapi.com/products').
      then(response => response.json()).
      then(data => setProducts(data));
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const addToCart = (item) => {
    console.log('Added to cart:', item);
  };

  return (
    <View style={styles.container}>
      <SearchBar value={searchValue} onChangeText={setSearchValue}/>
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Cover source={{uri: item.image}}/>
              <Card.Content>
                <Title style={styles.title}>{item.title}</Title>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <TouchableOpacity style={styles.button}
                                  onPress={() => addToCart(item)}>
                  <Text style={styles.buttonText}>Add to cart</Text>
                </TouchableOpacity>
              </Card.Actions>
            </Card>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    margin: 10,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 14,
  },
  cardActions: {
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default ProductScreen;