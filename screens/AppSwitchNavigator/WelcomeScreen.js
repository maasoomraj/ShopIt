import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomActionButton from "../../components/CustomActionButton";
import color from "../../assets/colors";

class WelcomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="shopping"
            color={color.bgMain}
            size={200}
          />
          <View>
            <Text style={styles.headerText}>ShopIt</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <CustomActionButton
            style={styles.login}
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </CustomActionButton>
        </View>
      </View>
    );
  }
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 50,
    color: color.black,
  },
  footer: {
    flex: 1,
    alignItems: "center",
  },
  login: {
    width: 150,
    backgroundColor: "transparent",
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: color.black,
  },
  buttonText: {
    color: color.black,
  },
});
