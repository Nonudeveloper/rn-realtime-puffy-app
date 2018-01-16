import React from "react";
import { Image, View } from "react-native";
import Images from "../config/images";

const PrefLarge = props => {
	const prefstate = props.prefstate;

	let props_name = props.name;

	if (prefstate == 1) {
		props_name = props.name + "_green";
	} else {
		props_name = props.name + "_black";
	}

	const image = Images[props_name];

	//console.log(prefstate);
	return (
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			<Image style={{ width: 75, height: 61, resizeMode: "contain" }} source={image} />
		</View>
	);
};

export default PrefLarge;
