import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";

import Dialog from "react-native-dialog";

import color from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import PageLoading from "../components/PageLoading";
import { Ionicons } from "@expo/vector-icons";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

export default class ViewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: "",
      menu: [],
      user: {},
      loading: false,
      dialogView: false,
      selectedItem: {},
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const restaurant = navigation.getParam("restaurant");
    const user = navigation.getParam("user");

    const items = await firebase
      .database()
      .ref("menu")
      .child(restaurant.key)
      .orderByChild("name")
      .once("value");

    const itemsArray = snapshotToArray(items);

    this.setState({
      restaurant: restaurant,
      user: user,
      menu: itemsArray,
      loading: true,
    });
  }

  addToCart = async (item) => {
    try {
      const key = await firebase
        .database()
        .ref("cart/")
        .child(this.state.user.uid)
        .push().key;

      await firebase
        .database()
        .ref("cart/")
        .child(this.state.user.uid)
        .child(key)
        .set({
          item: item,
          restaurant: this.state.restaurant,
        });

      this.setState({ dialogView: false, selectedItem: {} });
      ToastAndroid.showWithGravity(
        "Item was successfully added to your cart",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } catch (error) {
      alert(error);
    }
  };

  itemDisplay = (item, index) => {
    return (
      <View>
        <View style={styles.itemDisplayView}>
          <View style={styles.itemDisplayItemDetails}>
            <Text style={styles.itemDisplayName}>{item.name}</Text>
            <Text style={styles.itemDisplayQuantity}>{item.quantity}</Text>
          </View>
          <View style={styles.itemDisplayItemCost}>
            <Text style={styles.itemDisplayCost}>Rs. {item.cost}</Text>
          </View>
        </View>

        <CustomActionButton
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#87CEF9",
          }}
          styleTouch={{
            position: "absolute",
            right: 0,
            bottom: 0,
            paddingRight: 10,
          }}
          onPress={() =>
            this.setState({ dialogView: true, selectedItem: item })
          }
        >
          <Text style={{ fontSize: 24 }}>+</Text>
        </CustomActionButton>
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
            <Text>{this.state.restaurant.name}</Text>
          </View>
        </View>
        {/* Header End */}

        {/* Content Start */}
        {this.state.loading ? (
          <View style={styles.content}>
            {/* Add Item Dialog Box */}
            <View>
              <Dialog.Container visible={this.state.dialogView}>
                <Dialog.Title>Add to Cart</Dialog.Title>
                <Dialog.Description>
                  Do you want to add item to your cart?
                </Dialog.Description>
                <Dialog.Button
                  label="Cancel"
                  onPress={() =>
                    this.setState({ dialogView: false, selectedItem: {} })
                  }
                />
                <Dialog.Button
                  label="Yes"
                  onPress={() => this.addToCart(this.state.selectedItem)}
                />
              </Dialog.Container>
            </View>
            <View
              style={{
                minHeight: 100,
                borderBottomWidth: 0.5,
                borderColor: color.black,
                paddingVertical: 20,
                alignItems: "center",
              }}
            >
              <Text style={styles.headerRestaurantName}>
                {this.state.restaurant.name}
              </Text>
              <Text style={styles.headerRestaurantLocation}>
                Address - {this.state.restaurant.location}
              </Text>
            </View>
            <View style={styles.MenuView}>
              <Text style={styles.MenuText}>Menu</Text>
            </View>
            <FlatList
              data={this.state.menu}
              renderItem={({ item }, index) => this.itemDisplay(item, index)}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View style={{ marginTop: 40, alignItems: "center" }}>
                  <Text style={{ fontSize: 24 }}>
                    There are no items added yet.
                  </Text>
                </View>
              }
            />
          </View>
        ) : (
          <PageLoading />
        )}
        {/* Content End */}

        {/* Footer Start */}
        <View style={styles.footer}>
          <Text>Footer</Text>
        </View>
        {/* Footer End */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  footer: {
    height: 70,
    alignItems: "center",
    borderTopColor: "#0d0d0d",
    borderTopWidth: 0.5,
  },
  content: {
    flex: 1,
  },
  headerRestaurantName: {
    fontSize: 30,
    fontWeight: "bold",
    color: color.bgMain,
  },
  headerRestaurantLocation: {
    fontSize: 24,
    fontWeight: "300",
    color: "#6b6e77",
  },
  MenuView: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 50,
  },
  MenuText: {
    fontSize: 24,
    fontWeight: "400",
  },
  itemDisplayView: {
    minHeight: 80,
    borderWidth: 0.5,
    borderColor: "#0d0d0d",
    padding: 10,
    flexDirection: "row",
    margin: 20,
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
