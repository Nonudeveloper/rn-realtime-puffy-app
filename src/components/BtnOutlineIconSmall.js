import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import Images from '../config/images';

const BtnOutlineIconSmall = (props) => {
	return (
    <TouchableOpacity style={props.active === true ? styles['btn'+props.theme_active] : styles.btn} onPress={props.onPress}>
      <Image 
        style={styles.icon}
        source={props.active === true ? Images[props.icon_active] : Images[props.icon] }
      />
		  <Text style={props.active === true ? styles['btnText'+props.theme_active] : styles.btnText}>{props.label}</Text>
    </TouchableOpacity>
	);
};

const styles = {
  btn: {
    borderWidth: 2,
    borderColor: '#BFBFBF',
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'center',
  },
  btnText: {
    color: '#BFBFBF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Helvetica'
  },
  btnPink: {
    borderWidth: 2,
    borderColor: '#DC90B5',
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'center',
  },
  btnTextPink: {
    color: '#DC90B5',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Helvetica'
  },
  btnGreen: {
    borderWidth: 2,
    borderColor: '#18B5C3',
    borderRadius: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'center',
  },
  btnTextGreen: {
    color: '#18B5C3',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Helvetica'
  },
  icon: {
    width: 50, 
    height: 50, 
    resizeMode: 'cover',
  }
};

export default BtnOutlineIconSmall;