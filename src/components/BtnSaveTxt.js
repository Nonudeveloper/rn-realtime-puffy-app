import React, { Component } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';

class BtnSaveTxt extends Component{

  render(props){

    const { bttmContainer, btnSaveText, btnSave } = styles;

    return(
      <View style={bttmContainer}>
      	<TouchableOpacity style={btnSave} onPress={this.props.onPress}>
      		<Text style={btnSaveText}>{this.props.buttonName}</Text>
      	</TouchableOpacity>
      </View>
    )
  }
}


const styles = {
  bttmContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  btnSave: {
    height: 45,
    width: 230,
    borderColor: '#00C4CF',
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSaveText: {
    color: '#00C4CF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center'
    }
}

export {BtnSaveTxt}
