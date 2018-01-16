import React from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import Images from "../config/images";
import LinearGradient from "react-native-linear-gradient";

const Header = ({ deviceTheme, LeftIcon, LeftText, LeftCallback, RightIcon, RightCallback, RightIconStyle, title, unread_count, global, devMode }) => {
  const { containerStyle, textStyle, backStyle, backStyleText } = styles;
  return (
    <View>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
        colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
        style={styles["container" + deviceTheme]}
      >
        {LeftIcon == null ? null : (
          <TouchableOpacity
            onPress={() => {
              LeftCallback();
            }}
            style={backStyle}
          >
            <Image style={styles.backIcon} source={Images[LeftIcon]} />
          </TouchableOpacity>
        )}
        {LeftText == null ? null : (
          <TouchableOpacity
            onPress={() => {
              LeftCallback();
            }}
            style={backStyleText}
          >
            <Text style={styles.backText}>{LeftText}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.get_my_profileget_my_profile}>
          {devMode === 1 ? <Text style={styles.devText}>DEV</Text> : <Image style={styles.headerLogoImg} source={Images.logo_white} />}
        </View>
        {RightIcon == null ? null : (
          <TouchableOpacity
            onPress={() => {
              RightCallback();
            }}
            style={Platform.OS === "android" && unread_count > 0 ? styles.rightStyleAndroid : styles.rightStyle}
          >
            {unread_count > 0 ? (
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
                    {unread_count}
                  </Text>
                </View>
              </View>
            ) : (
              <Image style={RightIconStyle == null ? styles.messageIcon : styles[RightIconStyle]} source={Images[RightIcon]} />
            )}
          </TouchableOpacity>
        )}
      </LinearGradient>
      {title == null ? null : (
        <View style={styles.section}>
          <Text style={styles.boldHeader}>{title}</Text>
        </View>
      )}
      {global.networkStatus === false ? (
        <View style={styles.sectionError}>
          <Text style={styles.headerError}>You have no internet connection</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = {
  containerIphoneX: {
    height: 95,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#826DA8",
    borderBottomWidth: 1
  },
  containerIphone: {
    height: 67,
    paddingTop: 10,
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
  backStyleText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    borderWidth: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderColor: "transparent"
  },
  backStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    borderWidth: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 6,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  backText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Helvetica",
    backgroundColor: "transparent"
  },
  textStyle: {
    fontSize: 20,
    color: "#C8C8C8"
  },
  menuIcon: {
    marginRight: 2,
    marginBottom: 2,
    width: 22,
    height: 25,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  settingsIcon: {
    width: 27,
    height: 28,
    marginRight: 5,
    marginBottom: 1,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  messageIcon: {
    width: 27,
    height: 27,
    marginRight: 5,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  headerLogo: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  headerLogoImg: {
    marginTop: 10,
    width: 35,
    height: 35,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    ...Platform.select({
      android: {
        marginTop: 5
      }
    })
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
  section: {
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 20,
    paddingRight: 20
  },
  boldHeader: {
    fontSize: 16,
    fontFamily: "Helvetica",
    textAlign: "center",
    color: "#181818"
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
  devText: {
    marginTop: 5,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Helvetica",
    textAlign: "center",
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

export default Header;
