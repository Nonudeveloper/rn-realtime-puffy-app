import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Images from '../config/images';


const BtnBack = (navigation) => {

	console.log(navigation);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => { navigation.navigation.goBack(); }}>
				<Image 
					style={styles.backIcon}
					source={Images.back}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = {
	container: {
		flex: 1
	},
	backIcon: {
		height: 25,
		width: 25,
		marginRight: 10,
		marginLeft: 10,
		marginTop: 5,
		resizeMode: 'contain',
		alignSelf: 'center'
	}
};

export default BtnBack;
