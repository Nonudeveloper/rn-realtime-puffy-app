import React, { Component } from "react";
import { Alert, KeyboardAvoidingView, Text, ScrollView, View, Button, TouchableOpacity, Linking } from "react-native";
import Images from "../config/images";
import Header from "../components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputText from "../components/InputText";
import ajaxPost from "../lib/ajaxPost";

class Register extends Component {
  constructor(props) {
    super(props);

    this.openTos = this.openTos.bind(this);
    this.signup = this.signup.bind(this);
    this.focusNextField = this.focusNextField.bind(this);
    this.loginUser = this.props.screenProps.loginUser.bind(this);

    this.state = {
      email: "",
      password1: "",
      password2: ""
    };
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  signup() {
    if (this.state.email === "" || this.state.password1 === "" || this.state.password2 === "") {
      Alert.alert("Error", "Please enter your email and password");
      return false;
    }

    if (!this.validateEmail(this.state.email)) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }

    if (this.state.password1 !== this.state.password2) {
      Alert.alert("Error", "Password must match");
      return false;
    }

    if (this.state.password2.length <= 5) {
      Alert.alert("Error", "Password must be atleast 6 characters");
      return false;
    }

    let $this = this;
    let dataString = { user_email: this.state.email, user_password1: this.state.password2 };

    ajaxPost(dataString, "createUser", function(result) {
      //success
      if (result.result == 1) {
        console.log(result);
        $this.loginUser(result);
      } else {
        //fail
        Alert.alert("Registered Email", "Email has an existing account");
      }
    });
  }

  focusNextField(id) {
    this[id].focus();
  }

  openTos() {
    Linking.openURL("http://puffyapp.com/tos");
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftIcon="back_arrow"
          LeftCallback={this.props.navigation.goBack}
          RightIcon="checkmark_button"
          RightCallback={this.signup}
          title="Sign Up!"
          global={this.props.screenProps.global}
        />
        <View style={styles.content}>
          <InputText
            inputRef={node => (this.email = node)}
            value={this.state.email}
            placeholderTextColor="#72777F"
            placeholder="Enter Email"
            returnKeyType="done"
            keyboardType="email-address"
            theme="dark"
            maxLength={50}
            onSubmitEditing={() => this.focusNextField("password1")}
            onChangeText={email => this.setState({ email })}
          />
          <InputText
            inputRef={node => (this.password1 = node)}
            value={this.state.password1}
            placeholderTextColor="#72777F"
            placeholder="Password (6 characters)"
            returnKeyType="done"
            keyboardType="default"
            secureTextEntry={true}
            theme="dark"
            onSubmitEditing={() => this.focusNextField("password2")}
            onChangeText={password1 => this.setState({ password1 })}
            passwordMatchTrue={this.state.password1 == this.state.password2 && this.state.password2.length > 5 ? true : false}
          />
          <InputText
            inputRef={node => (this.password2 = node)}
            value={this.state.password2}
            placeholderTextColor="#72777F"
            placeholder="Password Verification"
            returnKeyType="done"
            keyboardType="default"
            secureTextEntry={true}
            theme="dark"
            onSubmitEditing={this.signup}
            onChangeText={password2 => this.setState({ password2 })}
            passwordMatchTrue={this.state.password1 == this.state.password2 && this.state.password2.length > 5 ? true : false}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.tos}>By signing up, you agree to our</Text>
          <TouchableOpacity style={styles.btnTos} onPress={this.openTos}>
            <Text style={styles.btnTosText}>Terms & Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  content: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  tos: {
    fontSize: 11,
    color: "#7A7D83"
  },
  btnTosText: {
    marginLeft: 2,
    fontSize: 12,
    color: "#0FB7ED"
  }
};

export { Register };
