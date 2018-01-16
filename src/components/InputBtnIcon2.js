import React from "react";
import { TouchableOpacity, View, Text, Image, Platform } from "react-native";
import Images from "../config/images";

const InputBtnIcon2 = props => {
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={Images[props.icon]} />
      <TouchableOpacity style={styles.btn} onPress={props.onPress}>
        <Text style={styles.textCenter}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1
  },
  icon: {
    position: "absolute",
    top: 20,
    left: 10,
    height: 16,
    width: 16,
    resizeMode: "contain"
  },
  btn: {
    flex: 1,
    borderColor: "#18B5C3",
    height: 40,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 40,
    paddingBottom: 10,
    paddingRight: 15,
    ...Platform.select({
      android: {
        marginBottom: 5
      }
    })
  },
  textCenter: {
    color: "#181818",
    fontSize: 15
  }
};

export default InputBtnIcon2;
