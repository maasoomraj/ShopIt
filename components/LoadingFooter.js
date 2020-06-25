import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Entypo, Ionicons } from "@expo/vector-icons";

import color from "../assets/colors";

const LoadingFooter = () => (
  <View
    style={{
      height: 50,
      alignItems: "center",
      borderTopColor: "#0d0d0d",
      borderTopWidth: 0.5,
      flexDirection: "row",
      backgroundColor: color.bgMain,
    }}
  >
    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View>
        <Ionicons name="ios-home" size={24} color={color.white} />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View>
        <Ionicons name="md-cart" size={24} color={color.white} />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View>
        <Entypo name="man" size={24} color={color.white} />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View>
        <Ionicons name="ios-settings" size={24} color={color.white} />
      </View>
    </TouchableOpacity>
  </View>
);

export default LoadingFooter;
