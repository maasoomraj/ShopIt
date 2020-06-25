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
        user: this.state.user,
      })
    );
  }

  logout = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("WelcomeScreen");
    } catch (error) {
      alert("Unable to Logout right now.");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Header text="Settings" />

        {this.state.loading ? (
          <View style={styles.content}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CustomActionButton style={styles.logout} onPress={this.logout}>
                <Text style={styles.text}>Log Out</Text>
              </CustomActionButton>
            </View>
          </View>
        ) : (
          <PageLoading />
        )}

        <Footer props={this.props} user={this.state.user} />
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
  logout: {
    width: 100,
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: color.black,
  },
  text: {
    color: color.black,
  },
});
