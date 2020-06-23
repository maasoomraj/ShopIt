import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CustomActionButton from "../components/CustomActionButton";
import color from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";

import { Ionicons } from "@expo/vector-icons";
import PageLoading from "../components/PageLoading";

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
            <Text>SETTINGS</Text>
          </View>
        </View>
        {/* Header End */}

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
        {/* Footer Start */}
        <View style={styles.footer}>
          <Text>Footer</Text>
        </View>
        {/* Footer End */}
      </View>
    );
  }
}

export default SettingsScreen;

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
