import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ToastAndroid,
  BackHandler,
  StatusBar,
  ScrollView,
} from "react-native";

import Dialog from "react-native-dialog";

import color from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";
import Footer from "../components/Footer";
import LoadingFooter from "../components/LoadingFooter";
import Header from "../components/Header";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import PageLoading from "../components/PageLoading";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

import { store, SET_CART_MENU } from "../helpers/redux-store";
import { TouchableOpacity } from "react-native-gesture-handler";

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

    const items = await firebase
      .database()
      .ref("menu")
      .child(restaurant.key)
      .orderByChild("name")
      .once("value");

    const itemsArray = snapshotToArray(items);

    this.setState({
      restaurant: restaurant,
      user: store.getState().user,
      menu: itemsArray,
      loading: true,
    });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("HomeScreen")
    );
  }

  checkCartForItem = () => {
    if (this.state.selectedItem) {
      let found = 0;
      // for (let i in store.getState().cartMenu) {
      //   if (
      //     store.getState().cartMenu[i].item.key === this.state.selectedItem.key
      //   ) {
      //     found = 1;
      //     break;
      //   }
      // }

      for (let i in store.getState().cartMenu) {
        if (store.getState().cartMenu[i].key === this.state.restaurant.key) {
          for (let j in store.getState().cartMenu[i]) {
            if (store.getState().cartMenu[i][j].item) {
              if (
                store.getState().cartMenu[i][j].item.key ===
                this.state.selectedItem.key
              ) {
                found = 1;
                break;
              }
            }
          }
        }
        if (found) {
          break;
        }
      }

      if (found) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  };

  addToCart = async (item) => {
    item.number = 1;
    try {
      const key = await firebase
        .database()
        .ref("cart/")
        .child(this.state.user.uid)
        .child(this.state.restaurant.key)
        .push().key;

      await firebase
        .database()
        .ref("cart/")
        .child(this.state.user.uid)
        .child(this.state.restaurant.key)
        .child(key)
        .set({
          item: item,
        });

      await firebase
        .database()
        .ref("cart/")
        .child(this.state.user.uid)
        .child(this.state.restaurant.key)
        .child("details")
        .set(
          {
            restaurant: this.state.restaurant,
          },
          async () => {
            const myCartMenu = await firebase
              .database()
              .ref("cart/")
              .child(store.getState().user.uid)
              .once("value");
            const cartMenu = snapshotToArray(myCartMenu);

            store.dispatch(SET_CART_MENU(cartMenu));
          }
        );

      this.setState((previous) => ({
        dialogView: false,
        selectedItem: {},
      }));

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
      // <View>
      //   <View style={styles.itemDisplayView}>
      //     <View style={styles.itemDisplayItemDetails}>
      //       <Text style={styles.itemDisplayName}>{item.name}</Text>
      //       <Text style={styles.itemDisplayQuantity}>{item.quantity}</Text>
      //     </View>
      //     <View style={styles.itemDisplayItemCost}>
      //       <Text style={styles.itemDisplayCost}>Rs. {item.cost}</Text>
      //     </View>
      //   </View>

      //   <CustomActionButton
      //     style={{
      //       width: 30,
      //       height: 30,
      //       borderRadius: 15,
      //       backgroundColor: "#87CEF9",
      //     }}
      //     styleTouch={{
      //       position: "absolute",
      //       right: 0,
      //       bottom: 0,
      //       paddingRight: 10,
      //     }}
      // onPress={() =>
      //   this.setState({ dialogView: true, selectedItem: item })
      // }
      //   >
      //     <Text style={{ fontSize: 24 }}>+</Text>
      //   </CustomActionButton>
      // </View>

      <View
        style={{
          borderWidth: 0.3,
          borderColor: "#000",
          borderRadius: 25,
          width: 170,
          margin: 10,
        }}
      >
        <View
          style={{
            width: 150,
            height: 110,
            margin: 10,
            backgroundColor: "#C4C4C4",
            borderRadius: 10,
          }}
        ></View>
        <Text
          style={{
            marginHorizontal: 10,
            fontWeight: "500",
            fontSize: 18,
            color: "#000",
          }}
        >
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/icons8-non-vegetarian-food-symbol-48.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={{
              fontWeight: "500",
              fontSize: 11,
              color: "#000",
            }}
          >
            Non-Veg | {item.quantity}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Text
              style={{
                marginHorizontal: 10,
                fontWeight: "bold",
                fontSize: 16,
                color: "#000",
              }}
            >
              ₹ {item.cost}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
            }}
            onPress={() =>
              this.setState({ dialogView: true, selectedItem: item })
            }
          >
            <View
              style={{
                borderRadius: 10,
                width: 80,
                height: 30,
                backgroundColor: "#4FAF61",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>ADD</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header text="ShopIt" />

        {/* Content Start */}
        {this.state.loading ? (
          <ScrollView style={styles.content}>
            <View style={{ height: 200, backgroundColor: "#C4C4C4" }}></View>
            {/* Add Item Dialog Box */}
            {this.state.dialogView && this.checkCartForItem() == 1 ? (
              <View>
                <Dialog.Container visible={this.state.dialogView}>
                  <Dialog.Title>Add to Cart</Dialog.Title>
                  <Dialog.Description>Added to cart</Dialog.Description>
                  <Dialog.Button
                    label="Ok"
                    onPress={() =>
                      this.setState({ dialogView: false, selectedItem: {} })
                    }
                  />
                </Dialog.Container>
              </View>
            ) : (
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
                    onPress={() => {
                      this.addToCart(this.state.selectedItem);
                      this.forceUpdate();
                    }}
                  />
                </Dialog.Container>
              </View>
            )}

            <View style={{ marginLeft: 20, marginTop: 25, marginBottom: 30 }}>
              <Text style={{ fontWeight: "bold", fontSize: 24, color: "#000" }}>
                {this.state.restaurant.name}
              </Text>
              <Text
                style={{
                  fontWeight: "normal",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "#000",
                }}
              >
                North Indian | Pure Veg
              </Text>
              <Text style={{ fontWeight: "500", fontSize: 20, color: "#000" }}>
                Near {this.state.restaurant.location}
              </Text>
            </View>

            <View
              style={{
                borderWidth: 0.7,
                borderColor: "#828282",
                marginHorizontal: 25,
              }}
            ></View>

            <FlatList
              data={this.state.menu}
              renderItem={({ item }, index) => this.itemDisplay(item, index)}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              contentContainerStyle={{
                alignItems: "center",
              }}
              ListEmptyComponent={
                <View style={{ marginTop: 40, alignItems: "center" }}>
                  <Text style={{ fontSize: 24 }}>
                    There are no items added yet.
                  </Text>
                </View>
              }
            />
          </ScrollView>
        ) : (
          <PageLoading />
        )}
        {/* Content End */}

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
