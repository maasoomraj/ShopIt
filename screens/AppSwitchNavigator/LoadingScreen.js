import React, { Component } from "react";
import { View, StyleSheet, YellowBox } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIndicator } from "react-native-indicators";
import { snapshotToArray } from "../../helpers/firebaseHelpers";

import color from "../../assets/colors";

import * as firebase from "firebase/app";
import("firebase/database");
import("firebase/auth");

/////
import {
  SET_USER,
  SET_CART_MENU,
  SET_ORDERS,
  SET_RESTAURANTS,
  store,
} from "../../helpers/redux-store";
store.subscribe(() => console.log(store.getState()));
//////

export default class LoadingScreen extends Component {
  componentDidMount = () => {
    YellowBox.ignoreWarnings(["Setting a timer"]);
    this.checkIfLoggedIn();
  };

  checkIfLoggedIn = async () => {
    this.unsubscribe = await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setUserData(user);
        this.setUserCartMenu(user);
        this.setUserOrders(user);
        this.setRestaurants(user);
        // this.props.navigation.navigate("HomeScreen", { user: user });
      } else {
        this.props.navigation.navigate("WelcomeScreen");
      }
    });
  };

  setUserData = async (user) => {
    const currentUser = await firebase
      .database()
      .ref("users")
      .child(user.uid)
      .once("value");

    store.dispatch(SET_USER(currentUser.val()));
  };

  setUserCartMenu = async (user) => {
    const myCartMenu = await firebase
      .database()
      .ref("cart/")
      .child(user.uid)
      .once("value");
    const cartMenu = snapshotToArray(myCartMenu);

    store.dispatch(SET_CART_MENU(cartMenu));
  };

  setUserOrders = async (user) => {
    const myOrders = await firebase
      .database()
      .ref("orders/")
      .child(user.uid)
      .once("value");

    const orders = snapshotToArray(myOrders);
    store.dispatch(SET_ORDERS(orders));
  };

  setRestaurants = async () => {
    const restaurants = await firebase.database().ref("details/").once("value");

    const newRestaurantsArray = snapshotToArray(restaurants);
    // let restaurantsArray = newRestaurantsArray.filter(
    //   (restaurant) => restaurant.status === true
    // );
    store.dispatch(SET_RESTAURANTS(newRestaurantsArray));

    this.props.navigation.navigate("HomeScreen");
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="shopping"
            size={200}
            color={color.bgMain}
          />
        </View>
        <View style={{ flex: 1 }}>
          <MaterialIndicator color={color.bgMain} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
});
