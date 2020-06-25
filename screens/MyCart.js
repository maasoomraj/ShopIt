import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { NumberView } from "react-native-number-view";

import color from "../assets/colors";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { Ionicons } from "@expo/vector-icons";

import * as firebase from "firebase/app";
import CustomActionButton from "../components/CustomActionButton";
import("firebase/auth");
import("firebase/database");

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      restaurants: [],
      cartMenu: [],
      totalCost: 0,
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
    const myCartMenu = await firebase
      .database()
      .ref("cart/")
      .child(user.uid)
      .once("value");
    // Convert Snapshot to Array
    const cartMenu = snapshotToArray(myCartMenu);

    let totalCost = 0;
    for (let i in cartMenu) {
      totalCost += cartMenu[i].item.number * cartMenu[i].item.cost;
    }

    this.setState({
      user: currentUser.val(),
      loading: true,
      cartMenu: cartMenu,
      totalCost: totalCost,
    });

    // console.log(cartMenu);
  }

  buyOrder = async () => {
    try {
      const key = await firebase
        .database()
        .ref("orders")
        .child(this.state.user.uid)
        .push().key;

      await firebase
        .database()
        .ref("orders")
        .child(this.state.user.uid)
        .child(key)
        .set(
          {
            orderNumber: key,
            totalCost: this.state.totalCost,
            order: this.state.cartMenu,
          },
          async () => {
            await firebase
              .database()
              .ref("cart")
              .child(this.state.user.uid)
              .remove();

            this.setState({ cartMenu: [], totalCost: 0 });
            alert("Order successfully Placed.");
          }
        );
    } catch (error) {
      alert("Please try again.");
    }
  };

  removeFromCart = async (item) => {
    console.log(item.key);
    try {
      await firebase
        .database()
        .ref("cart")
        .child(this.state.user.uid)
        .child(item.key)
        .remove();

      let cartMenu = this.state.cartMenu.filter(
        (newItem) => newItem.key !== item.key
      );
      let reducedCost = item.item.number * item.item.cost;
      let totalCost = this.state.totalCost - reducedCost;
      this.setState({ cartMenu: cartMenu, totalCost: totalCost });
    } catch (error) {
      alert("Please try again.");
    }
  };

  itemDisplay = (item, index) => {
    return (
      <View
        style={{
          borderColor: "black",
          borderBottomWidth: 0.5,
          paddingBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "300",
            paddingLeft: 15,
            paddingTop: 15,
          }}
        >
          {index + 1}.
        </Text>
        <View style={styles.itemDisplayView}>
          <View style={styles.itemDisplayItemDetails}>
            <Text style={styles.itemDisplayName}>{item.item.name}</Text>
            <Text style={styles.itemDisplayQuantity}>{item.item.quantity}</Text>
          </View>
          <View style={styles.itemDisplayItemCost}>
            <Text style={styles.itemDisplayCost}>Rs. {item.item.cost}</Text>
          </View>
        </View>
        <View>
          <View style={{ paddingHorizontal: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.restaurant.name}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "100" }}>
              {item.restaurant.location}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 14, fontWeight: "100" }}>
                Quantity -{" "}
              </Text>
              <View style={{ paddingLeft: 100 }}>
                <NumberView
                  initialValue={1}
                  leftContent={<Text style={{ fontSize: 22 }}>-</Text>}
                  rightContent={<Text style={{ fontSize: 22 }}>+</Text>}
                  onValueChange={(newVal) => {
                    if (newVal >= 0) {
                      let newCartMenu = this.state.cartMenu;
                      let totalCost = this.state.totalCost;
                      totalCost -=
                        newCartMenu[index].item.number *
                        newCartMenu[index].item.cost;
                      totalCost += newVal * newCartMenu[index].item.cost;
                      newCartMenu[index].item.number = newVal;
                      this.setState({
                        cartMenu: newCartMenu,
                        totalCost: totalCost,
                      });
                    }
                  }}
                  minValue={0}
                  onDecrement={() => console.log("-1")}
                  onIncrement={() => console.log("+1")}
                />
              </View>
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "100" }}>
                Cost - {item.item.cost * this.state.cartMenu[index].item.number}
              </Text>
            </View>
            <CustomActionButton
              onPress={() => this.removeFromCart(item)}
              styleTouch={{
                paddingTop: 10,
                alignItems: "flex-end",
              }}
              style={{ width: 100, height: 30, borderRadius: 25 }}
            >
              <Text>Remove</Text>
            </CustomActionButton>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Header Start */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("HomeScreen", {
                user: this.state.user,
              })
            }
          >
            <View style={styles.headerButton}>
              <Ionicons name="ios-arrow-round-back" size={32} color="black" />
            </View>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text>My Cart</Text>
          </View>
        </View>
        {/* Header End */}

        {this.state.loading ? (
          <View style={styles.content}>
            <FlatList
              data={this.state.cartMenu}
              renderItem={({ item, index }) => this.itemDisplay(item, index)}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View style={{ marginTop: 40, alignItems: "center" }}>
                  <Text style={{ fontSize: 18 }}>
                    There are no items added in your Cart.
                  </Text>
                </View>
              }
            />
            {this.state.cartMenu.length == 0 ? null : (
              <View
                style={{
                  height: 50,
                  paddingHorizontal: 30,
                  borderTopWidth: 0.5,
                  borderTopColor: color.black,
                  flexDirection: "row",
                }}
              >
                <CustomActionButton
                  onPress={() => this.buyOrder()}
                  style={{
                    width: 100,
                    height: 40,
                    borderRadius: 25,
                    backgroundColor: "#0D91DD",
                  }}
                  styleTouch={{
                    justifyContent: "center",
                    paddingRight: 15,
                  }}
                >
                  <Text>BUY</Text>
                </CustomActionButton>
                <View
                  style={{
                    justifyContent: "center",
                    position: "absolute",
                    right: 30,
                  }}
                >
                  <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                    Total Cost - {this.state.totalCost}
                  </Text>
                </View>
              </View>
            )}
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
  itemDisplayView: {
    minHeight: 80,
    borderWidth: 0.5,
    borderColor: "#0d0d0d",
    padding: 10,
    flexDirection: "row",
    margin: 20,
    marginTop: 5,
  },
  itemDisplayItemDetails: {
    flex: 1,
  },
  itemDisplayItemCost: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDisplayName: {
    fontSize: 24,
    fontWeight: "300",
  },
  itemDisplayQuantity: {
    fontSize: 16,
    fontWeight: "100",
  },
  itemDisplayCost: {
    fontSize: 28,
    fontWeight: "300",
  },
});
