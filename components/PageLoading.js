import React, { Component } from "react";
import { View, Text } from "react-native";

import color from "../assets/colors";
import { MaterialIndicator } from "react-native-indicators";

const PageLoading = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <MaterialIndicator color={color.bgMain} />
  </View>
);

export default PageLoading;
