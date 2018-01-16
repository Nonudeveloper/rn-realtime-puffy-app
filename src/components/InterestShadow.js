import React from "react";
import { Image, Text, View } from "react-native";
import Images from "../config/images";

const InterestShadow = props => {
	if (typeof props.name === "undefined") {
		props.name = "";
	}

	const image = Images[props.name + "_shadow"];

	return (
		<View
			style={{
				width: 28,
				marginLeft: 10,
				marginRight: 10,
				alignItems: "center",
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.7,
				shadowRadius: 2
			}}
		>
			<Image style={{ width: 26, height: 26, resizeMode: "contain" }} source={image} />
		</View>
	);
};

export default InterestShadow;
