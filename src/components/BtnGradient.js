import React from "react";
import { TouchableOpacity, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient"

const BtnGradient = props => {
  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.25 }}
      end={{ x: 0.0, y: 1.0 }}
      locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
      colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
      style={[props.style, styles.btnContainer]}
    >
      <TouchableOpacity style={styles.btn} onPress={props.onPress}>
        <Text style={[props.textStyle, styles.btnText]}>{props.value}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = {
  btnContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5
  },
  btn: {
    backgroundColor: "transparent",
    justifyContent: "center"
  },
  btnText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Helvetica"
  }
};

export default BtnGradient;
