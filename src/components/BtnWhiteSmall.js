import React from "react";
import { TouchableOpacity, Text } from "react-native";

const BtnWhiteSmall = props => {
  return (
    <TouchableOpacity style={styles.btn} onPress={props.onPress}>
      <Text style={styles.btnText}>{props.value}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  btn: {
    height: 35,
    borderRadius: 5,
    backgroundColor: "#FFF",
    marginBottom: 5,
    marginTop: 5,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnText: {
    color: "#3879A2",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Helvetica"
  }
};

export default BtnWhiteSmall;
