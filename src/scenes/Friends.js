import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert, Platform } from "react-native";
import Images from "../config/images";
import HeaderSearch from "../components/HeaderSearch";
import UserRow from "../components/UserRow";

class Friends extends Component {
	constructor(props) {
		super(props);

		this.bug = this.props.screenProps.bug.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;

		this.renderRow = this.renderRow.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.gotoMessage = this.gotoMessage.bind(this);
	}

	componentDidMount() {
		if (this.props.searching == 1) {
		} else {
			let dataString = {
				user_action: "list_user_friends",
				user_data: {}
			};
			this.handleEmit(dataString);
		}
	}

	gotoProfile(props) {
		props["thumb"] = props.profileImage;
		props["id"] = props.user_id;
		props["name"] = props.user_name;

		this.props.navigation.navigate("Profile", { user: props });
	}

	gotoMessage(rowData) {
		this.props.navigation.navigate("Message", { name: rowData.user_name, user_id: rowData.user_id });
	}

	renderRow({ item, index }) {
		if (item.loc == null || item.loc == "" || item.loc == "Location" || item.loc == "Location (Optional)") {
			item.loc = "United States";
		}

		let newCheck = parseInt(item.new_check);

		return (
			<UserRow id={item.user_id} new={newCheck > 7 ? 0 : 1} name={item.user_name} icon={item.profileImage} location={item.loc} user={item} callback={this.gotoProfile}>
				<TouchableOpacity style={styles.messageBtnContainer} onPress={this.gotoMessage} onPress={() => this.gotoMessage(item)}>
					<Image style={{ width: 40, height: 40, marginTop: 5, marginLeft: 5, resizeMode: "contain" }} source={Images.message_friend} />
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
						<Text style={styles.noDataTextHeader}>Unlimited Puffs</Text>
						<Image style={styles.noDataImg} source={Images.puff_stamp} />
						<Text style={styles.noDataText}>Puff as many Puffers for a better</Text>
						<Text style={styles.noDataText}>chance for them to Puff you back</Text>
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
		justifyContent: "flex-end",
		alignItems: "center"
	},
	btnNew: {
		height: 20,
		backgroundColor: "#fe0000",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 3,
		paddingLeft: 4,
		paddingRight: 4
	},
	btnNewText: {
		color: "#FFFFFF",
		fontSize: 10,
		fontWeight: "bold",
		textAlign: "center"
	},
	greenCircle: {
		width: 10,
		height: 10,
		marginTop: 5,
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
	messageBtnContainer: {
		paddingLeft: 10,
		paddingRight: 5,
		paddingTop: 5,
		paddingBottom: 10
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

export { Friends };
