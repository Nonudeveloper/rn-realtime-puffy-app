import React from "react";
import { Image, Text, View } from "react-native";
import Images from "../config/images";

const CirclePref = props => {
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
				height: 35,
				width: 35,
				alignItems: "center",
				justifyContent: "center",
				borderRadius: 18,
				backgroundColor: "#FFF"
			}}
		>
			<Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={image} />
		</View>
	);
};

export default CirclePref;
