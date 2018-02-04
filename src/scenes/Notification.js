import React, { Component } from "react";
import { View, Text, AsyncStorage, TouchableOpacity, RefreshControl, FlatList, Image, TouchableHighlight, Platform } from "react-native";
import Images from "../config/images";
import { CachedImage } from "react-native-img-cache";
import HeaderSearch from "../components/HeaderSearch";

class Notification extends Component {
	constructor(props) {
		super(props);

		this.bug = this.props.screenProps.bug.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.onChange = this.onChange.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.filterByProperty = this.filterByProperty.bind(this);
		this.selectRow = this.selectRow.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.msgListenerNoti = this.msgListenerNoti.bind(this);

		this.items = [];
		this.state = {
			isLoaded: 0,
			searching: 0,
			refreshing: false,
			selected: false,
			isNavigating: false,
			dataSource: []
		};
	}

	msgListenerNoti(data) {
		if (data["result"] == 1 && data["result_action"] == "get_notification") {
			this.setItems(data["result_data"]);
		}

		if (data["result"] == 1 && data["result_action"] == "read_notification") {
			this.setItems(data["result_data"]);
		}

		if (data["result"] == 0 && data["result_action"] == "get_notification") {
			this.items = [];

			this.setState({
				refreshing: false,
				isLoaded: 1,
				selected: !this.state.selected,
				dataSource: []
			});

			AsyncStorage.removeItem("Notifications");
		}
	}

	filterByProperty(obj, prop, val) {
		var results = [];

		for (var key in obj) {
			if (obj[key]) {
				if (obj[key].hasOwnProperty(prop) && obj[key][prop].toLowerCase().indexOf(val) >= 0) {
					results.push(obj[key]);
				}
			}
		}

		return results;
	}

	onChange(obj) {
		if (obj == "clear") {
			this.setState({
				dataSource: this.items,
				searching: 0,
				selected: !this.state.selected
			});
			return false;
		}

		let string = obj.text;

		var results = this.filterByProperty(this.items, "user_name", string.toLowerCase());

		if (results == null) {
			results = [];
		}

		this.setState({
			dataSource: results,
			searching: 1,
			selected: !this.state.selected
		});
	}

	setItems(items) {
		if (items == null) {
			items = [];
		}

		this.items = items;

		this.setState({
			dataSource: items,
			refreshing: false,
			selected: !this.state.selected,
			isLoaded: 1
		});

		//console.log(items);

		let localData = JSON.stringify(items);

		if (localData) {
			AsyncStorage.setItem("Notifications", localData);
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.msgListenerNoti);
	}

	componentDidMount() {
		AsyncStorage.getItem("Notifications", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);
				this.setItems(items);
			}
		});

		let dataString = {
			user_action: "get_notificatons",
			user_data: {}
		};

		this.handleEmit(dataString);

		this.puffyChannel.on("data_channel", this.msgListenerNoti);
	}

	onRefresh() {
		if (this.state.searching == 1) {
			return false;
		}

		console.log("refresh");
		this.setState({ refreshing: true });

		let dataString = {
			user_action: "get_notificatons",
			user_data: {}
		};

		this.handleEmit(dataString);
	}

	gotoEventsView(events_id) {
		this.props.navigation.navigate("EventsView", { events_id: events_id, events_type: 3 });
	}

	selectRow(rowData) {
		if (rowData == null) {
			return false;
		}
		if (this.state.isNavigating == true) {
			return false;
		}
		console.log(rowData);

		const $this = this;

		this.setState({ isNavigating: true });

		let report_id = parseInt(rowData["report_id"]);

		if (rowData.puffy_string_type == "message" && report_id > 0) {
			this.props.navigation.navigate("Message", { name: rowData.user_name, user_id: rowData.user_id, report_id: report_id });
		} else if (rowData.puffy_string_type == "message") {
			this.props.navigation.navigate("Message", { name: rowData.user_name, user_id: rowData.user_id });
		} else if (rowData.puffy_string_type == "group_requests") {
			this.props.navigation.navigate("Group", { name: rowData.user_name, user_id: rowData.user_id, tab: "Requests" });
		} else if (rowData.puffy_string_type == "file_likes") {
			this.props.navigation.navigate("File", { data: rowData, tab: "Requests" });
		} else if (rowData.puffy_string_type == "event_confirm") {
			this.props.navigation.navigate("EventsView", { events_id: rowData.event_id, events_type: 3 });
		} else if (rowData.puffy_string_type == "event_puff") {
			this.props.navigation.navigate("EventsView", { events_id: rowData.event_id, events_type: 3 });
		} else if (rowData.puffy_string_type == "event_comment") {
			this.props.navigation.navigate("EventComment", { event_id: rowData.event_id });
		} else if (rowData.puffy_string_type == "feed_comment") {
			this.props.navigation.navigate("FeedComment", { file_id: rowData.file_id });
		} else {
			rowData["id"] = rowData["user_id"];
			rowData["name"] = rowData["user_name"];
			rowData["thumb"] = rowData["profileImage"];

			this.props.navigation.navigate("Profile", { user: rowData, tab: "Puffers" });
		}

		setTimeout(function() {
			$this.setState({ isNavigating: false });
		}, 500);
	}

	gotoProfile(user) {
		if (user == null) {
			return false;
		}
		if (this.state.isNavigating == true) {
			return false;
		}
		const $this = this;

		this.setState({ isNavigating: true });

		console.log(user);

		user["id"] = user["user_id"];
		user["name"] = user["user_name"];
		user["thumb"] = user["profileImage"];

		this.props.navigation.navigate("Profile", { user: user });

		setTimeout(function() {
			$this.setState({ isNavigating: false });
		}, 500);
	}

	renderRow({ item, index }) {
		return (
			<TouchableHighlight
				key={index}
				disabled={this.state.isNavigating}
				onPress={() => {
					this.selectRow(item);
				}}
			>
				<View style={styles.row}>
					<TouchableOpacity disabled={this.state.isNavigating} onPress={() => this.gotoProfile(item)}>
						<View style={styles.avatar}>
							{item.profileImage == null ? null : <CachedImage style={styles.avatarImg} source={{ uri: item.profileImage, cache: "force-cache" }} />}
						</View>
					</TouchableOpacity>
					<View style={styles.body}>
						<Text style={styles.username}>{item.user_name}</Text>
						<Text style={styles.preview}>{item.puffy_string_text}</Text>
					</View>
					<View style={styles.date}>
						<Text style={styles.dateText}>{item.timeago}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<HeaderSearch
					deviceTheme={this.props.screenProps.deviceTheme}
					placeholder="Search"
					onChange={this.onChange}
					RightIcon="circle_chat"
					RightCallback={() => this.props.navigation.navigate("Messages")}
					unread_count={this.props.screenProps.unread_count}
					global={this.props.screenProps.global}
				/>
				{this.state.dataSource.length > 0 ? (
					<FlatList
						enableEmptySections={false}
						removeClippedSubviews={Platform.OS === "android" ? true : false}
						initialNumToRender={18}
						contentContainerStyle={styles.list}
						keyExtractor={item => item.puffy_noti_id}
						data={this.state.dataSource}
						extraData={this.state.selected}
						refreshControl={
							<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} tintColor="#57BBC7" colors={["#57BBC7", "#57BBC7", "#57BBC7"]} />
						}
						renderItem={this.renderRow}
					/>
				) : (
					<View>
						{this.state.isLoaded == 0 ? null : (
							<View style={styles.noData}>
								<Image style={styles.noDataImg} source={Images.neutral_big} />
								<Text style={styles.noDataText}>You have no notifications</Text>
							</View>
						)}
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
		paddingTop: 5,
		paddingBottom: 5,
		flexDirection: "row"
	},
	center: {
		textAlign: "center",
		fontSize: 18,
		color: "#FEFEFE"
	},
	avatar: {},
	avatarImg: {
		borderRadius: 25,
		marginRight: 5,
		marginLeft: 2,
		height: 50,
		width: 50,
		resizeMode: "cover"
	},
	body: {
		paddingTop: 2,
		paddingLeft: 5
	},
	username: {
		fontSize: 16
	},
	preview: {
		marginTop: 5,
		fontSize: 12,
		color: "#000000",
		height: 20
	},
	previewBold: {
		fontWeight: "bold",
		marginTop: 5,
		fontSize: 12,
		color: "#000000",
		height: 20
	},
	date: {
		position: "absolute",
		top: 25,
		right: 15
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
		paddingLeft: 15,
		paddingRight: 15
	},
	btnDelete: {
		backgroundColor: "#FB0001",
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: 15,
		paddingRight: 15
	},
	noData: {
		marginTop: 50,
		marginLeft: 10,
		marginRight: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	noDataImg: {
		height: 80,
		width: 80,
		resizeMode: "contain"
	},
	noDataText: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		color: "#777980",
		marginTop: 20,
		marginBottom: 10
	}
};

export { Notification };
