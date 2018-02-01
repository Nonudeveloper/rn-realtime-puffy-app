import React, { Component } from "react";
import { View, Text, TextInput, Image, Dimensions, TouchableOpacity, Platform } from "react-native";
import Images from "../config/images";
import LinearGradient from "react-native-linear-gradient";

class HeaderSearch extends Component {
  constructor(props) {
    super(props);

    this.resetText = this.resetText.bind(this);
    this.showClose = this.showClose.bind(this);

    this.state = {
      showMenu: false,
      closeIcon: false
    };
  }

  resetText() {
    this._textInput.clear();
    this._textInput.blur();
    this.setState({ closeIcon: false });
    this.props.onChange("clear");
  }

  showClose() {
    this.setState({ closeIcon: true });

    if (this.props.placeholder == "Search a user") {
      this.props.onChange("");
    }
  }

  onBlur() {
    // console.log("blur");
  }

  render() {
    return (
      <View>
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
          colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
          style={styles["container" + this.props.deviceTheme]}
        >
          {this.props.LeftIcon == null ? null : (
            <TouchableOpacity
              onPress={() => {
                this.props.LeftCallback();
              }}
              style={styles.backStyle}
            >
              <Image style={this.props.LeftIcon == "photo_plus" ? styles.backIconPlus : styles.backIcon} source={Images[this.props.LeftIcon]} />
            </TouchableOpacity>
          )}

          <View style={styles.containerRow}>
            <View style={styles.inputStyle}>
              <TextInput
                ref={component => (this._textInput = component)}
                style={styles.inputSearch}
                underlineColorAndroid="transparent"
                returnKeyType="search"
                autoFocus={false}
                autoCorrect={false}
                onFocus={this.showClose}
                onBlur={this.onBlur}
                onChangeText={text => this.props.onChange({ text })}
                placeholder={this.props.placeholder}
                placeholderTextColor="#FFF"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.resetText();
              }}
            >
              <Image style={styles.closeStyle} source={Images.search_icon_white} />
            </TouchableOpacity>
          </View>
          {this.state.closeIcon == true ? (
            <TouchableOpacity
              onPress={() => {
                this.resetText();
              }}
              style={styles.rightStyleCancel}
            >
              <Text style={styles.cancelStyle}>Cancel</Text>
            </TouchableOpacity>
          ) : null}

          {this.state.closeIcon == true || this.props.RightIcon == null ? null : (
            <TouchableOpacity
              onPress={() => {
                this.props.RightCallback();
              }}
              style={Platform.OS === "android" && this.props.unread_count > 0 ? styles.rightStyleAndroid : styles.rightStyle}
            >
              {this.props.unread_count > 0 ? (
                <View style={Platform.OS === "ios" ? styles.unreadContainerViewIOS : styles.unreadContainerViewAndroid}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      alignSelf: "center",
                      justifyContent: "center",
                      borderRadius: 12,
                      backgroundColor: "#EE7600",
                      zIndex: 2
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#FFF",
                        fontWeight: "bold",
                        fontSize: 13,
                        fontFamily: "Helvetica",
                        backgroundColor: "transparent"
                      }}
                    >
                      {this.props.unread_count}
                    </Text>
                  </View>
                </View>
              ) : (
                <Image style={this.props.RightIconStyle == null ? styles.messageIcon : styles[this.props.RightIconStyle]} source={Images[this.props.RightIcon]} />
              )}
            </TouchableOpacity>
          )}
        </LinearGradient>
        {this.props.global.networkStatus === false ? (
          <View style={styles.sectionError}>
            <Text style={styles.headerError}>You have no internet connection</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = {
  containerIphoneX: {
    height: 95,
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#826DA8",
    borderBottomWidth: 1
  },
  containerIphone: {
    height: 67,
    paddingTop: 15,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#826DA8",
    borderBottomWidth: 1
  },
  containerIphoneSmall: {
    height: 62,
    paddingTop: 12,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#826DA8",
    borderBottomWidth: 1
  },
  containerAndroid: {
    height: 45,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#826DA8",
    borderBottomWidth: 1
  },
  backStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    borderWidth: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    borderColor: "transparent"
  },
  backIcon: {
    height: 30,
    width: 25,
    marginRight: 5,
    marginLeft: 5,
    resizeMode: "contain",
    alignSelf: "center",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  backIconPlus: {
    height: 30,
    width: 30,
    marginRight: 5,
    marginLeft: 5,
    resizeMode: "contain",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  containerRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFF",
    marginTop: 5,
    marginLeft: 50,
    marginRight: 70,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  imgStyle: {
    height: 18,
    width: 18,
    marginRight: 10,
    marginLeft: 10,
    resizeMode: "contain",
    alignSelf: "center"
  },
  inputStyle: {
    flex: 1,
    backgroundColor: "transparent",
    marginRight: 10
  },
  inputSearch: {
    height: 20,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    marginTop: 5,
    color: "#FFF",
    backgroundColor: "transparent"
  },
  closeStyle: {
    height: 15,
    width: 15,
    resizeMode: "contain",
    marginBottom: 5,
    marginTop: 8,
    paddingTop: 15,
    marginRight: 10
  },
  rightStyleCancel: {
    position: "absolute",
    bottom: 0,
    right: 0,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 14,
    paddingRight: 14
  },
  rightStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 1,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 5,
    paddingRight: 5,
    borderColor: "transparent"
  },
  rightStyleAndroid: {
    position: "absolute",
    top: 6,
    right: 5,
    borderWidth: 1,
    paddingTop: 30,
    paddingLeft: 30,
    borderColor: "transparent"
  },
  unreadContainerViewIOS: {
    position: "absolute",
    bottom: 6,
    right: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "transparent",
    zIndex: 2
  },
  unreadContainerViewAndroid: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "transparent",
    zIndex: 2
  },
  messageIcon: {
    width: 27,
    height: 27,
    marginRight: 5,
    marginBottom: 1,
    resizeMode: "contain",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  cancelStyle: {
    fontSize: 14,
    color: "#FFF",
    backgroundColor: "transparent"
  },
  sectionError: {
    backgroundColor: "#FF0000"
  },
  headerError: {
    color: "#FFF",
    marginTop: 2,
    marginBottom: 2,
    fontSize: 13,
    fontFamily: "Helvetica",
    textAlign: "center"
  }
};

export default HeaderSearch;
