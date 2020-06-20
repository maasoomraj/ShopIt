import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
} from "react-navigation";
import { Ionicons } from "@expo/vector-icons";
import { fromRight } from "react-navigation-transitions";

import WelcomeScreen from "./screens/AppSwitchNavigator/WelcomeScreen";
import LoadingScreen from "./screens/AppSwitchNavigator/LoadingScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SettingsScreen from "./screens/SettingsScreen";
import DrawerComponent from "./screens/DrawerNavigator/DrawerComponent";
import color from "./assets/colors";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config";

class App extends React.Component {
  constructor() {
    super();

    this.firebaseInitialise();
  }

  firebaseInitialise = () => {
    firebase.initializeApp(firebaseConfig);
  };

  render() {
    return <AppContainer />;
  }
}

const AppStackNavigator = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    LoginScreen,
  },
  {
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: color.white,
      },
    },
  }
);

const AppDrawNavigator = createDrawerNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        title: "Home",
        drawerIcon: () => <Ionicons name="ios-home" size={24} />,
      },
    },
    SettingsScreen: {
      screen: SettingsScreen,
      navigationOptions: {
        title: "Settings",
        drawerIcon: () => <Ionicons name="ios-settings" size={24} />,
      },
    },
  },
  {
    contentComponent: DrawerComponent,
  }
);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen,
  AppStackNavigator,
  AppDrawNavigator,
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default App;
