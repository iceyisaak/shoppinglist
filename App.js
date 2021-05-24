import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db, auth } from './firebase';




export default class App extends React.Component {

  constructor() {
    super();

    this.state = {
      lists: [],
      uid: '',
      loggedInText: 'Hi there!'
    };

  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    querySnapshot.forEach(
      (doc) => {
        var data = doc.data();
        lists.push({
          name: data.name,
          items: data.items.toString()
        });
      }
    );
    this.setState({
      lists
    });
  };

  addList = () => {
    this.referenceShoppingLists.add({
      name: 'TestList',
      items: ['egg', 'pasta', 'veggies'],
      uid: this.state.uid
    });
  };

  componentDidMount() {

    this.referenceShoppingLists = db.collection('shoppinglists');
    this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate);

    this.authUnsubscribe = auth.onAuthStateChanged(
      async (user) => {
        if (!user) {
          await auth.signInAnonymously();
        }

        this.setState({
          uid: user.uid,
          loggedInText: 'You are logged in.'
        });

        this.referenceShoppingListsUser = db.collection('shoppinglists').where(
          'uid',
          '==',
          this.state.uid
        );

      }

    );

    this.unsubscribeListUser = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate);

  };


  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  render() {
    return (
      <View style={styles.container} >
        <Text style={styles.h1}>
          All Shoppinglists
        </Text>
        <FlatList
          data={this.state.lists}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.text}>
              {item.name} : {item.items}
            </Text>
          )}
        />
        <Text>
          {this.state.loggedInText}
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => this.addList()}
        >
          <Text style={styles.btnText}>
            Add to List
          </Text>
        </TouchableOpacity>
      </View>
    );

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40
  },
  item: {
    fontSize: 20,
    color: 'blue'
  },
  text: {
    fontSize: 15,
    color: 'blue'
  },
  h1: {
    fontSize: 50,
    marginBottom: 5
  },
  btn: {
    backgroundColor: '#33dd00',
    alignItems: 'center',
    padding: 15
  },
  btnText: {
    color: '#fff'
  }
});
