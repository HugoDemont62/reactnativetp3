import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Card, Title} from 'react-native-paper';
import SearchBar from './SearchBar';
import {getDatabase, off, onValue, ref, set} from 'firebase/database';
import {getAuth} from 'firebase/auth';

const ProductScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const db = getDatabase();
  const userId = getAuth().currentUser.uid;
  const cartRef = ref(db, 'carts/' + userId);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products').
      then(response => response.json()).
      then(data => setProducts(data));

    const listener = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      setCartItems(data ? data.products : []);
      setCartItemCount(data ? data.products.reduce((total, product) => total + product.quantity, 0) : 0);
    });

    return () => off(cartRef, listener);
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const addToCart = (item) => {
    let newCartItems = [...cartItems];
    const existingItemIndex = newCartItems.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
      newCartItems[existingItemIndex].quantity += 1;
    } else {
      newCartItems.push({ ...item, quantity: 1 });
    }

    setCartItems(newCartItems);

    set(ref(db, 'carts/' + userId), {
        products: newCartItems,
    }).catch((error) => {
      console.error("Error writing to Firebase: ", error);
    });

    setCartItemCount(cartItemCount + 1);
    console.log('Product added to cart:', item);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchValue}
        onChangeText={setSearchValue}
        cartItemCount={cartItemCount}
        onCartPress={() => navigation.navigate('CartScreen')}
      />
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