import React, { Component } from 'react';
import { Text, View, Image, TextInput } from 'react-native';
import Images from '../config/images';

const ImgInput = ({ icon, inputName ,onChangeText ,secureTextEntry ,value, passwordMatchTrue, editable,  maxLength }) => {
  const { contentStyle ,imgStyle, inputBoxStyle, mainContaterStyle, sectionContainerStyle, passwordMatchStyle } = styles;

  return(
    <View style={mainContaterStyle}>
      <Image style={imgStyle} source={icon} />
      <View style={sectionContainerStyle}>
        <View style={contentStyle}>
          <TextInput
            style={inputBoxStyle}
            maxLength={maxLength}
            autoFocus={false}
            autoCorrect={false}
            returnKeyType="done"
            secureTextEntry={secureTextEntry}
            value={value}
            editable={editable}
            onChangeText={onChangeText}
            placeholder={inputName}>
          </TextInput>
          { passwordMatchTrue ?
            <View style={passwordMatchStyle}>
              <Image style={imgStyle} source={Images.check_mark} />
            </View>
          : null }

        </View>
      </View>
    </View>
  );
};

const styles = {
  mainContaterStyle:{
    marginTop: 5,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center'
  },

  imgStyle:{
    height: 20,
    width: 20,
    marginRight: 20,
    marginLeft: 10,
    resizeMode: 'contain'
  },
  sectionContainerStyle: {
    alignItems: 'flex-end',
  },
  contentStyle:{
    width: 275,
  },
  inputBoxStyle:{
    height: 45,
    fontSize: 15
  },
  passwordMatchStyle: {
    position: 'absolute',
    right: -25,
    top: 13
  }
};

export { ImgInput };
