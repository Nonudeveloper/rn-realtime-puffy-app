import React from "react";
import { Image, Text, View } from "react-native";
import Images from "../config/images";

const InterestWhite = props => {
	if (typeof props.name === "undefined") {
		props.name = "";
	}

	const image = Images[props.name + "_white"];

	return (
		<View style={{ width: 24, marginLeft: 7, marginRight: 7, alignItems: "center" }}>
			<Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={image} />
		</View>
	);
};

export default InterestWhite;
