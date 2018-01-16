import React, { Component } from 'react';
import {View, Text, TouchableOpacity ,Picker, Image} from 'react-native';

class GenderInput extends Component{

  constructor(props) {
      super(props);

      this.state = {
      gender: '',
      genderModal: false,
      birthDateModal: false
    };
  }

  render(){

    const { contentStyle, containerStyle, inputBoxStyle, sectionContainerStyle, mainContaterStyle, imgContainer, imgStyle, genderStyle } = styles;

    return(
      <View style={containerStyle}>
        <TouchableOpacity onPress={() => this.setState({genderModal: true, birthDateModal: false })}>
            <View style={mainContaterStyle}>
              <View style={imgContainer}>
                <Image style={imgStyle}  source={Images.drop_down}  />
              </View>
              <View style={sectionContainerStyle}>
                <View style={contentStyle}>
                  <Text style={inputBoxStyle}>{this.state.gender}</Text>
                </View>
              </View>
            </View>
					</TouchableOpacity>
          { this.state.genderModal ?
    					<Picker style={genderStyle}
    						selectedValue={this.state.gender}
    						onValueChange={(selectedVal) => this.setState({ gender: selectedVal, genderModal: false })}
    					>
    						<Picker.Item label="Women" value="Women" />
    						<Picker.Item label="Male" value="Male" />
    					</Picker>
    					: null }
      </View>

    )
  }
};

const styles = {
  containerStyle:{
    flexDirection: 'row'
  },
  mainContaterStyle:{
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row'
  },
  imgContainer:{
    height: 50,
    width: 40,
    marginLeft: 10,
    justifyContent: 'center'
  },
  imgStyle:{
    height: 20,
    width: 20
  },
  sectionContainerStyle: {
    alignItems: 'flex-end',
  },
  contentStyle:{
    width: 275,
  },
  inputBoxStyle:{
    height: 50
  },
  genderStyle: {

  }
}

export { GenderInput }
