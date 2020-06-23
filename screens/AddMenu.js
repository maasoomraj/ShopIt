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
import CustomActionButton from "../components/CustomActionButton";
import PageLoading from "../components/PageLoading";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { Ionicons } from "@expo/vector-icons";

import * as firebase from "firebase/app";
import("firebase/auth");
import("firebase/database");

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
      restaurantName: "",
      restaurantLocation: "",
      user: {},
      loading: false,
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

    let status;
    let placeholderName, placeholderLocation;
    try {
      const available = await firebase
        .database()
        .ref("details/")
        .child(currentUser.val().uid)
        .orderByChild("name")
        .once("value");

      status = available.val().status;
      placeholderName = available.val().name;
      placeholderLocation = available.val().location;
    } catch (error) {
      await firebase
        .database()
        .ref("details/")
        .child(currentUser.val().uid)
        .set(
          {
            name: "**-Name-**",
            location: "**-Location-**",
            status: false,
          },
          () => alert("You donot have restaurant on. Use ON")
        );

      placeholderName = "**-Name-**";
      placeholderLocation = "**-Location-**";
      status = false;
    }

    const items = await firebase
      .database()
      .ref("menu/")
      .child(currentUser.val().uid)
      .once("value");

    const itemsArray = snapshotToArray(items);

    this.setState((state) => ({
      user: currentUser.val(),
      loading: true,
      items: itemsArray,
      addRestaurant: status,
      placeholderName: placeholderName,
      placeholderLocation: placeholderLocation,
    }));
  }

  addRestaurant = async () => {
    // create restaurant in db
    try {
      await firebase
        .database()
        .ref("details/")
        .child(this.state.user.uid)
        .update({
          name: this.state.restaurantName,
          location: this.state.restaurantLocation,
          status: true,
        });

      this.setState({ addRestaurant: true, addRestaurantView: false });
    } catch (error) {
      alert(error);
    }
  };

  offRestaurant = async () => {
    // create restaurant in db
    try {
      await firebase
        .database()
        .ref("details/")
        .child(this.state.user.uid)
        .update({
          status: false,
        });
    } catch (error) {
      alert(error);
    }
  };

  addItem = async () => {
    try {
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
        .set({
          name: this.state.itemName,
          quantity: this.state.itemQuantity,
          cost: this.state.itemCost,
        });

      const newItem = {
        name: this.state.itemName,
        quantity: this.state.itemQuantity,
        cost: this.state.itemCost,
      };

      this.setState((prevState) => ({
        items: [...prevState.items, newItem],
        itemName: "",
        itemQuantity: "",
        itemCost: "",
        addView: false,
      }));
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
            <Text>MY MENU</Text>
          </View>
        </View>
        {/* Header End */}
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

            {this.state.addRestaurantView ? (
              <View style={styles.onAddClick}>
                <View style={styles.addViewTextView}>
                  <Text>Enter Details to Add Your Restaurant -</Text>
                </View>
                <TextInput
                  style={styles.addViewTextInput}
                  placeholder={
                    this.state.placeholderName === "**-Name-**"
                      ? "Restaurant Name (eg. Crossroads Chicken Service )"
                      : this.state.placeholderName
                  }
                  onChangeText={(text) =>
                    this.setState({ restaurantName: text })
                  }
                />
                <TextInput
                  style={styles.addViewTextInput}
                  placeholder={
                    this.state.placeholderName === "**-Location-**"
                      ? "Location (eg. Ali Road, Gaya )"
                      : this.state.placeholderLocation
                  }
                  onChangeText={(text) =>
                    this.setState({ restaurantLocation: text })
                  }
                />

                <View style={styles.addViewAddCancel}>
                  <CustomActionButton
                    style={styles.addViewAddView}
                    styleTouch={styles.addViewAddTouch}
                    onPress={this.addRestaurant}
                  >
                    <Text style={styles.addViewAdd}>ON</Text>
                  </CustomActionButton>
                  <CustomActionButton
                    style={styles.addViewCancelView}
                    styleTouch={styles.addViewAddTouch}
                    onPress={() =>
                      this.setState({
                        addRestaurantView: false,
                        restaurantName: "",
                        restaurantLocation: "",
                      })
                    }
                  >
                    <Text style={styles.addViewAdd}>Cancel</Text>
                  </CustomActionButton>
                </View>
              </View>
            ) : null}

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{ fontSize: 18, color: color.bgMain, fontWeight: "700" }}
              >
                Items Added -
              </Text>
            </View>
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

            {/* Restaurant Start */}
            {this.state.addRestaurant ? (
              <TouchableOpacity
                style={styles.restaurantTouch}
                onPress={() => {
                  this.offRestaurant();
                  this.setState({ addRestaurant: false });
                }}
              >
                <View style={styles.restaurantButtonOn}>
                  <Text style={styles.restaurantText}>ON</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.restaurantTouch}
                onPress={() =>
                  this.setState({
                    addRestaurantView: true,
                    addView: false,
                    itemName: "",
                    itemQuantity: "",
                    itemCost: 0,
                  })
                }
              >
                <View style={styles.restaurantButtonOff}>
                  <Text style={styles.restaurantText}>OFF</Text>
                </View>
              </TouchableOpacity>
            )}
            {/* Restaurant End */}
          </View>
        ) : (
          <PageLoading />
        )}

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
  addViewAdd: {},
  onAddClick: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#0d0d0d",
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
