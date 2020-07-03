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

import color from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import LoadingFooter from "../components/LoadingFooter";
import Header from "../components/Header";
import { snapshotToArray } from "../helpers/firebaseHelpers";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

import { store, ADD_MY_RESTAURANT_MENU_ITEM } from "../helpers/redux-store";

export default class AddMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addView: false,
      itemName: "",
      itemQuantity: "",
      itemCost: 0,
      items: [],
      addRestaurant: false,
      user: {},
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState((state) => ({
      user: store.getState().user,
      loading: true,
      items: store.getState().myRestaurantMenu,
    }));

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("MyRestaurant")
    );
  }

  addItem = async () => {
    if (
      this.state.itemName === "" ||
      this.state.itemCost === "" ||
      this.state.itemQuantity === ""
    ) {
      alert("Please enter all fields");
      return;
    }

    try {
      const newItem = {
        name: this.state.itemName,
        quantity: this.state.itemQuantity,
        cost: this.state.itemCost,
      };

      const key = await firebase
        .database()
        .ref("menu/")
        .child(this.state.user.uid)
        .push().key;

      await firebase
        .database()
        .ref("menu/")
        .child(this.state.user.uid)
        .child(key)
        .set(newItem);

      this.setState((prevState) => ({
        items: [...prevState.items, newItem],
        itemName: "",
        itemQuantity: "",
        itemCost: "",
        addView: false,
      }));

      store.dispatch(ADD_MY_RESTAURANT_MENU_ITEM(newItem));
    } catch (error) {
      alert(error);
    }
  };

  itemDisplay = (item, index) => {
    return (
      <View style={styles.itemDisplayView}>
        <View style={styles.itemDisplayItemDetails}>
          <Text style={styles.itemDisplayName}>{item.name}</Text>
          <Text style={styles.itemDisplayQuantity}>{item.quantity}</Text>
        </View>
        <View style={styles.itemDisplayItemCost}>
          <Text style={styles.itemDisplayCost}>Rs. {item.cost}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header text="My Menu" />
        {this.state.loading ? (
          <View style={styles.content}>
            {this.state.addView ? (
              <View style={styles.onAddClick}>
                <View style={styles.addViewTextView}>
                  <Text>Enter Details to Add Item -</Text>
                </View>
                <TextInput
                  style={styles.addViewTextInput}
                  placeholder="Item Name (eg. Chicken Biryani )"
                  onChangeText={(text) => this.setState({ itemName: text })}
                />
                <TextInput
                  style={styles.addViewTextInput}
                  placeholder="Quantity (eg. 250gm )"
                  onChangeText={(text) => this.setState({ itemQuantity: text })}
                />
                <TextInput
                  style={styles.addViewTextInput}
                  placeholder="Cost (eg. Rs.120 )"
                  onChangeText={(text) => this.setState({ itemCost: text })}
                />

                <View style={styles.addViewAddCancel}>
                  <CustomActionButton
                    style={styles.addViewAddView}
                    styleTouch={styles.addViewAddTouch}
                    onPress={this.addItem}
                  >
                    <Text style={styles.addViewAdd}>Add</Text>
                  </CustomActionButton>
                  <CustomActionButton
                    style={styles.addViewCancelView}
                    styleTouch={styles.addViewAddTouch}
                    onPress={() =>
                      this.setState({
                        addView: false,
                        itemName: "",
                        itemQuantity: "",
                        itemCost: 0,
                      })
                    }
                  >
                    <Text style={styles.addViewAdd}>Cancel</Text>
                  </CustomActionButton>
                </View>
              </View>
            ) : null}

            <View
              style={{ justifyContent: "center", alignItems: "center" }}
            ></View>
            <FlatList
              data={this.state.items}
              renderItem={({ item }, index) => this.itemDisplay(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />

            {/* AddButton Start */}
            <TouchableOpacity
              style={styles.addButtonTouch}
              onPress={() =>
                this.setState({ addView: true, addRestaurantView: false })
              }
            >
              <View style={styles.addButton}>
                <Text style={styles.addSign}>+</Text>
              </View>
            </TouchableOpacity>
            {/* AddButton End */}
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
  addButtonTouch: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  restaurantTouch: {
    position: "absolute",
    left: 20,
    bottom: 20,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#068068",
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantButtonOff: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  restaurantButtonOn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  addSign: {
    fontSize: 50,
    fontWeight: "300",
  },
  addViewTextView: {
    alignItems: "center",
    justifyContent: "center",
  },
  addViewTextInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#0d0d0d",
    marginVertical: 5,
    marginHorizontal: 20,
    paddingVertical: 5,
    paddingLeft: 10,
    fontSize: 18,
  },
  addViewAddCancel: {
    flexDirection: "row",
  },
  addViewAddTouch: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  addViewAddView: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: "green",
    marginBottom: 5,
  },
  addViewCancelView: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: "red",
    marginBottom: 5,
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
