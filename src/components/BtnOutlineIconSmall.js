import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import Images from "../config/images";

const BtnOutlineIconSmall = props => {
  return (
    <TouchableOpacity style={props.active === true ? styles["btn" + props.theme_active] : styles.btn} onPress={props.onPress}>
      <View style={styles.iconOutline}>
        <Image style={styles.icon} source={props.active === true ? Images[props.icon_active] : Images[props.icon]} />
        <Text style={props.active === true ? styles["btnText" + props.theme_active] : styles.btnText}>{props.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  btn: {
    borderWidth: 1,
    borderColor: "#BFBFBF",
    borderRadius: 10,
    paddingLeft: 42,
    paddingRight: 42,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnText: {
    color: "#BFBFBF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Helvetica"
  },
  btnPink: {
    borderWidth: 1,
    borderColor: "#DC90B5",
    borderRadius: 10,
    paddingLeft: 42,
    paddingRight: 42,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "center",
    shadowColor: "#DC90B5",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnTextPink: {
    color: "#DC90B5",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Helvetica"
  },
  btnGreen: {
    borderWidth: 1,
    borderColor: "#18B5C3",
    borderRadius: 10,
    paddingLeft: 42,
    paddingRight: 42,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "center",
    shadowColor: "#18B5C3",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnTextGreen: {
    color: "#18B5C3",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Helvetica"
  },
  icon: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    alignSelf: "center"
  }
};

export default BtnOutlineIconSmall;
