import React from "react";
import { TouchableOpacity, Text } from "react-native";

const BtnGreen = props => {
  return (
    <TouchableOpacity style={styles.btn} onPress={props.onPress}>
      <Text style={styles.btnText}>{props.value}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  btn: {
    height: 22,
    borderWidth: 1,
    borderColor: "#00AABA",
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 17,
    paddingRight: 17,
    justifyContent: "center"
  },
  btnText: {
    color: "#00AABA",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Helvetica"
  }
};

export default BtnGreen;
