import React, { Component } from "react";
import { Text, View, Image, TextInput } from "react-native";
import Images from "../config/images";

const ImgInputMultiline = ({ icon, inputName, onChangeText, secureTextEntry, value, passwordMatchTrue, multiline, characterCount }) => {
  const { contentStyle, imgStyle, inputBoxStyle, mainContaterStyle, sectionContainerStyle, passwordMatchStyle } = styles;

  return (
    <View style={mainContaterStyle}>
      <Image style={imgStyle} source={icon} />
      <View style={sectionContainerStyle}>
        <View style={contentStyle}>
          <TextInput
            style={inputBoxStyle}
            autoFocus={false}
            autoCorrect={false}
            secureTextEntry={secureTextEntry}
            value={value}
            maxLength={30}
            multiline={multiline}
            onChangeText={onChangeText}
            placeholder={inputName}
          />
          <Text style={styles.textLeft}>{characterCount} characters left</Text>
          {passwordMatchTrue ? (
            <View style={passwordMatchStyle}>
              <Image style={imgStyle} source={Images.drop_down} />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = {
  mainContaterStyle: {
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center"
  },

  imgStyle: {
    height: 20,
    width: 20,
    marginRight: 20,
    marginLeft: 10,
    resizeMode: "contain"
  },
  sectionContainerStyle: {
    alignItems: "flex-end"
  },
  contentStyle: {
    width: 275
  },
  inputBoxStyle: {
    paddingTop: 15,

    fontSize: 15
  },
  passwordMatchStyle: {
    position: "absolute",
    right: -25,
    top: 13
  },
  textLeft: {
    marginTop: 5,
    textAlign: "right",
    color: "#CDCDCD",
    fontSize: 10
  }
};

export { ImgInputMultiline };
