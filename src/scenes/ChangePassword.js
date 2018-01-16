import React, { Component } from "react";
import { AsyncStorage, KeyboardAvoidingView, Text, ScrollView, View, Button, Image, Picker, TouchableOpacity, Dimensions, Alert } from "react-native";
import DatePicker from "react-native-datepicker";
import { ImgInput, ImgInputMultiline, GenderInput, BtnSaveTxt } from "../components";
import Images from "../config/images";
import Header from "../components/Header";
import FilterInput from "../components/FilterInput";
import InputTextIcon from "../components/InputTextIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions } from "react-navigation";
import moment from "moment";

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.bug = this.props.screenProps.bug.bind(this);
    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.onListener = this.onListener.bind(this);
    this.goBack = this.goBack.bind(this);

    this.state = {
      password1: "",
      password2: "",
      password3: ""
    };
  }

  onListener(data) {
    if (data["result"] == 1 && data["result_action"] == "update_password") {
      Alert.alert("Success", "Change Password ok");

      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "index" })]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (data["result"] == 0 && data["result_action"] == "update_password") {
      Alert.alert("Incorrect", data["result_text"]);
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.onListener);
  }

  componentDidMount() {
    this.puffyChannel.on("data_channel", this.onListener);
  }

  updatePassword() {
    if (this.state.password2 === "") {
      Alert.alert("Incorrect", "Please enter your current and new password");
      return false;
    }

    if (this.state.password3 == this.state.password1) {
      Alert.alert("Incorrect", "New password same as current password");
      return false;
    }

    if (this.state.password2 !== this.state.password1) {
      Alert.alert("Incorrect", "New password does not match");
      return false;
    }

    if (this.state.password2.length <= 5) {
      Alert.alert("Incorrect", "New password must be atleast 6 characters");
      return false;
    }

    let dataString = {
      user_action: "update_password",
      user_data: {
        password2: this.state.password2,
        password3: this.state.password3
      }
    };

    this.handleEmit(dataString);
  }

  goBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftIcon="back_arrow"
          LeftCallback={this.goBack}
          RightIcon="checkmark_button"
          RightCallback={this.updatePassword}
          title="Change Password"
          global={this.props.screenProps.global}
        />

        <KeyboardAwareScrollView style={styles.content} overScrollMode="never" scrollEnabled={true}>
          <InputTextIcon
            inputRef={node => (this.password3 = node)}
            icon="lock_icon"
            value={this.state.password3}
            placeholder="Current Password"
            returnKeyType="done"
            keyboardType="default"
            maxLength={100}
            secureTextEntry
            onChangeText={password3 => this.setState({ password3 })}
          />

          <InputTextIcon
            inputRef={node => (this.password1 = node)}
            icon="lock_icon"
            value={this.state.password1}
            placeholder="New Password"
            returnKeyType="done"
            keyboardType="default"
            maxLength={100}
            secureTextEntry
            passwordMatchTrue={this.state.password1 == this.state.password2 && this.state.password2.length > 5 ? true : false}
            onChangeText={password1 => this.setState({ password1 })}
          />

          <InputTextIcon
            inputRef={node => (this.password2 = node)}
            icon="verify_key"
            value={this.state.password2}
            placeholder="Verify New Password"
            returnKeyType="done"
            keyboardType="default"
            maxLength={100}
            secureTextEntry
            passwordMatchTrue={this.state.password1 == this.state.password2 && this.state.password2.length > 5 ? true : false}
            onChangeText={password2 => this.setState({ password2 })}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  content: {
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30
  }
};

export { ChangePassword };
