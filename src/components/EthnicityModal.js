import React from "react";
import { View, TouchableOpacity, FlatList, Text, Modal } from "react-native";
import Header from "../components/Header";

const ethOptions = [
	{ key: "1", name: "No Preference" },
	{ key: "2", name: "Asian" },
	{ key: "3", name: "Black/African" },
	{ key: "4", name: "Hispanic/Latino" },
	{ key: "5", name: "Middle Eastern" },
	{ key: "6", name: "Native American" },
	{ key: "7", name: "Pacific Islander" },
	{ key: "8", name: "South Asian" },
	{ key: "9", name: "White Caucasian" },
	{ key: "10", name: "Other" }
];

const EthnicityModal = props => {
	return (
		<Modal
			animationType="slide"
			transparent={false}
			visible={props.visible}
			onRequestClose={() => {
				props.setModalVisible(false);
			}}
		>
			<View style={styles.container}>
				<Header
					deviceTheme={props.screenProps.deviceTheme}
					LeftIcon="back_arrow"
					LeftCallback={() => props.setEthnicityModalVisible(false)}
					global={props.screenProps.global}
					title="Select Your Ethnicity"
				/>
				<View style={styles.content}>
					<FlatList
						contentContainerStyle={styles.list}
						data={ethOptions}
						ItemSeparatorComponent={() => <View style={styles.separator} />}
						renderItem={({ item }) => (
							<TouchableOpacity style={styles.row} onPress={() => props.setEthnicity(item.name)}>
								<Text style={styles.rowText}>{item.name}</Text>
							</TouchableOpacity>
						)}
					/>
				</View>
			</View>
		</Modal>
	);
};

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	separator: {
		height: 1,
		backgroundColor: "#EEEEEE",
		marginLeft: 20,
		marginRight: 20
	},
	row: {
		paddingTop: 12,
		paddingBottom: 12,
		paddingLeft: 20,
		paddingRight: 20,
		marginLeft: 20,
		marginRight: 20
	},
	rowText: {
		fontSize: 14,
		fontFamily: "Helvetica",
		color: "#181818"
	},
	list: {
		marginTop: 25,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#EEEEEE",
		backgroundColor: "#FEFEFE"
	},
	content: {
		flex: 1,
		backgroundColor: "#FAFAFA"
	}
};

export default EthnicityModal;
