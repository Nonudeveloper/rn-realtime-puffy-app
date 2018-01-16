import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import Images from "../config/images";

const InputTextBtn = props => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={props.addError == 1 ? styles.btnError : styles.btn} onPress={props.onPress}>
        <Text style={styles.textCenter}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1
  },
  btnError: {
    flex: 1,
    borderColor: "red",
    height: 40,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 15
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
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 15
  },
  textCenter: {
    color: "#181818",
    fontSize: 15
  }
};

export default InputTextBtn;
