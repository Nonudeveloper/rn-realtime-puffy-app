import React from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import Images from "../config/images";

const BtnIcon = props => {
  return (
    <TouchableOpacity style={props.active === true ? styles["btn" + props.theme_active] : styles.btn} onPress={props.onPress}>
      <View style={styles.iconOutline}>
        <Image style={styles.icon} source={props.active === true ? Images[props.icon_active] : Images[props.icon]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  btn: {
    borderWidth: 1,
    borderColor: "#BFBFBF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnPink: {
    borderWidth: 1,
    borderColor: "#DC90B5",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  btnGreen: {
    borderWidth: 1,
    borderColor: "#18B5C3",
    borderRadius: 5,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  icon: {
    width: 130,
    height: 110,
    borderRadius: 5,
    resizeMode: "cover",
    alignSelf: "center"
  },
  iconOutline: {
    borderWidth: 2,
    borderColor: "#BFBFBF50",
    borderRadius: 10,
    shadowColor: "#BFBFBF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2
  }
};

export default BtnIcon;
