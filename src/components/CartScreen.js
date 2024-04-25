import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getDatabase, off, onValue, ref, set} from 'firebase/database';
import {getAuth} from 'firebase/auth';
import {Card, Title} from 'react-native-paper';

const CartScreen = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const userId = getAuth().currentUser.uid;
  const db = getDatabase();

  useEffect(() => {
    const cartRef = ref(db, 'carts/' + userId);

    const listener = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      setCartItems(data ? data.products : []);
      setCartItemCount(data ? data.products.reduce(
        (total, product) => total + product.quantity, 0) : 0);
    }, (error) => {
      console.error('Error reading from Firebase: ', error);
    });
    return () => off(cartRef, listener);
  }, []);

  const increaseQuantity = (item) => {
    let newCartItems = [...cartItems];
    const existingItemIndex = newCartItems.findIndex(
      cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
      newCartItems[existingItemIndex].quantity += 1;
    }

    setCartItems(newCartItems);

    set(ref(db, 'carts/' + userId), {
      products: newCartItems,
    }).catch((error) => {
      console.error('Error writing to Firebase: ', error);
    });
  };

  const decreaseQuantity = (item) => {
    let newCartItems = [...cartItems];
    const existingItemIndex = newCartItems.findIndex(
      cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1 && newCartItems[existingItemIndex].quantity >
      1) {
      newCartItems[existingItemIndex].quantity -= 1;
    } else if (existingItemIndex > -1 &&
      newCartItems[existingItemIndex].quantity === 1) {
      newCartItems = newCartItems.filter(cartItem => cartItem.id !== item.id);
    }

    setCartItems(newCartItems);

    set(ref(db, 'carts/' + userId), {
      products: newCartItems,
    }).catch((error) => {
      console.error('Error writing to Firebase: ', error);
    });
  };

  const clearCart = () => {
    setCartItems([]);

    set(ref(db, 'carts/' + userId), {
      products: [],
    }).catch((error) => {
      console.error('Error writing to Firebase: ', error);
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={clearCart}>
        <Text style={styles.clearBtn}>Clear Cart</Text>
      </TouchableOpacity>
      <FlatList
        data={cartItems }
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        renderItem={({item}) => (
          <View style={styles.cardContainer}>
            <Card style={styles.card}>
              <Card.Cover source={{uri: item.image}}/>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.title}>{item.title}</Title>
                <Text>Quantity: {item.quantity}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => increaseQuantity(item)} style={styles.button}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => decreaseQuantity(item)} style={styles.button}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
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
    fontSize: 16,
  },
  clearBtn: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'black',
    color: 'red',
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'black',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default CartScreen;