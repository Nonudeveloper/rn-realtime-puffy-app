import React from 'react';
import { View, Text, TouchableOpacity,Image  } from 'react-native';
import Images from '../config/images';
import LinearGradient from "react-native-linear-gradient";


const HeaderDefault = ({ navigation, callback }) => {
  const { containerStyle, textStyle, backStyle } = styles;
  return(
      <LinearGradient
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 0.0, y: 1.0 }}
        locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
        colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
        style={styles.containerStyle}
      >
      <TouchableOpacity onPress={() => { callback(); }} style={backStyle}>
        <Image 
          style={styles.backIcon}
          source={Images.back_arrow}
        />
      </TouchableOpacity>
      <Text style={styles.headerLogo}>
        <Image 
          style={styles.headerLogoImg}
          source={Images.logo_white}
        />
      </Text>
    </LinearGradient>
  );
}

const styles = {
  containerStyle: {
    height: 57,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#826DA8',
    borderBottomWidth: 1,
  },
  backStyle: {
    position: 'absolute',
    top: 10,
    left: 5
  },
  backIcon: {
    height: 25,
    width: 25,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 12,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  textStyle: {
    fontSize: 20,
    color: '#C8C8C8'
  },
  messageIcon: {
    width: 30, 
    height: 30, 
    marginRight: 5,
    marginTop: 12,
    resizeMode: 'contain',

  },
  headerLogo: {
    flex: 1,
    textAlign: 'center',
    marginTop: 11,
    backgroundColor: 'transparent'
  },
  headerLogoImg: {
    width: 35, 
    height: 35, 
    resizeMode: 'contain',
  },
  rightStyle: {
    position: 'absolute',
    top: 10,
    right: 5
  }
};

export default HeaderDefault;
