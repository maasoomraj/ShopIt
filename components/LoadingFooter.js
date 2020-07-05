import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { Entypo, Ionicons } from "@expo/vector-icons";

import color from "../assets/colors";

const LoadingFooter = () => (
  <View
    style={{
      height: 50,
      margin: 10,
      backgroundColor: "#3A9DDB",
      borderRadius: 50,
      flexDirection: "row",
    }}
  >
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <Image
          source={require("../assets/icons8-home-52.png")}
          style={{ width: 30, height: 30 }}
        />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <Image
          source={require("../assets/icons8-shopping-cart-48.png")}
          style={{ width: 30, height: 30 }}
        />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <Image
          source={require("../assets/icons8-food-60.png")}
          style={{ width: 30, height: 30 }}
        />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <Image
          source={require("../assets/icons8-user-60.png")}
          style={{ width: 30, height: 30 }}
        />
      </View>
    </TouchableOpacity>
  </View>
);

export default LoadingFooter;
