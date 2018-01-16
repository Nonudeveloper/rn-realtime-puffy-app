import React from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { NavigationActions } from "react-navigation";
import Images from "../config/images";
import LinearGradient from "react-native-linear-gradient";

const HeaderMessage = ({ navigation, deviceTheme, backfunction, next, backRoute, nextFunction, nextText, user, global, children }) => {
  const { containerStyle, textStyle, textBtnStyle, cancelStyle, nextStyle, backStyle } = styles;

  return (
    <View>
      <View style={styles["container" + deviceTheme]}>
        <TouchableOpacity
          onPress={() => {
            backfunction();
          }}
          style={backStyle}
        >
          <Image style={styles.backIcon} source={Images.back_arrow} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile", { user: user })}>
          <Text style={textStyle}>{children}</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#97CBDD",
    borderBottomColor: "#C6D8E2",
    borderBottomWidth: 1
  },
  containerIphone: {
    height: 67,
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CBDD",
    borderBottomColor: "#C6D8E2",
    borderBottomWidth: 1
  },
  containerIphoneSmall: {
    height: 62,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CBDD",
    borderBottomColor: "#C6D8E2",
    borderBottomWidth: 1
  },
  containerAndroid: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CBDD",
    borderBottomColor: "#C6D8E2",
    borderBottomWidth: 1
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
  messageIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
    marginTop: 12,
    resizeMode: "contain"
  },
  headerLogo: {
    flex: 1,
    textAlign: "center",
    marginTop: 11
  },
  headerLogoImg: {
    width: 35,
    height: 35,
    resizeMode: "contain"
  },
  rightStyle: {
    position: "absolute",
    top: 10,
    right: 5
  },
  textBtnStyle: {
    color: "#000"
  },
  textStyle: {
    marginTop: 15,
    fontSize: 21,
    backgroundColor: "transparent",
    color: "#000",
    ...Platform.select({
      android: {
        marginTop: 0
      }
    })
  },
  cancelStyle: {
    position: "absolute",
    top: 30,
    left: 15
  },
  nextStyle: {
    position: "absolute",
    top: 30,
    right: 15
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

export { HeaderMessage };
