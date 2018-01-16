import React, { Component } from "react";
import { Alert, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Images from "../config/images";
import Header from "../components/Header";
import InputText from "../components/InputText";
import InputTextMulti from "../components/InputTextMulti";
import InputDate from "../components/InputDate";

class Begin extends Component {
  constructor(props) {
    super(props);

    this.logout = this.props.screenProps.logout.bind(this);
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setAboutme = this.setAboutme.bind(this);
    this.cancel = this.cancel.bind(this);
    this.focusNextField = this.focusNextField.bind(this);
    this.puffyChannel = this.props.screenProps.puffyChannel;

    let age_limit = 18;
    let required_date = new Date();
    required_date.setFullYear(required_date.getFullYear() - age_limit);

    this.state = {
      required_age: age_limit,
      required_date: required_date,
      username: "",
      refCode: "",
      name: this.props.screenProps.global.user_firstlast,
      dob: "",
      about: "",
      characterCount: 30
    };
  }

  setUsername() {
    if (this.state.username == "") {
      // It has any kind of whitespace
      Alert.alert("Error", "Please enter your username");
      return false;
    }

    if (this.state.username.length <= 3) {
      Alert.alert("Error", "Username must have a minimum of 4 characters");
      return false;
    }

    if (this.state.username.length > 12) {
      Alert.alert("Error", "Username can not be greater then 12 characters");
      return false;
    }

    if (/\s/.test(this.state.username)) {
      Alert.alert("Error", "Username can not have spaces");
      return false;
    }

    if (/[^a-zA-Z0-9]/.test(this.state.username)) {
      Alert.alert("Error", "Username must be alphanumeric");
      return false;
    }

    if (!isNaN(this.state.username.charAt(0))) {
      Alert.alert("Error", "Username cannot begin with a number");
      return false;
    }

    if (this.state.name == "") {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }

    if (this.state.dob === "") {
      Alert.alert("Error", "Please enter your birthday");
      return false;
    } else {
      let user_birthday = new Date(this.state.dob);

      if (user_birthday > this.state.required_date) {
        Alert.alert("Error", "You have to be at least " + this.state.required_age + " to register ");
        return false;
      }
    }

    let dataString = {
      user_action: "set_username",
      user_data: {
        username: this.state.username,
        name: this.state.name,
        dob: this.state.dob,
        about: this.state.about,
        refCode: this.state.refCode
      }
    };
    this.handleEmit(dataString);
  }

  focusNextField(id) {
    this[id].focus();
  }

  setAboutme(text) {
    var count = text.length;
    var characterCount = 30 - count;

    this.setState({ about: text, characterCount: characterCount });
  }

  cancel() {
    Alert.alert("Confirmation", "Are you sure you want to cancel?", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.logout() }]);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftText="cancel"
          LeftCallback={this.cancel}
          RightIcon="checkmark_button"
          RightCallback={this.setUsername}
          title="Let's Begin!"
          global={this.props.screenProps.global}
        />

        <KeyboardAwareScrollView overScrollMode="never" scrollEnabled={true} style={styles.content}>
          <Text style={styles.headerText}>Be creative with your username and let other Puffers get to know you</Text>
          <InputText
            inputRef={node => (this.username = node)}
            value={this.state.username}
            placeholderTextColor="#505050"
            placeholder="Create Username"
            returnKeyType="done"
            keyboardType="default"
            theme="dark"
            maxLength={12}
            onSubmitEditing={() => this.focusNextField("name")}
            onChangeText={username => this.setState({ username })}
          />
          <InputText
            inputRef={node => (this.name = node)}
            value={this.state.name}
            placeholderTextColor="#505050"
            placeholder="Full Name"
            returnKeyType="done"
            keyboardType="default"
            theme="dark"
            maxLength={24}
            onSubmitEditing={() => this.focusNextField("refCode")}
            onChangeText={name => this.setState({ name })}
          />
          <InputText
            inputRef={node => (this.refCode = node)}
            value={this.state.refCode}
            placeholderTextColor="#505050"
            placeholder="Referral Code"
            returnKeyType="done"
            keyboardType="default"
            theme="dark"
            maxLength={12}
            onChangeText={refCode => this.setState({ refCode })}
          />
          <InputDate value={this.state.dob} onDateChange={dob => this.setState({ dob })} />
          <InputTextMulti
            inputRef={node => (this.about = node)}
            value={this.state.about}
            placeholderTextColor="#505050"
            label="About Me"
            placeholder="Say something fun about you..."
            returnKeyType="done"
            keyboardType="default"
            theme="dark"
            maxLength={30}
            multiline={false}
            characterCount={this.state.characterCount}
            onSubmitEditing={this.setUsername}
            onChangeText={about => this.setAboutme(about)}
          />
        </KeyboardAwareScrollView>
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
  headerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#505050",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 20
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    alignItems: "center",
    flexDirection: "row"
  },
  tos: {
    fontSize: 12,
    color: "#7A7D83"
  },
  btnTosText: {
    marginLeft: 2,
    fontSize: 12,
    color: "#0FB7ED"
  }
};

export { Begin };
