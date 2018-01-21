import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import Images from "../config/images";
import HeaderSearch from "../components/HeaderSearch";
import UserRow from "../components/UserRow";

class Approval extends Component {
	constructor(props) {
		super(props);

		this.bug = this.props.screenProps.bug.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.renderRow = this.renderRow.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
	}

	componentDidMount() {
		if (this.props.searching == 1) {
		} else {
			let dataString = {
				user_action: "list_user_likes_needing_approval",
				user_data: {}
			};

			this.handleEmit(dataString);
		}
	}

	passPuffRequest(rowData, rowID, select_type) {
		if (select_type == -1) {
			this.passPuffRow(rowData, rowID, select_type);
		} else {
			this.passPuffRow(rowData, rowID, select_type);
		}
	}

	passPuffRow(rowData, rowID, select_type) {
		//emit remove pending
		let dataString = {
			user_action: "approve_deny_pending_user_like",
			user_data: {
				puffy_likes_id: rowData.puffy_likes_id,
				user_name: rowData.user_name,
				row_id: rowID,
				approvedeny: select_type
			}
		};

		this.handleEmit(dataString);

		this.props.removeItem(rowID);

		if (select_type == 1) {
			this.props.screenProps.setPufferModalVisible(true, rowData.profileImage, rowData.user_id, rowData.user_name);
		}
	}

	gotoProfile(props) {
		props["thumb"] = props.profileImage;
		props["id"] = props.user_id;
		props["name"] = props.user_name;

		this.props.navigation.navigate("Profile", { user: props });
	}

	renderRow({ item, index }) {
		if (item.loc == null || item.loc == "" || item.loc == "Location" || item.loc == "Location (Optional)") {
			item.loc = "United States";
		}

		let newCheck = parseInt(item.new_check);

		return (
			<UserRow id={item.user_id} new={newCheck > 7 ? 0 : 1} name={item.user_name} icon={item.profileImage} location={item.loc} user={item} callback={this.gotoProfile}>
				{this.props.screenProps.deviceTheme === "IphoneSmall" ? (
					<TouchableOpacity style={styles.btnPass} onPress={() => this.passPuffRequest(item, index, -1)}>
						<Image style={styles.stampBtnSmall} source={Images.pass_stamp} />
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={styles.btnPass} onPress={() => this.passPuffRequest(item, index, -1)}>
						<Image style={styles.stampBtn} source={Images.pass_stamp} />
					</TouchableOpacity>
				)}

				{this.props.screenProps.deviceTheme === "IphoneSmall" ? (
					<TouchableOpacity style={styles.btnPuff} onPress={() => this.passPuffRequest(item, index, 1)}>
						<Image style={styles.stampBtnSmall} source={Images.puff_stamp} />
					</TouchableOpacity>
				) : (
					<TouchableOpacity style={styles.btnPuff} onPress={() => this.passPuffRequest(item, index, 1)}>
						<Image style={styles.stampBtn} source={Images.puff_stamp} />
					</TouchableOpacity>
				)}
			</UserRow>
		);
	}

	render() {
		if (this.props.dataSource === 0) {
			return <View />;
		}

		return (
			<View style={styles.container}>
				{this.props.dataSource.length > 0 ? (
					<FlatList
						enableEmptySections={true}
						removeClippedSubviews={true}
						initialNumToRender={18}
						contentContainerStyle={styles.list}
						keyExtractor={(item, index) => index}
						data={this.props.dataSource}
						extraData={this.props.selected}
						renderItem={this.renderRow}
					/>
				) : (
					<View style={styles.noData}>
						<Text style={styles.noDataTextHeader}>Amazing Stuff!</Text>
						<Image style={styles.noDataImg} source={Images.puff_stamp} />
						<Text style={styles.noDataText}>Keep being active, so you can</Text>
						<Text style={styles.noDataText}>be seen by more Puffers</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	tabNavContainer: {
		backgroundColor: "#FAFAFA",
		borderBottomWidth: 2,
		borderColor: "#D3D3D3"
	},
	tabNav: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginLeft: 40,
		marginRight: 40,
		marginTop: 15,
		marginBottom: 15
	},
	tabActive: {
		color: "#3C6AF9"
	},
	list: {
		marginRight: 5,
		marginLeft: 5,
		marginTop: 5
	},
	row: {
		backgroundColor: "#FEFEFE",
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		paddingRight: 10,
		paddingLeft: 10,
		flexDirection: "row"
	},
	center: {
		textAlign: "center",
		fontSize: 18,
		color: "#FEFEFE"
	},
	avatarImg: {
		borderRadius: 25,
		marginRight: 10,
		marginBottom: 5,
		marginTop: 5,
		height: 50,
		width: 50,
		resizeMode: "contain"
	},
	body: {
		flex: 1,
		paddingTop: 10,
		flexDirection: "row"
	},
	username: {
		fontSize: 15
	},
	milesAway: {
		fontSize: 11,
		paddingTop: 5
	},
	preview: {
		marginTop: 5,
		fontSize: 12,
		color: "#A3A6A6"
	},
	actionsContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end"
	},
	btnPass: {
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2
	},
	btnPassText: {
		color: "#000000",
		fontSize: 14,
		textAlign: "center",
		fontFamily: "Helvetica"
	},
	btnPuff: {
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		marginLeft: 8
	},
	btnPuffText: {
		color: "#00AABA",
		fontSize: 14,
		textAlign: "center",
		fontFamily: "Helvetica"
	},
	greenCircle: {
		width: 10,
		height: 10,
		marginTop: 7,
		marginLeft: 5,
		marginRight: 5,
		resizeMode: "contain"
	},
	gone: {
		width: 0,
		height: 0
	},
	xButton: {
		width: 15,
		height: 15,
		marginTop: 5,
		marginLeft: 5,
		resizeMode: "contain"
	},
	btnNew: {
		height: 20,
		backgroundColor: "#fe0000",
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 5,
		borderRadius: 3,
		paddingLeft: 4,
		paddingRight: 4,
		marginRight: 8
	},
	btnNewText: {
		color: "#FFFFFF",
		fontSize: 10,
		fontWeight: "bold",
		textAlign: "center"
	},
	stampBtn: {
		padding: 5,
		width: 85,
		height: 45,
		resizeMode: "contain"
	},
	stampBtnSmall: {
		padding: 5,
		width: 60,
		height: 45,
		resizeMode: "contain"
	},
	noData: {
		marginTop: 40,
		marginLeft: 50,
		marginRight: 50,
		justifyContent: "center",
		alignItems: "center"
	},
	noDataImg: {
		marginTop: 10,
		marginBottom: 30,
		height: 80,
		width: 200,
		resizeMode: "contain"
	},
	noDataTextHeader: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		color: "#777980",
		marginTop: 20,
		marginBottom: 20
	},
	noDataText: {
		fontSize: 14,
		textAlign: "center",
		color: "#777980"
	}
};

export { Approval };
