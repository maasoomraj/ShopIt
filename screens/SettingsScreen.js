import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomActionButton from "../components/CustomActionButton";
import color from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";

class SettingsScreen extends React.Component {
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
        <CustomActionButton style={styles.logout} onPress={this.logout}>
          <Text style={styles.text}>Log Out</Text>
        </CustomActionButton>
      </View>
    );
  }
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.white,
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
