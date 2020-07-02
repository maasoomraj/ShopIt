import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  StatusBar,
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

class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
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

    this.setState({
      user: currentUser.val(),
      loading: true,
    });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("HomeScreen", {
        user: currentUser.val(),
      })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header text="Orders !!" />

        {this.state.loading ? (
          <View style={styles.content}>
            <Text>{this.state.user.uid}</Text>
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
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
  },
  text: {
    fontSize: 18,
  },
});
