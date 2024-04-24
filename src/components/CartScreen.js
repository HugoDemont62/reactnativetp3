import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import {getDatabase, off, onValue, ref} from 'firebase/database';
import {getAuth} from 'firebase/auth';
import {Card, Title} from 'react-native-paper';

const CartScreen = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const userId = getAuth().currentUser.uid;
    const cartRef = ref(db, 'carts/' + userId);

    const listener = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      setCart(data ? data.products : []);
    });

    return () => off(cartRef, listener);
  }, []);

  return (
    <View>
      <Text>Nombre de produit : {cart.length}</Text>
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