import React, { Component } from "react";
import { Text, View, Alert, TouchableOpacity, Image, ScrollView } from "react-native";
import Header from "../components/Header";
import InputTextMultiGreen from "../components/InputTextMultiGreen";
import { NavigationActions } from "react-navigation";
import Images from "../config/images";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class Misc extends Component {
  constructor(props) {
    super(props);

    this.logout = this.props.screenProps.logout.bind(this);
    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.appVersion = this.props.screenProps.appVersion;
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.submit = this.submit.bind(this);
    this.setText = this.setText.bind(this);
    this.onListener = this.onListener.bind(this);
    this.gotoBlockList = this.gotoBlockList.bind(this);
    this.gotoSupport = this.gotoSupport.bind(this);
    this.admin = this.props.screenProps.global.user_admin;
    this.showDeactivate = this.showDeactivate.bind(this);
    this.deActivateAccount = this.deActivateAccount.bind(this);

    this.state = {
      text: "",
      characterCount: 100
    };
  }

  onListener(data) {
    if (data["result"] == 1 && data["result_action"] == "deactivate_account_result") {
      this.logout();
    }

    if (data["result"] == 1 && data["result_action"] == "create_support_result") {
      Alert.alert("Completed", data["result_text"]);

      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "index" })]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (data["result"] == 0 && data["result_action"] == "create_support_result") {
      Alert.alert("Pending", data["result_text"]);
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.onListener);
  }

  componentDidMount() {
    this.puffyChannel.on("data_channel", this.onListener);
  }

  gotoSupport() {
    if (this.admin > 0) {
      this.props.navigation.navigate("Support");
    } else {
      this.props.navigation.navigate("BlockList");
    }
  }

  gotoBlockList() {
    this.props.navigation.navigate("BlockList");
  }

  submit() {
    if (this.state.text === "") {
      Alert.alert("Error", "Please enter text");
      return false;
    }

    let dataString = {
      user_action: "create_report",
      user_data: {
        text: this.state.text,
        type: "SUPPORT"
      }
    };

    this.handleEmit(dataString);
  }

  setText(text) {
    var count = text.length;
    var characterCount = 100 - count;

    this.setState({ text: text, characterCount: characterCount });
  }

  showDeactivate() {
    Alert.alert("Deactivate Account", "Are you sure?", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.deActivateAccount() }]);
  }

  deActivateAccount() {
    let dataString = {
      user_action: "deactivate_account",
      user_data: {
        reason: "USER"
      }
    };

    this.handleEmit(dataString);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftIcon="back_arrow"
          LeftCallback={this.props.navigation.goBack}
          RightIcon="checkmark_button"
          RightCallback={this.submit}
          title="Miscellaneous"
          global={this.props.screenProps.global}
        />

        <ScrollView>
          <TouchableOpacity onPress={this.gotoBlockList} style={styles.section}>
            <View style={styles.row}>
              <Text>Block List</Text>
              <View style={styles.rowImage}>
                <Image style={styles.imgStyle} source={Images.pencil} />
              </View>
            </View>
          </TouchableOpacity>

          {this.admin > 0 ? (
            <TouchableOpacity onPress={this.gotoSupport} style={styles.section}>
              <View style={styles.row}>
                <Text>Support Tickets</Text>
                <View style={styles.rowImage}>
                  <Image style={styles.imgStyle} source={Images.pencil} />
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
          <KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.boldHeader}>Support</Text>
            </View>
            <View style={styles.content}>
              <InputTextMultiGreen
                inputRef={node => (this.about = node)}
                value={this.state.text}
                placeholderTextColor="#72777F"
                label="Briefly explain the issue"
                placeholder=""
                returnKeyType="done"
                keyboardType="default"
                theme="support"
                maxLength={100}
                multiline={true}
                characterCount={this.state.characterCount}
                onSubmitEditing={this.submit}
                onChangeText={about => this.setText(about)}
              />
              <Text style={styles.version}>{this.appVersion}</Text>
            </View>
            <View style={styles.sectionEnd}>
              <TouchableOpacity onPress={this.showDeactivate}>
                <View style={styles.rowEnd}>
                  <Text style={styles.logoutBtn}>Deactivate my account</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  version: {
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#505050"
  },
  content: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20
  },
  section: {
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 2
  },
  row: {
    flexDirection: "row"
  },
  rowEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 22
  },
  rowImage: {
    alignItems: "flex-end",
    flex: 1
  },
  imgStyle: {
    height: 15,
    width: 15,
    resizeMode: "contain",
    marginRight: 10
  },
  sectionHeader: {
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 25,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  boldHeader: {
    fontSize: 16,
    fontFamily: "Helvetica",
    textAlign: "center",
    color: "#181818"
  },
  sectionEnd: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 10,
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    height: 25
  },
  logoutBtn: {
    color: "red",
    fontSize: 13,
    fontFamily: "Helvetica"
  }
};

export { Misc };
