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
import MenuList from "../components/MenuList";
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

    this.setState({ user: currentUser.val(), loading: true });
  }

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
            <Text>OPTIONS</Text>
          </View>
        </View>
        {/* Header End */}
        {this.state.loading ? (
          <View style={styles.content}>
            <MenuList
              onPress={() =>
                this.props.navigation.navigate("HomeScreen", {
                  user: this.state.user,
                })
              }
            >
              <Text>Home</Text>
            </MenuList>

            <MenuList
              onPress={() =>
                this.props.navigation.navigate("AddMenu", {
                  user: this.state.user,
                })
              }
            >
              <Text>My Menu</Text>
            </MenuList>

            <MenuList
              onPress={() =>
                this.props.navigation.navigate("MyCart", {
                  user: this.state.user,
                })
              }
            >
              <Text>My Cart</Text>
            </MenuList>

            <MenuList
              onPress={() =>
                this.props.navigation.navigate("SettingsScreen", {
                  user: this.state.user,
                })
              }
            >
              <Text>Settings</Text>
            </MenuList>
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
  footer: {
    height: 70,
    alignItems: "center",
    borderTopColor: "#0d0d0d",
    borderTopWidth: 0.5,
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
