import React from "react";
import { TouchableOpacity, Image, Text } from "react-native";
import Images from "../config/images";

const BtnWhiteIcon = props => {
  return (
    <TouchableOpacity style={styles.btn} onPress={props.onPress}>
      <Text style={styles.btnText}>{props.value}</Text>
      <Image style={styles.icon} source={Images[props.icon]} />
    </TouchableOpacity>
  );
};

const styles = {
  btn: {
    height: 35,
    borderRadius: 5,
    backgroundColor: "#FFF",
    marginBottom: 10,
    marginTop: 10,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    flex: 1
  },
  icon: {
    position: "absolute",
    top: 5,
    left: 25,
    height: 25,
    width: 25,
    resizeMode: "contain"
  },
  btnText: {
    color: "#3879A2",
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Helvetica"
  }
};

export default BtnWhiteIcon;
