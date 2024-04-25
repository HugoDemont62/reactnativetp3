import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {getDatabase, off, onValue, ref} from 'firebase/database';
import {getAuth} from 'firebase/auth';
import {Card, Title} from 'react-native-paper';

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const userId = getAuth().currentUser.uid;
    const cartRef = ref(db, 'carts/' + userId);

    const listener = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      setCartItems(data ? data.products : []);
      setCartItemCount(data ? data.products.reduce((total, product) => total + product.quantity, 0) : 0);
    }, (error) => {
      console.error("Error reading from Firebase: ", error);
    });

    return () => off(cartRef, listener);
  }, []);

  const increaseQuantity = (item) => {
    let newCart = [...cart];
    const existingItemIndex = newCart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
      newCart[existingItemIndex].quantity += 1;
    }

    setCart(newCart);
  };

  const decreaseQuantity = (item) => {
    let newCart = [...cart];
    const existingItemIndex = newCart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1 && newCart[existingItemIndex].quantity > 1) {
      newCart[existingItemIndex].quantity -= 1;
    } else if (existingItemIndex > -1 && newCart[existingItemIndex].quantity === 1) {
      newCart = newCart.filter(cartItem => cartItem.id !== item.id);
    }

    setCart(newCart);
  };

  const clearCart = () => {
    setCart([])
  }

  return (
    <View>
      <TouchableOpacity onPress={clearCart}>
        <Text>Clear Cart</Text>
      </TouchableOpacity>
      <FlatList
        data={cart}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Cover source={{uri: item.image}}/>
              <Card.Content>
                <Title style={styles.title}>{item.title}</Title>
                <Text>Quantity: {item.quantity}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(item)}>
                  <Text>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => decreaseQuantity(item)}>
                  <Text>-</Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 10,
  },
  card: {
    width: 150,
  },
  title: {
    fontSize: 16,
  },
});

export default CartScreen;