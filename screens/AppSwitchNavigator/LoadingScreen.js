import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  YellowBox,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import color from "../../assets/colors";
import { MaterialIndicator } from "react-native-indicators";
import * as firebase from "firebase/app";
import("firebase/auth");

export default class LoadingScreen extends Component {
  componentDidMount = () => {
    YellowBox.ignoreWarnings(["Setting a timer"]);
    this.checkIfLoggedIn();
  };

  checkIfLoggedIn = () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.navigation.navigate("HomeScreen", { user: user });
      } else {
        this.props.navigation.navigate("WelcomeScreen");
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MaterialCommunityIcons
            name="shopping"
            size={200}
            color={color.bgMain}
          />
        </View>
        <View style={{ flex: 1 }}>
          <MaterialIndicator color={color.bgMain} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
});
