import React from "react";
import { View, Text, TextInput, Image, Platform } from "react-native";
import Images from "../config/images";

const InputTextMultiIcon = props => {
  return (
    <View style={styles.container}>
      <Image style={Platform.OS === 'ios' ? styles.icon : styles.iconAndroid} source={Images[props.icon]} />
      {Platform.OS === 'android' ? 
      (<Text style={styles.textLeft}>{props.characterCount} characters left</Text>)
      : null
      }
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
        placeholderTextColor="#505050"
        autoFocus={false}
        autoCorrect={false}
        maxLength={props.maxLength}
        multiline={props.multiline}
        underlineColorAndroid="transparent"
      />
      {Platform.OS === 'ios' ? 
      (<Text style={styles.textLeft}>{props.characterCount} characters left</Text>)
      : null
      }
      
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
  iconAndroid: {
    position: "absolute",
    top: 32,
    left: 10,
    height: 16,
    width: 16,
    resizeMode: "contain"
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 40,
    paddingBottom: 10,
    paddingRight: 15,
    fontSize: 15,
    height: 40,
    color: "#181818",
    borderColor: "#18B5C3"
  },
  support: {
    height: 150,
    color: "#72777F",
    borderColor: "#D3D2D3"
  },
  textLeft: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 3,
    color: "#3EA9A9"
  }
};

export default InputTextMultiIcon;
