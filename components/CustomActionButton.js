import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import propTypes from "prop-types";
import color from "../assets/colors";

const CustomActionButton = ({ children, onPress, style, styleTouch }) => (
  <TouchableOpacity onPress={onPress} style={styleTouch}>
    <View style={[styles.button, style]}>{children}</View>
  </TouchableOpacity>
);

CustomActionButton.propTypes = {
  onPress: propTypes.func.isRequired,
  children: propTypes.element.isRequired,
  style: propTypes.object,
  styleTouch: propTypes.object,
};

CustomActionButton.defaultProps = {
  style: {},
  styleTouch: {},
};

export default CustomActionButton;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    backgroundColor: color.closemark,
    alignItems: "center",
    justifyContent: "center",
  },
});
