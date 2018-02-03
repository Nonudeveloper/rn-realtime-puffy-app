import React from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import Images from "../config/images";

const TopTabIcon = ({ onPress, off, on, selected }) => {
  const { buttonInactiveStyle, buttonActiveStyle, textStyle } = styles;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={selected == true ? buttonActiveStyle : buttonInactiveStyle}>
        <Image style={styles.icon} source={selected == true ? Images[on] : Images[off]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  textStyle: {
    color: "#808080"
  },
  buttonInactiveStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderBottomWidth: 3,
    borderColor: "transparent"
  },
  buttonActiveStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderBottomWidth: 3,
    borderColor: "#00B1BB"
  },
  icon: {
    width: 35,
    height: 35,
    marginBottom: 2,
    resizeMode: "contain",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  }
};

export default TopTabIcon;
