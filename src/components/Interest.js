import React from "react";
import { Image, Text, View } from "react-native";
import Images from "../config/images";
import Labels from "../config/labels";

const Interest = props => {
	if (typeof props.name === "undefined") {
		props.name = "";
	}

	const image = Images[props.name];
	const label = Labels[props.name];

	return (
		<View style={{ width: 45, marginLeft: 10, marginRight: 10, alignItems: "center" }}>
			<Image style={{ width: 30, height: 30, resizeMode: "contain" }} source={image} />
			<Text style={{ fontSize: 10, fontFamily: "Helvetica" }}>{label}</Text>
		</View>
	);
};

export default Interest;
