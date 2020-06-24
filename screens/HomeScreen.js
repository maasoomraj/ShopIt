import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import color from "../assets/colors";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { Ionicons } from "@expo/vector-icons";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      restaurants: [],
    };
  }

  async componentDidMount() {
    // get user from authentication
    const { navigation } = this.props;
    const user = navigation.getParam("user");

    // get user from database
    const currentUser = await firebase
      .database()
      .ref("users")
      .child(user.uid)
      .once("value");

    // Get list of all restaurants
    const restaurants = await firebase.database().ref("details/").once("value");
    // Convert Snapshot to Array
    const newRestaurantsArray = snapshotToArray(restaurants);
    // sort "ON" restaurants
    let restaurantsArray = newRestaurantsArray.filter(
      (restaurant) => restaurant.status === true
    );

    this.setState({
      user: currentUser.val(),
      loading: true,
      restaurants: restaurantsArray,
    });
  }

  itemDisplay = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("ViewItem", {
            restaurant: item,
            user: this.state.user,
          })
        }
      >
        <View style={styles.restaurantContainer}>
          <View>
            <Text style={styles.restaurantTitle}>{item.name}</Text>
          </View>
          <View>
            <Text style={styles.restaurantLocation}>
              Address - {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Header Start */}
        <View style={styles.header}>
          {/* <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("SideMenu", {
                user: this.state.user,
              })
            }
          >
            <View style={styles.headerButton}>
              <Ionicons name="ios-menu" size={32} color="black" />
            </View>
          </TouchableOpacity> */}
          <View style={styles.headerText}>
            <Text>ShopIt</Text>
          </View>
        </View>
        {/* Header End */}

        {this.state.loading ? (
          <View style={styles.content}>
            <FlatList
              data={this.state.restaurants}
              renderItem={({ item }, index) => this.itemDisplay(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <PageLoading />
        )}

        <Footer props={this.props} user={this.state.user} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    height: 80,
    paddingTop: 30,
    borderBottomColor: "#0d0d0d",
    borderBottomWidth: 0.5,
    flexDirection: "row",
  },
  headerButton: {
    paddingLeft: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  restaurantContainer: {
    minHeight: 80,
    margin: 20,
    borderWidth: 1,
    borderColor: "#0d0d0d",
  },
  restaurantTitle: {
    paddingHorizontal: 15,
    fontSize: 28,
    fontWeight: "900",
    color: color.bgMain,
  },
  restaurantLocation: {
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "200",
    color: "#6B6E77",
  },
});
