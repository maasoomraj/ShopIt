import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Switch,
} from "react-native";
import CustomActionButton from "../components/CustomActionButton";
import color from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/auth";

import { Ionicons } from "@expo/vector-icons";
import PageLoading from "../components/PageLoading";
import Footer from "../components/Footer";
import LoadingFooter from "../components/LoadingFooter";
import Header from "../components/Header";

import { store } from "../helpers/redux-store";

class SettingsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  async componentDidMount() {
    let initialSwitch;
    for (let i in store.getState().restaurants) {
      if (store.getState().restaurants[i].key === store.getState().user.uid) {
        initialSwitch = store.getState().restaurants[i].status;
      }
    }

    this.setState({
      user: store.getState().user,
      loading: true,
      switch: initialSwitch,
    });

    BackHandler.addEventListener("hardwareBackPress", () =>
      this.props.navigation.navigate("SettingsScreen")
    );
  }

  onSwitch = async () => {
    // create restaurant in db
    try {
      await firebase
        .database()
        .ref("details/")
        .child(store.getState().user.uid)
        .update({
          status: true,
        });

      for (let i in store.getState().restaurants) {
        if (store.getState().restaurants[i].key === store.getState().user.uid) {
          store.getState().restaurants[i].status = true;
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  offSwitch = async () => {
    // create restaurant in db
    try {
      await firebase
        .database()
        .ref("details/")
        .child(this.state.user.uid)
        .update({
          status: false,
        });

      for (let i in store.getState().restaurants) {
        if (store.getState().restaurants[i].key === store.getState().user.uid) {
          store.getState().restaurants[i].status = false;
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  toggleSwitch = () => {
    if (this.state.switch) {
      this.offSwitch();
      this.setState({ switch: false });
    } else {
      this.onSwitch();
      this.setState({ switch: true });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Header text="My Restaurant" />

        {this.state.loading ? (
          <View style={styles.content}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("AddMenu")}
            >
              <View style={styles.view}>
                <Text style={styles.text}>Add Items</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("RestaurantDetails")
              }
            >
              <View style={styles.view}>
                <Text style={styles.text}>Edit Details</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.view}>
              <Text style={styles.text}>Open/Close</Text>
              <Switch
                style={{ position: "absolute", right: 10 }}
                value={this.state.switch}
                onValueChange={this.toggleSwitch}
              />
            </View>
          </View>
        ) : (
          <PageLoading />
        )}

        {this.state.loading ? (
          <Footer props={this.props} user={this.state.user} />
        ) : (
          <LoadingFooter />
        )}
      </View>
    );
  }
}

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    marginTop: StatusBar.currentHeight,
  },
  content: {
    flex: 1,
  },
  view: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: color.black,
    alignItems: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    paddingLeft: 10,
  },
  text: {
    fontSize: 18,
  },
});
