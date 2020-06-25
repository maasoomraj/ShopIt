import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import color from "../assets/colors";

const Header = ({ text }) => (
  <View style={styles.header}>
    <Text style={{ color: color.white, fontSize: 20 }}>{text}</Text>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 50,
    borderBottomColor: "#0d0d0d",
    borderBottomWidth: 0.5,
    backgroundColor: color.bgMain,
    alignItems: "center",
    justifyContent: "center",
  },
});
