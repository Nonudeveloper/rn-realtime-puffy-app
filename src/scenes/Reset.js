import React, { Component } from "react";
import { Platform, KeyboardAvoidingView, Text, View, Image, Alert } from "react-native";
import { NavigationActions } from "react-navigation";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import Images from "../config/images";
import InputText from "../components/InputText";
import BtnWhite from "../components/BtnWhite";
import BtnOutline from "../components/BtnOutline";
import ajaxPost from "../lib/ajaxPost";

class Reset extends Component {
  constructor(props) {
    super(props);

    this.updatePassword = this.updatePassword.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
    this.focusNextField = this.focusNextField.bind(this);

    this.state = {
      password1: "",
      password2: "",
      password3: ""
    };
  }

  cancelRequest() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Login" })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  updatePassword() {
    if (this.state.password2 === "") {
      Alert.alert("Error", "Please enter your email, name and password");
      return false;
    }

    if (this.state.password2 !== this.state.password1) {
      Alert.alert("Error", "Password does not match");
      return false;
    }

    if (this.state.password2.length <= 5) {
      Alert.alert("Error", "Password must be atleast 6 characters");
      return false;
    }

    let $this = this;
    let dataString = { user_reset_code: this.state.password3, user_password1: this.state.password2 };

    ajaxPost(dataString, "passwordReset", function(result) {
      //success
      if (result.result == 1) {
        Alert.alert("Success", "Change Password ok");
        $this.props.navigation.navigate("Login");
      } else {
        Alert.alert("Incorrect", "invalid reset code");
      }
    });
  }

  focusNextField(id) {
    this[id].focus();
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]}
          colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8", "#9467A5"]}
          style={styles.container}
        >
          <KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
            <View style={styles.header}>
              <Image style={styles.logo} source={Images.logo_white} />
              <Text style={styles.headerText}>Check Email For Code</Text>
            </View>
            <View style={styles.content}>
              <InputText
                inputRef={node => (this.password3 = node)}
                value={this.state.password3}
                placeholderTextColor="#FFF"
                placeholder="Enter Code"
                returnKeyType="done"
                keyboardType="default"
                theme="light"
                onSubmitEditing={() => this.focusNextField("password1")}
                onChangeText={password3 => this.setState({ password3 })}
              />
              <InputText
                inputRef={node => (this.password1 = node)}
                value={this.state.password1}
                placeholderTextColor="#FFF"
                placeholder="New Password"
                returnKeyType="done"
                keyboardType="default"
                secureTextEntry={true}
                theme="light"
                onChangeText={password1 => this.setState({ password1 })}
                onSubmitEditing={() => this.focusNextField("password2")}
                passwordMatchTrue={this.state.password1 == this.state.password2 && this.state.password2.length > 5 ? true : false}
              />
              <InputText
                inputRef={node => (this.password2 = node)}
                value={this.state.password2}
                placeholderTextColor="#FFF"
                placeholder="Verify New Password"
                returnKeyType="done"
                keyboardType="default"
                secureTextEntry={true}
                theme="light"
                onSubmitEditing={this.updatePassword}
                onChangeText={password2 => this.setState({ password2 })}
                passwordMatchTrue={this.state.password1 == this.state.password2 && this.state.password2.length > 5 ? true : false}
              />
              <BtnWhite value="Submit" onPress={this.updatePassword} />
              {Platform.OS === "android" ? (
                <View style={styles.footerAndroid}>
                  <BtnOutline value="Back To Log In" onPress={this.cancelRequest} />
                </View>
              ) : null}
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
        {Platform.OS === "android" ? null : (
          <View style={styles.footer}>
            <BtnOutline value="Back To Log In" onPress={this.cancelRequest} />
          </View>
        )}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  header: {
    marginTop: 40,
    alignItems: "center"
  },
  logo: {
    width: 115,
    height: 115,
    resizeMode: "contain"
  },
  headerText: {
    marginTop: 20,
    fontSize: 30,
    color: "#FFF"
  },
  content: {
    marginTop: 45,
    marginLeft: 30,
    marginRight: 30
  },
  btnForgot: {
    marginTop: 5
  },
  btnForgotText: {
    fontSize: 12,
    color: "#0FB7ED"
  },
  textNotPuffer: {
    marginTop: 30,
    marginBottom: 5,
    fontSize: 14,
    textAlign: "center",
    color: "#FFF"
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20
  },
  footerAndroid: {
    marginTop: 60
  }
};

export { Reset };
