import React from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { NavigationActions } from "react-navigation";
import Images from "../config/images";
import LinearGradient from "react-native-linear-gradient";

const HeaderCamera = ({ navigation, deviceTheme, cancel, next, backRoute, nextFunction, nextText, LeftText, LeftCallback, event, keyBefore, keyC, children }) => {
  const { containerStyle, textStyle, textBtnStyle, cancelStyle, nextStyle, backStyle, backIcon, backStyleText } = styles;

  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: "index" })]
  });

  const resetAction2 = NavigationActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: "index" })]
  });

  const resetAction3 = NavigationActions.back({
    key: keyBefore
  });

  return (
    <View>
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
        colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
        style={styles["container" + deviceTheme]}
      >
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
        {cancel ? (
          <TouchableOpacity
            onPress={() => {
              //navigation.goBack();

              let gallery_check = 0;

              if (navigation.state.params == null) {
                gallery_check = 0;
              } else if (navigation.state.params.data == null) {
                gallery_check = 0;
              } else if (navigation.state.params.data.gallery == 1) {
                gallery_check = 1;
              } else if (navigation.state.params.data.gallery == 2) {
                gallery_check = 2;
              }

              if (event === 1) {
                navigation.dispatch(resetAction3);
              } else if (gallery_check === 2) {
                navigation.dispatch(resetAction2);
              } else if (gallery_check === 1) {
                navigation.dispatch(resetAction);
              } else {
                navigation.goBack();
              }
            }}
            style={backStyle}
          >
            <Image style={styles.backIcon} source={Images.back_arrow} />
          </TouchableOpacity>
        ) : null}
        <Text style={textStyle}>{children}</Text>
        {next ? (
          <TouchableOpacity
            onPress={() => {
              nextFunction();
            }}
            style={styles.rightStyle}
          >
            <Image style={styles.messageIcon} source={Images.checkmark_button} />
          </TouchableOpacity>
        ) : null}
      </LinearGradient>
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
    height: 52,
    paddingBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#826DA8",
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
    marginTop: 12,
    resizeMode: "contain",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  messageIcon: {
    width: 28,
    height: 28,
    marginRight: 7,
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
    resizeMode: "contain"
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
  textBtnStyle: {
    color: "#000"
  },
  textStyle: {
    marginTop: 15,
    fontSize: 22,
    backgroundColor: "transparent",
    color: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
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
  backText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "Helvetica",
    backgroundColor: "transparent"
  }
};

export { HeaderCamera };
