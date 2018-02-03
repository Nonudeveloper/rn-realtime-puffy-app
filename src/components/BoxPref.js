import React from "react";
import { Image, Text, View } from "react-native";
import Images from "../config/images";
import Labels from "../config/labels";

const BoxPref = props => {
	if (typeof props.name === "undefined") {
		props.name = "";
	}

	let image = Images["circle_" + props.name + "_off"];
	const label = Labels[props.name][0];
	const labelColor = Labels[props.name][1];

	if (props.prefstate == 1) {
		image = Images["circle_" + props.name + "_on"];
	}

	let labelStyle = styles.label;
	let containerStyle = styles.container;

	if (props.prefstate == 1) {
		if (labelColor == "Blue") {
			labelStyle = styles.labelBlue;
			containerStyle = styles.containerBlue;
		} else if (labelColor == "Red") {
			labelStyle = styles.labelRed;
			containerStyle = styles.containerRed;
		} else if (labelColor == "Orange") {
			labelStyle = styles.labelOrange;
			containerStyle = styles.containerOrange;
		} else {
			labelStyle = styles.labelGreen;
			containerStyle = styles.containerGreen;
		}
	}

	return (
		<View style={containerStyle}>
			<Image style={{ width: 30, height: 30, resizeMode: "contain" }} source={image} />
			<Text style={labelStyle}>{label}</Text>
		</View>
	);
};

const styles = {
	container: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.7,
		shadowRadius: 1,
		height: 62,
		width: 75,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "transparent",
		backgroundColor: "#FFF"
	},
	containerBlue: {
		shadowColor: "#2DE8E7",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.7,
		shadowRadius: 1,
		height: 62,
		width: 75,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#2DE8E7",
		backgroundColor: "#FFF"
	},
	containerRed: {
		shadowColor: "#A51A76",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.7,
		shadowRadius: 1,
		height: 62,
		width: 75,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#A51A76",
		backgroundColor: "#FFF"
	},
	containerOrange: {
		shadowColor: "#FFB633",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.7,
		shadowRadius: 1,
		height: 62,
		width: 75,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#FFB633",
		backgroundColor: "#FFF"
	},
	containerGreen: {
		shadowColor: "#85BC30",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.7,
		shadowRadius: 1,
		height: 62,
		width: 75,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#85BC30",
		backgroundColor: "#FFF"
	},
	label: {
		marginTop: 5,
		fontSize: 11,
		fontFamily: "Helvetica",
		textAlign: "center",
		color: "#8C8B8C"
	},
	labelBlue: {
		marginTop: 5,
		fontSize: 11,
		fontFamily: "Helvetica",
		textAlign: "center",
		color: "#2DE8E7"
	},
	labelRed: {
		marginTop: 5,
		fontSize: 11,
		fontFamily: "Helvetica",
		textAlign: "center",
		color: "#A51A76"
	},
	labelOrange: {
		marginTop: 5,
		fontSize: 11,
		fontFamily: "Helvetica",
		textAlign: "center",
		color: "#FFB633"
	},
	labelGreen: {
		marginTop: 5,
		fontSize: 11,
		fontFamily: "Helvetica",
		textAlign: "center",
		color: "#85BC30"
	}
};

export default BoxPref;
