import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import Images from "../config/images";

const BtnOutlineIcon = props => {
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
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnText: {
    color: "#BFBFBF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    width: 65,
    fontFamily: "Helvetica"
  },
  btnPink: {
    borderWidth: 1,
    borderColor: "#DC90B5",
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnTextPink: {
    color: "#DC90B5",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    width: 65,
    fontFamily: "Helvetica"
  },
  btnGreen: {
    borderWidth: 1,
    borderColor: "#18B5C3",
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnTextGreen: {
    color: "#18B5C3",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
    width: 65,
    fontFamily: "Helvetica"
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    alignSelf: "center"
  },
  iconOutline: {
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 2,
    borderColor: "#BFBFBF50",
    borderRadius: 5,
    shadowColor: "#BFBFBF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  }
};

export default BtnOutlineIcon;
