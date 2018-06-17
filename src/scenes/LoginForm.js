import React, { Component } from "react";
import { Alert, Text, ScrollView, View, Button, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import InputText from "../components/InputText";
import ajaxPost from "../lib/ajaxPost";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.loginUser = this.props.screenProps.loginUser.bind(this);
    this.login = this.login.bind(this);
    this.loginAdmin = this.loginAdmin.bind(this);
    this.setDevCount = this.setDevCount.bind(this);
    this.focusNextField = this.focusNextField.bind(this);

    let email = this.props.screenProps.user_email;
    this.state = {
      email: email,
      password: "",
      devCount: 0
    };
  }

  focusNextField(id) {
    this[id].focus();
  }

  loginAdmin() {
    if (this.state.email === "" || this.state.password === "") {
        Alert.alert("Error", "Please enter registered email and password");
        return false;
    }

    let $this = this;
    let dataString = { user_email: this.state.email, user_password1: this.state.password };

    ajaxPostDev(dataString, "checkLoginAdmin", function(result) {
        //success
        if (result.result == 1) {
            console.log(result);
            $this.loginUserAdmin(result);
        } else if (result == -1) {
            Alert.alert("Incorrect", "You have no internet connection");
        } else {
            //fail
            Alert.alert("Incorrect", "You entered the wrong Username and Password or You are not an admin. Please try again.", [
                { text: "Try again", onPress: () => console.log("try agan!") },
                { text: "Forgot?", onPress: () => $this.showForgot() }
            ]);
        }
    });
  }

  login() {
    if (this.state.email === "" || this.state.password === "") {
        Alert.alert("Error", "Please enter registered email and password");
        return false;
    }

    let $this = this;
    let dataString = { user_email: this.state.email, user_password1: this.state.password };

    ajaxPost(dataString, "checkLogin", function(result) {
        //success
        if (result.result == 1) {
            console.log(result);
            $this.loginUser(result);
        } else if (result == -1) {
            Alert.alert("Incorrect", "You have no internet connection");
        } else {
            //fail
            Alert.alert("Incorrect", "You entered the wrong Username and Password. Please try again.", [
                { text: "Try again", onPress: () => console.log("try agan!") },
                { text: "Forgot?", onPress: () => $this.showForgot() }
            ]);
        }
    });
  }

  setDevCount() {
    let devCount = this.state.devCount + 1;

    if (devCount > 5) {
        this.setState({ devCount: 0 });
    } else {
        this.setState({ devCount: devCount });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftIcon="back_arrow"
          LeftCallback={this.props.navigation.goBack}
          RightIcon="checkmark_button"
          RightCallback={this.state.devCount > 4 ? this.login : this.loginAdmin}
          title="Login!"
          global={this.props.screenProps.global}
        />
        <View style={styles.content}>
          <InputText
                inputRef={node => (this.email = node)}
                value={this.state.email}
                placeholderTextColor="#72777F"
                placeholder="Email"
                returnKeyType="done"
                keyboardType="email-address"
                theme="dark"
                maxLength={50}
                onSubmitEditing={() => this.focusNextField("password")}
                onChangeText={email => this.setState({ email })}
            />
            <InputText
                inputRef={node => (this.password = node)}
                value={this.state.password}
                placeholderTextColor="#72777F"
                placeholder="Password"
                returnKeyType="done"
                keyboardType="default"
                secureTextEntry={true}
                theme="dark"
                onSubmitEditing={this.checkLogin}
                onChangeText={password => this.setState({ password })}
            />
          
        </View>
        <View style={styles.footer}>
            <TouchableOpacity style={styles.btnDevMode} onPress={this.setDevCount}>
                <Text style={styles.btnDevModeText} />
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
  btnDevMode: {
   
  }
 
};

export { LoginForm };
