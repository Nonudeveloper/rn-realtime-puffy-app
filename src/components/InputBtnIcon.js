import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import Images from "../config/images";

const InputBtnIcon = props => {
  return (
    <View style={styles.container}>
       <Image style={styles.icon} source={Images[props.icon]} />
       <TouchableOpacity style={styles.btn} onPress={props.onPress} >
        <Text style={styles.textCenter}>{props.text}</Text>
       </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  icon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    alignSelf: 'center'
  },
  btn: {
    flex: 1,
    borderColor: "#D3D2D3",
    height: 40,
    marginTop: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 10,
    paddingRight: 15,
  },
  textCenter: {
    alignSelf: 'center',
    color: "#72777F",
    fontSize: 15
  },
};

export default InputBtnIcon;
