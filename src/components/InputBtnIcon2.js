import React from "react";
import { TouchableOpacity, View, Text, Image, Platform } from "react-native";
import Images from "../config/images";

const InputBtnIcon2 = props => {
  return (
    <View style={styles.container}>
      <Image style={props.icon == "group_icon" ? styles.iconLarge : styles.icon} source={Images[props.icon]} />
      <TouchableOpacity style={styles.btn} onPress={props.onPress}>
        <Text style={styles.textCenter}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    marginBottom: 13
  },
  iconLarge: {
    position: "absolute",
    top: 12,
    left: 8,
    height: 20,
    width: 20,
    resizeMode: "contain"
  },
  icon: {
    position: "absolute",
    top: 13,
    left: 10,
    height: 16,
    width: 16,
    resizeMode: "contain"
  },
  btn: {
    flex: 1,
    borderColor: "#18B5C3",
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 40,
    paddingBottom: 10,
    paddingRight: 15
  },
  textCenter: {
    color: "#181818",
    fontSize: 15
  }
};

export default InputBtnIcon2;
