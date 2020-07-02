import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  BackHandler,
  StatusBar,
} from "react-native";
import { NumberView } from "react-native-number-view";

import color from "../assets/colors";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import LoadingFooter from "../components/LoadingFooter";
import Header from "../components/Header";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { Ionicons } from "@expo/vector-icons";

import * as firebase from "firebase/app";
import CustomActionButton from "../components/CustomActionButton";
import("firebase/auth");
import("firebase/database");

export default class MyOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orders: [],
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
    const myOrders = await firebase
      .database()
      .ref("orders/")
      .child(user.uid)
      .once("value");
    // Convert Snapshot to Array
    const orders = snapshotToArray(myOrders);

    this.setState({
      user: currentUser.val(),
      loading: true,
      orders: orders,
    });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("SettingsScreen", {
        user: currentUser.val(),
      })
    );
  }

  orderDisplay = (item, index) => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          borderBottomWidth: 0.3,
          borderBottomColor: color.black,
        }}
      >
        <Text>
          Restaurant - {item.restaurant.name}, {item.restaurant.location}
        </Text>
        <Text>
          Item - {item.item.name} * {item.item.number}
        </Text>
        <Text>
          Cost = ( {item.item.cost} @ {item.item.quantity} ) *{" "}
          {item.item.number} = Rs. {item.item.cost * item.item.number}
        </Text>
        <Text></Text>
      </View>
    );
  };

  itemDisplay = (item, index) => {
    return (
      <View
        style={{
          padding: 30,
          paddingBottom: 40,
          borderBottomWidth: 1,
          borderBottomColor: color.black,
        }}
      >
        <FlatList
          data={item.order}
          renderItem={({ item, index }) => this.orderDisplay(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ flexDirection: "row", paddingTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Order Number - </Text>
          <Text>({item.key})</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Total Amount - </Text>
          <Text>Rs. {item.totalCost}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Status - </Text>
          {item.status === "incomplete" ? (
            <Text style={{ color: "#8E7F27", fontWeight: "bold" }}>
              Processing
            </Text>
          ) : null}
          {item.status === "complete" ? (
            <Text style={{ color: "green", fontWeight: "bold" }}>
              Delivered
            </Text>
          ) : null}
          {item.status === "rejected" ? (
            <Text style={{ color: "red", fontWeight: "bold" }}>
              Rejected by shop owner
            </Text>
          ) : null}
          {item.status === "delivery" ? (
            <Text style={{ color: "blue", fontWeight: "bold" }}>
              Out for delivery
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header text="My Orders" />

        {this.state.loading ? (
          <View style={styles.content}>
            <FlatList
              data={this.state.orders}
              renderItem={({ item, index }) => this.itemDisplay(item, index)}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View style={{ marginTop: 40, alignItems: "center" }}>
                  <Text style={{ fontSize: 18 }}>
                    You haven't order anything yet.
                  </Text>
                </View>
              }
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
});
