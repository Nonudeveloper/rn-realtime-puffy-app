import React from "react";
import { TouchableOpacity, Text } from "react-native";

const BtnOutlineLogin = props => {
  return (
    <TouchableOpacity style={styles.btn} onPress={props.onPress}>
      <Text style={styles.btnText}>{props.value}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  btn: {
    height: 30,
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 5,
    marginBottom: 0,
    marginTop: 7,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Helvetica"
  }
};

export default BtnOutlineLogin;
