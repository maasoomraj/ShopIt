import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ColorPropType,
} from "react-native";
import color from "../assets/colors";
import CustomActionButton from "../components/CustomActionButton";
import * as firebase from "firebase/app";
require("firebase/auth");
require("firebase/database");

class LoginScreen extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  login = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);

        if (response) {
          this.setState({ isLoading: false });

          this.props.navigation.navigate("LoadingScreen");
        }
      } catch (error) {
        this.setState({ isLoading: false });
        console.log(error);
        if (error.code == "auth/invalid-email") {
          alert("Enter valid email-address");
        }
        if (error.code == "auth/user-not-found") {
          alert("User doesnot exists. SignUp first");
        }
        if (
          error.message ==
          "The password is invalid or the user does not have a password."
        ) {
          alert("Password is wrong");
        }
      }
    } else {
      alert("Enter email id and password");
    }
  };

  signUp = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );

        if (response) {
          this.setState({ isLoading: false });

          await firebase
            .database()
            .ref("users/")
            .child(response.user.uid)
            .set({ email: response.user.email, uid: response.user.uid });

          this.props.navigation.navigate("LoadingScreen");

          // Login User
          // this.login();
        }
      } catch (error) {
        this.setState({ isLoading: false });
        console.log(error);
        if (error.code == "auth/email-already-in-use") {
          alert("User already exists. Try logging in");
        }
        if (error.message == "Password should be at least 6 characters") {
          alert("Password must be atleast 6 characters long");
        }
        if (error.code == "auth/invalid-email") {
          alert("Enter a valid email address");
        }
      }
    } else {
      alert("Enter a valid email and password");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.textInput}
            placeholder="abc@example.com"
            onChangeText={(email) => this.setState({ email: email })}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            onChangeText={(password) => this.setState({ password: password })}
            secureTextEntry
          />

          <View style={styles.buttonArea}>
            <CustomActionButton onPress={this.login} style={styles.button}>
              <Text style={styles.text}>Login</Text>
            </CustomActionButton>

            <CustomActionButton onPress={this.signUp} style={styles.button}>
              <Text style={styles.text}>SignUp</Text>
            </CustomActionButton>
          </View>
        </View>

        {this.state.isLoading ? (
          <ActivityIndicator size="large" color={color.logocolor} />
        ) : null}
        <View style={styles.footer}></View>
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  textInput: {
    marginRight: 40,
    marginLeft: 40,
    borderWidth: 0.5,
    borderColor: color.black,
    height: 50,
    paddingLeft: 15,
    marginBottom: 10,
    color: color.black,
    borderRadius: 23,
  },
  header: {
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    flex: 1,
  },
  buttonArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: color.black,
    marginBottom: 5,
  },
  text: {
    color: color.black,
  },
});
