import React from "react";
import { TouchableOpacity, View, Text, TextInput, Image } from "react-native";
import Images from "../config/images";

const InputTextIcon = props => {
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={Images[props.icon]} />
      <TextInput
        ref={node => {
          props.inputRef && props.inputRef(node);
        }}
        value={props.value}
        style={styles.input}
        returnKeyType={props.returnKeyType}
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        onSubmitEditing={props.onSubmitEditing}
        secureTextEntry={props.secureTextEntry}
        placeholder={props.placeholder}
        editable={props.editable}
        underlineColorAndroid="transparent"
        autoFocus={false}
        autoCorrect={false}
        maxLength={props.maxLength}
        placeholderTextColor="#505050"
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
  container: {
    flex: 1
  },
  icon: {
    position: "absolute",
    top: 12,
    left: 10,
    height: 16,
    width: 16,
    resizeMode: "contain"
  },
  input: {
    height: 40,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 40,
    paddingBottom: 10,
    paddingRight: 15,
    fontSize: 15,
    color: "#181818",
    borderColor: "#18B5C3"
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

export default InputTextIcon;
