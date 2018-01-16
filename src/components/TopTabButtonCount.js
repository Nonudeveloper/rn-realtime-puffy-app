import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";

const TopTabButtonCount = ({ onPress, count, children, selected }) => {
  const { buttonInactiveStyle, buttonActiveStyle, countStyle, textStyle, textStyleActive } = styles;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={selected == true ? buttonActiveStyle : buttonInactiveStyle}>
        <Text style={countStyle}>{count}</Text>
        <Text style={selected == true ? textStyleActive : textStyle}>{children}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  textStyle: {
    color: "#808080",
    fontFamily: "Helvetica",
    fontSize: 14
  },
  textStyleActive: {
    color: "#00B1BB",
    fontFamily: "Helvetica",
    fontSize: 14
  },
  countStyle: {
    color: "#000",
    fontFamily: "Helvetica",
    fontSize: 18
  },
  buttonInactiveStyle: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 3,
    borderColor: "transparent",
    width: 80
  },
  buttonActiveStyle: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 3,
    borderColor: "#00B1BB",
    width: 80
  }
};

export default TopTabButtonCount;
