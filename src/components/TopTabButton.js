import React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";

const TopTabButton = ({ onPress, children, selected }) => {
  const { buttonInactiveStyle, buttonActiveStyle, textStyle, textStyleActive } = styles;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={selected == true ? buttonActiveStyle : buttonInactiveStyle}>
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
  }
};

export default TopTabButton;
