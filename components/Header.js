import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import color from "../assets/colors";

const Header = ({ text }) => (
  <View style={styles.header}>
    <Text style={{ color: color.black, fontSize: 25 }}>{text}</Text>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "#3A9DDB",
    alignItems: "center",
    justifyContent: "center",
  },
});
