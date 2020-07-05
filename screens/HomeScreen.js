import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";

import color from "../assets/colors";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import LoadingFooter from "../components/LoadingFooter";
import Header from "../components/Header";

import { store } from "../helpers/redux-store";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      restaurants: [],
    };
  }

  componentDidMount() {
    let restaurantsArray = store
      .getState()
      .restaurants.filter((restaurant) => restaurant.status === true);
    this.setState({
      user: store.getState().user,
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
          })
        }
      >
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: 100,
              height: 110,
              backgroundColor: "#C4C4C4",
              borderRadius: 20,
              marginLeft: 20,
              marginRight: 10,
              marginTop: 14,
              marginBottom: 14,
            }}
          ></View>
          <View style={{ marginRight: 10, marginTop: 20, marginBottom: 20 }}>
            <Text
              style={{ fontSize: 22, fontWeight: "normal", color: "#000000" }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "normal",
                fontStyle: "italic",
                color: "#000000",
              }}
            >
              North Indian | Pure Veg
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "normal",
                color: "#000000",
              }}
            >
              Near {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
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
