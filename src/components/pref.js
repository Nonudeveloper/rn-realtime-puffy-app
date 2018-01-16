import React from 'react';
import { Image, Text, View } from 'react-native';
import Images from '../config/images';
import Labels from '../config/labels';

const Pref = (props) => {

	const prefstate = props.prefstate;

	var props_name = props.name;

	if(prefstate == 1){
		//manual override to 1
		props_name = props.name + '_on';
	}

	const image = Images[props_name];
	const label = Labels[props.name];

	//console.log(prefstate);
	return (
		<View style={{ 	justifyContent: 'center', alignItems: 'center' }} >
			<Image 
				style={{ width: 40, height: 40, resizeMode: 'contain' }} 
				source={image}
			/>
			{ prefstate == 1 ? <Text style={styles.labelStyleOn}>{label}</Text> : <Text style={styles.labelStyle}>{label}</Text> }
		</View>
	);
};

const styles = {

	labelStyle: {
		fontFamily: 'Helvetica',
		textAlign: 'center'
	},

	labelStyleOn: {
		fontFamily: 'Helvetica',
		textAlign: 'center',
		color: 'green'
	}
};

export default Pref;
