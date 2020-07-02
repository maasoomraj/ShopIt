import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
} from "react-native";

import color from "../assets/colors";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import LoadingFooter from "../components/LoadingFooter";
import Header from "../components/Header";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { Ionicons } from "@expo/vector-icons";

////
import { store } from "../helpers/redux-store";
////

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

  componentDidMount() {
    this.setState({
      user: store.getState().user,
      loading: true,
      restaurants: store.getState().restaurants,
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
    console.log(store.getState());
    return (
      <View style={styles.container}>
        <Header text="ShopIt" />
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
        {this.state.loading ? (
          <Footer props={this.props} user={this.state.user} />
        ) : (
          <LoadingFooter />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    marginTop: StatusBar.currentHeight,
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
