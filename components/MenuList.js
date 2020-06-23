import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import color from "../assets/colors";

const MenuList = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        height: 70,
        marginBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export default MenuList;
