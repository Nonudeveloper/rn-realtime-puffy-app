import React from "react";
import { View, TextInput, Image } from "react-native";
import Images from "../config/images";

const InputText = props => {
  return (
    <View>
      <TextInput
        ref={node => {
          props.inputRef && props.inputRef(node);
        }}
        value={props.value}
        style={[styles[props.addError == true ? props.themeError : props.theme], styles.input]}
        returnKeyType={props.returnKeyType}
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        onSubmitEditing={props.onSubmitEditing}
        secureTextEntry={props.secureTextEntry}
        placeholder={props.placeholder}
        autoFocus={false}
        autoCorrect={false}
        maxLength={props.maxLength}
        underlineColorAndroid="transparent"
        placeholderTextColor={props.placeholderTextColor}
      />
      {props.passwordMatchTrue === true ? (
        <View style={styles.checkBoxContainer}>
          <Image style={styles.checkBox} source={Images.rounded_checkmark} />
        </View>
      ) : null}
    </View>
  );
};

const styles = {
  input: {
    height: 40,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 10,
    paddingRight: 15,
    fontSize: 15
  },
  light: {
    color: "#FFF",
    borderColor: "#DDD"
  },
  dark: {
    color: "#181818",
    borderColor: "#18B5C3"
  },
  darkRed: {
    color: "#181818",
    borderColor: "red"
  },
  checkBoxContainer: {
    position: "absolute",
    right: 0,
    top: 10
  },
  checkBox: {
    height: 20,
    width: 20,
    marginRight: 10,
    marginLeft: 5,
    resizeMode: "contain"
  }
};

export default InputText;
