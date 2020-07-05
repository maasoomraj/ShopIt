import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { Entypo, Ionicons } from "@expo/vector-icons";

import color from "../assets/colors";

const Footer = ({ props, user }) => (
  // <View
  //   style={{
  //     height: 50,
  //     alignItems: "center",
  //     borderTopColor: "#0d0d0d",
  //     borderTopWidth: 0.5,
  //     flexDirection: "row",
  //     backgroundColor: color.bgMain,
  //   }}
  // >
  //   <TouchableOpacity
  //     style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  // onPress={() =>
  //   props.navigation.navigate("HomeScreen", {
  //     user: user,
  //   })
  // }
  //   >
  //     <View>
  //       <Ionicons name="ios-home" size={24} color={color.white} />
  //     </View>
  //   </TouchableOpacity>

  //   <TouchableOpacity
  //     style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //     onPress={() =>
  //       props.navigation.navigate("MyCart", {
  //         user: user,
  //       })
  //     }
  //   >
  //     <View>
  //       <Ionicons name="md-cart" size={24} color={color.white} />
  //     </View>
  //   </TouchableOpacity>

  //   <TouchableOpacity
  //     style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //     onPress={() =>
  //       props.navigation.navigate("ReceiveOrders", {
  //         user: user,
  //       })
  //     }
  //   >
  //     <View>
  //       <Entypo name="man" size={24} color={color.white} />
  //     </View>
  //   </TouchableOpacity>

  //   <TouchableOpacity
  //     style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //     onPress={() =>
  //       props.navigation.navigate("SettingsScreen", {
  //         user: user,
  //       })
  //     }
  //   >
  //     <View>
  //       <Ionicons name="ios-settings" size={24} color={color.white} />
  //     </View>
  //   </TouchableOpacity>
  // </View>

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
      onPress={() => props.navigation.navigate("HomeScreen")}
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
      onPress={() => props.navigation.navigate("MyCart")}
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
      onPress={() => props.navigation.navigate("ReceiveOrders")}
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
      onPress={() => props.navigation.navigate("SettingsScreen")}
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

export default Footer;
