import React from 'react';
import { View, TouchableOpacity, Text, Picker, Image } from 'react-native';
import Images from '../config/images';

const GenderInput2 = (props) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.onClick(props.name)} style={styles.container}>
        <View style={styles.rowLabel}>
          <Text style={styles.boldText}>{props.label}
            <Text style={styles.regText}>{props.selectedValue}</Text>
          </Text>
        </View>
        <View style={styles.rowImage}>
          <Image style={styles.imgStyle} source={Images.drop_down} />
        </View>
      </TouchableOpacity>
      { props.display ?
        <Picker
          selectedValue={props.selectedValue}
          onValueChange={(selectedVal) => props.onSelect(selectedVal)}
        >
        {props.options.map(option =>
            <Picker.Item key={option.id} label={option.name} value={option.id} />
        )}
        </Picker>
      : null }
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: 'black',
    height:100
  },
  boldText: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginTop: 5
  },
  regText: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'normal'
  },
  rowLabel: {
    flex: 1
  },
  rowImage: {
    alignItems: 'flex-end',
    flex: 1,
  },
  imgStyle: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    marginRight: 10
  }
};

export default GenderInput2;
