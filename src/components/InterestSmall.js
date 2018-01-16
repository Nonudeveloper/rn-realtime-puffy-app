import React from "react";
import { Image, Text, View } from "react-native";
import Images from "../config/images";

const InterestSmall = props => {
	if (typeof props.name === "undefined") {
		props.name = "";
	}

	const image = Images[props.name];

	return (
		<View style={{ width: 22, marginLeft: 4, marginRight: 4, alignItems: "center" }}>
			<Image
				style={{
					width: 20,
					height: 20,
					resizeMode: "contain"
				}}
				source={image}
			/>
		</View>
	);
};

export default InterestSmall;
