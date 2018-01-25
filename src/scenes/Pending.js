import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert, Platform } from "react-native";
import Images from "../config/images";
import HeaderSearch from "../components/HeaderSearch";
import UserRow from "../components/UserRow";

class Pending extends Component {
	constructor(props) {
		super(props);

		this.bug = this.props.screenProps.bug.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.renderRow = this.renderRow.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.removePending = this.removePending.bind(this);
		this.removeRow = this.removeRow.bind(this);
		this.msgListenerPending = this.msgListenerPending.bind(this);
		this.selectedRow = 0;
	}

	msgListenerPending(data) {
		if (data["result"] == 1 && data["result_action"] == "like_user_result") {
			if (data["result_data"]["likedislike"] == "1") {
				let dataString = {
					user_action: "list_pending_user_likes",
					user_data: {}
				};

				this.handleEmit(dataString);
			}
		}
	}

	componentDidMount() {
		if (this.props.searching == 1) {
		} else {
			let dataString = {
				user_action: "list_pending_user_likes",
				user_data: {}
			};

			this.handleEmit(dataString);
		}

		this.puffyChannel.on("data_channel", this.msgListenerPending);
	}
	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.msgListenerPending);
	}

	gotoProfile(props) {
		props["thumb"] = props.profileImage;
		props["id"] = props.user_id;
		props["name"] = props.user_name;

		this.props.navigation.navigate("Profile", { user: props });
	}

	removePending(rowData, rowID) {
		Alert.alert("Cancel Request", `for ${rowData.user_name}`, [
			{ text: "No", onPress: () => console.log("No Pressed!") },
			{ text: "Yes", onPress: () => this.removeRow(rowID, rowData.puffy_likes_id) }
		]);
	}

	removeRow(rowID, puffy_likes_id) {
		//emit remove pending
		let dataString = {
			user_action: "remove_pending_user_like",
			user_data: {
				puffy_likes_id: puffy_likes_id,
				row_id: rowID,
				likedislike: 1
			}
		};

		this.handleEmit(dataString);

		this.props.removeItem(rowID);
	}

	renderRow({ item, index }) {
		if (item.loc == null || item.loc == "" || item.loc == "Location" || item.loc == "Location (Optional)") {
			item.loc = "United States";
		}

		return (
			<UserRow id={item.user_id} name={item.user_name} icon={item.profileImage} location={item.loc} user={item} callback={this.gotoProfile}>
				<TouchableOpacity style={styles.xButtonContainer} onPress={() => this.removePending(item, index)}>
					<Image style={styles.xButton} source={Images.close_out_x_icon} />
				</TouchableOpacity>
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
						removeClippedSubviews={Platform.OS === "android" ? true : false}
						initialNumToRender={18}
						contentContainerStyle={styles.list}
						keyExtractor={item => item.user_id}
						data={this.props.dataSource}
						extraData={this.props.selected}
						renderItem={this.renderRow}
					/>
				) : (
					<View style={styles.noData}>
						<Text style={styles.noDataTextHeader}>Keep Puffing</Text>
						<Image style={styles.noDataImg} source={Images.puff_stamp} />
						<Text style={styles.noDataText}>The more you Puff, the better chance you</Text>
						<Text style={styles.noDataText}>will make it as one of the Top Puffers</Text>
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
		paddingTop: 10
	},
	username: {
		fontSize: 15
	},
	milesAway: {
		fontSize: 11,
		paddingTop: 7
	},
	preview: {
		marginTop: 5,
		fontSize: 12,
		color: "#A3A6A6"
	},
	date: {
		position: "absolute",
		top: 15,
		right: 15,
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "stretch"
	},
	dateText: {},
	actionsContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "stretch"
	},
	btnBlock: {
		backgroundColor: "#AEB2B6",
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 30,
		paddingBottom: 30
	},
	btnDelete: {
		backgroundColor: "#FB0001",
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: 25,
		paddingRight: 25,
		paddingTop: 30,
		paddingBottom: 30
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
	xButtonContainer: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 15,
		paddingBottom: 10
	},
	xButton: {
		width: 20,
		height: 20,
		marginTop: 5,
		marginLeft: 5,
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

export { Pending };
