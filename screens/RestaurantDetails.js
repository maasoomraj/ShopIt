import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Switch,
  TextInput,
} from "react-native";
import CustomActionButton from "../components/CustomActionButton";
import color from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";

import { Ionicons } from "@expo/vector-icons";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import LoadingFooter from "../components/LoadingFooter";
import Header from "../components/Header";

import { store } from "../helpers/redux-store";

class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      restaurantName: "",
      restaurantLocation: "",
    };
  }

  async componentDidMount() {
    let restaurant;
    for (let i in store.getState().restaurants) {
      if (store.getState().restaurants[i].key === store.getState().user.uid) {
        restaurant = store.getState().restaurants[i];
      }
    }

    this.setState({
      user: store.getState().user,
      loading: true,
      restaurant: restaurant,
    });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("MyRestaurant")
    );
  }

  onSubmit = async () => {
    if (this.state.restaurantName === "") {
      alert("Name field cannot be empty");
      return;
    }
    if (this.state.restaurantLocation === "") {
      alert("Location field cannot be empty");
      return;
    }

    try {
      await firebase
        .database()
        .ref("details/")
        .child(this.state.user.uid)
        .update({
          name: this.state.restaurantName,
          location: this.state.restaurantLocation,
        });

      for (let i in store.getState().restaurants) {
        if (store.getState().restaurants[i].key === store.getState().user.uid) {
          store.getState().restaurants[i].name = this.state.restaurantName;
          store.getState().restaurants[
            i
          ].location = this.state.restaurantLocation;
        }
      }
    } catch (error) {
      alert(error);
    }

    this.props.navigation.navigate("MyRestaurant");
  };

  render() {
    return (
      <View style={styles.container}>
        <Header text="Settings" />

        {this.state.loading ? (
          <View style={styles.container}>
            <View
              style={{
                marginHorizontal: 20,
                padding: 20,
                borderBottomWidth: 0.5,
                borderColor: color.black,
              }}
            >
              <Text>Name - {this.state.restaurant.name}</Text>
              <Text>Location - {this.state.restaurant.location}</Text>
            </View>

            <View
              style={{
                marginTop: 40,
              }}
            >
              <View style={styles.addViewTextView}>
                <Text>Enter new details -</Text>
              </View>
              <TextInput
                style={styles.addViewTextInput}
                placeholder="Restaurant Name (eg. Crossroads Chicken Service )"
                onChangeText={(text) => this.setState({ restaurantName: text })}
              />
              <TextInput
                style={styles.addViewTextInput}
                placeholder="Location (eg. Ali Road, Gaya )"
                onChangeText={(text) =>
                  this.setState({ restaurantLocation: text })
                }
              />
            </View>
          </View>
        ) : (
          <PageLoading />
        )}

        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
          onPress={this.onSubmit}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              width: 80,
              borderRadius: 30,
              backgroundColor: color.checkmark,
              margin: 10,
            }}
          >
            <Text style={{ color: color.white }}>Submit</Text>
          </View>
        </TouchableOpacity>

        {this.state.loading ? (
          <Footer props={this.props} user={this.state.user} />
        ) : (
          <LoadingFooter />
        )}
      </View>
    );
  }
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    marginTop: StatusBar.currentHeight,
  },
  content: {
    flex: 1,
  },
  view: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: color.black,
    alignItems: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    paddingLeft: 10,
  },
  text: {
    fontSize: 18,
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
});
