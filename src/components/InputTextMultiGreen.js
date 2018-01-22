import React from "react";
import { View, Text, TextInput, Image } from "react-native";
import Images from "../config/images";

const InputTextMultiGreen = props => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label]}>{props.label}</Text>
      <TextInput
        ref={node => {
          props.inputRef && props.inputRef(node);
        }}
        value={props.value}
        style={[styles[props.theme], styles.input]}
        returnKeyType={props.returnKeyType}
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        onSubmitEditing={props.onSubmitEditing}
        secureTextEntry={props.secureTextEntry}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
        autoFocus={false}
        autoCorrect={false}
        numberOfLines={4}
        underlineColorAndroid="transparent"
        maxLength={props.maxLength}
        multiline={props.multiline}
      />
      <Text style={styles.textLeft}>{props.characterCount} characters left</Text>
    </View>
  );
};

const styles = {
  container: {
    marginBottom: 15
  },
  label: {
    color: "#18B5C3",
    marginLeft: 3,
    marginBottom: 3,
    fontSize: 14
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 10,
    paddingRight: 15,
    fontSize: 15
  },
  light: {
    height: 40,
    color: "#FFF",
    borderColor: "#aec3cd"
  },
  dark: {
    height: 80,
    color: "#181818",
    borderColor: "#18B5C3"
  },
  support: {
    height: 125,
    color: "#18B5C3",
    borderColor: "#18B5C3"
  },
  textLeft: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 3,
    color: "#3EA9A9"
  }
};

export default InputTextMultiGreen;
