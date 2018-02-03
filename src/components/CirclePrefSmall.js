import React from "react";
import { Image, Text, View } from "react-native";
import Images from "../config/images";

const CirclePrefSmall = props => {
	if (typeof props.name === "undefined") {
		props.name = "";
	}

	let image = Images["circle_" + props.name + "_off"];

	if (props.active == 1) {
		image = Images["circle_" + props.name + "_on"];
	}

	return (
		<View
			style={{
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.7,
				shadowRadius: 1,
				height: 32,
				width: 32,
				alignItems: "center",
				justifyContent: "center",
				borderRadius: 18,
				backgroundColor: "#FFF"
			}}
		>
			<Image style={{ width: 20, height: 20, resizeMode: "contain" }} source={image} />
		</View>
	);
};

export default CirclePrefSmall;
