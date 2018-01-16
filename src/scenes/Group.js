import React, { Component } from "react";
import { View, Text, AsyncStorage, Platform } from "react-native";
import TopTabButtonCount from "../components/TopTabButtonCount";
import { Pending } from "./Pending";
import { Approval } from "./Approval";
import { Friends } from "./Friends";
import HeaderSearch from "../components/HeaderSearch";
import PushNotification from "react-native-push-notification";

class Group extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.setItems = this.setItems.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.goBack = this.goBack.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.filterByProperty = this.filterByProperty.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.backBtn = 0;
		this.msgListenerGroup = this.msgListenerGroup.bind(this);
		this.setPage = this.setPage.bind(this);

		if (this.props.navigation.state.params == null) {
			this.tab = null;
		} else {
			this.tab = this.props.navigation.state.params.tab;
		}

		this.state = {
			currentPage: 0,
			itemsFriends: [],
			dataSourceFriends: 0,
			itemsApproval: [],
			dataSourceApproval: 0,
			itemsPending: [],
			dataSourcePending: 0,
			searching: 0,
			selected: false
		};
	}

	msgListenerGroup(data) {
		if (data["result"] == 1 && data["result_action"] == "remove_friend_result") {
			let dataString = {
				user_action: "list_user_friends",
				user_data: {}
			};
			this.handleEmit(dataString);
		}

		if (data["result"] == 1 && data["result_action"] == "list_user_likes_needing_approval_result") {
			this.setItems(data["result_data"], "Approval");

			//slide to next user, remove current user from slide
		} else if (data["result"] == 0 && data["result_action"] == "list_user_likes_needing_approval_result") {
			this.setItems([], "Approval");
		} else if (data["result"] == 1 && data["result_action"] == "list_user_friends_result") {
			this.setItems(data["result_data"], "Friends");

			//slide to next user, remove current user from slide
		} else if (data["result"] == 0 && data["result_action"] == "list_user_friends_result") {
			this.setItems([], "Friends");
		} else if (data["result"] == 1 && data["result_action"] == "list_pending_user_likes_result") {
			this.setItems(data["result_data"], "Pending");

			//slide to next user, remove current user from slide
		} else if (data["result"] == 0 && data["result_action"] == "list_pending_user_likes_result") {
			this.setItems([], "Pending");
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.msgListenerGroup);
	}

	componentDidMount() {
		AsyncStorage.getItem("FriendsList", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);
				this.setState({
					itemsFriends: items,
					dataSourceFriends: items
				});
			}
		});

		AsyncStorage.getItem("ApprovalList", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);
				this.setState({
					itemsApproval: items,
					dataSourceApproval: items
				});
			}
		});

		AsyncStorage.getItem("PendingList", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);
				this.setState({
					itemsPending: items,
					dataSourcePending: items
				});
			}
		});

		let dataString = {
			user_action: "list_user_friends",
			user_data: {}
		};

		let dataString2 = {
			user_action: "list_user_likes_needing_approval",
			user_data: {}
		};

		let dataString3 = {
			user_action: "list_pending_user_likes",
			user_data: {}
		};

		//set tab if passed
		if (this.tab == "Puffers") {
			this.backBtn = 1;
			this.setState({
				currentPage: 1
			});

			this.handleEmit(dataString2);
			this.handleEmit(dataString3);
		} else if (this.tab == "Requests") {
			this.backBtn = 1;
			this.setState({
				currentPage: 2
			});

			this.handleEmit(dataString);
			this.handleEmit(dataString3);
		} else if (this.tab == "Sent") {
			this.backBtn = 1;
			this.setState({
				currentPage: 3
			});

			this.handleEmit(dataString);
			this.handleEmit(dataString2);
		}

		this.puffyChannel.on("data_channel", this.msgListenerGroup);
	}

	removeItem(rowID) {
		//request
		if (this.state.currentPage == 2) {
			let items = this.state.itemsApproval;
			let count = items.length;

			if (count == 1) {
				items = [];
				AsyncStorage.removeItem("ApprovalList");
			} else {
				items.splice(rowID, 1);
			}

			if (Platform.OS === "ios") {
				this.setState({
					itemsApproval: items,
					dataSourceApproval: items,
					selected: !this.state.selected
				});
			} else {
				setTimeout(() => {
					this.setState({
						itemsApproval: items,
						dataSourceApproval: items,
						selected: !this.state.selected
					});
				}, 150);
			}
		} else if (this.state.currentPage == 3) {
			//send
			let items = this.state.itemsPending;
			let count = items.length;

			if (count == 1) {
				items = [];
				AsyncStorage.removeItem("PendingList");
			} else {
				items.splice(rowID, 1);
			}

			if (Platform.OS === "ios") {
				this.setState({
					itemsPending: items,
					dataSourcePending: items,
					selected: !this.state.selected
				});
			} else {
				setTimeout(() => {
					this.setState({
						itemsPending: items,
						dataSourcePending: items,
						selected: !this.state.selected
					});
				}, 150);
			}
		}
	}

	setItems(items, type) {
		if (items == null) {
			items = [];
		}

		if (type == "Friends") {
			this.setState({
				itemsFriends: items,
				dataSourceFriends: items
			});

			let localData = JSON.stringify(items);

			if (localData) {
				AsyncStorage.setItem("FriendsList", localData);
			}
		} else if (type == "Approval") {
			this.setState({
				itemsApproval: items,
				dataSourceApproval: items
			});

			let localData = JSON.stringify(items);

			if (localData) {
				AsyncStorage.setItem("ApprovalList", localData);
			}
		} else if (type == "Pending") {
			this.setState({
				itemsPending: items,
				dataSourcePending: items
			});

			let localData = JSON.stringify(items);

			if (localData) {
				AsyncStorage.setItem("PendingList", localData);
			}
		}
		PushNotification.setApplicationIconBadgeNumber(0);
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
				dataSourceFriends: this.state.itemsFriends,
				dataSourceApproval: this.state.itemsApproval,
				dataSourcePending: this.state.itemsPending,
				searching: 0
			});
			return false;
		}

		let string = obj.text;

		var results1 = this.filterByProperty(this.state.itemsFriends, "user_name", string.toLowerCase());
		var results2 = this.filterByProperty(this.state.itemsApproval, "user_name", string.toLowerCase());
		var results3 = this.filterByProperty(this.state.itemsPending, "user_name", string.toLowerCase());

		if (results1 == null) {
			results1 = [];
		}
		if (results2 == null) {
			results2 = [];
		}
		if (results3 == null) {
			results3 = [];
		}

		this.setState({
			dataSourceFriends: results1,
			dataSourceApproval: results2,
			dataSourcePending: results3,
			searching: 1
		});
	}

	setPage(page_no) {
		if (this.state.currentPage == page_no) {
			return false;
		}

		this.setState({
			currentPage: page_no,
			isLoaded: 0
		});
	}

	goBack() {
		let dataString = {
			user_action: "get_friend_count",
			user_data: {}
		};

		this.handleEmit(dataString);

		this.props.navigation.goBack();
	}

	render() {
		if (this.state.currentPage == 0) {
			return (
				<View style={styles.container}>
					<HeaderSearch
						LeftIcon="back_arrow"
						LeftCallback={this.goBack}
						placeholder="Search"
						deviceTheme={this.props.screenProps.deviceTheme}
						onChange={this.onChange}
						global={this.props.screenProps.global}
					/>
				</View>
			);
		}
		//set the custom component based on state
		return (
			<View style={styles.container}>
				<HeaderSearch
					LeftIcon="back_arrow"
					LeftCallback={this.goBack}
					placeholder="Search"
					deviceTheme={this.props.screenProps.deviceTheme}
					onChange={this.onChange}
					global={this.props.screenProps.global}
				/>
				<View style={styles.tabNavContainer}>
					<View style={styles.viewContainerRow}>
						<TopTabButtonCount selected={this.state.currentPage === 1} count={this.state.dataSourceFriends.length} onPress={() => this.setPage(1)}>
							Puffers
						</TopTabButtonCount>
						<TopTabButtonCount selected={this.state.currentPage === 2} count={this.state.dataSourceApproval.length} onPress={() => this.setPage(2)}>
							Requests
						</TopTabButtonCount>
						<TopTabButtonCount selected={this.state.currentPage === 3} count={this.state.dataSourcePending.length} onPress={() => this.setPage(3)}>
							Sent
						</TopTabButtonCount>
					</View>
				</View>
				<View style={styles.container}>
					{this.state.currentPage == 1 ? (
						<Friends
							navigation={this.props.navigation}
							screenProps={this.props.screenProps}
							dataSource={this.state.dataSourceFriends}
							removeItem={this.removeItem}
							searching={this.state.searching}
							selected={this.state.selected}
						/>
					) : null}
					{this.state.currentPage == 2 ? (
						<Approval
							navigation={this.props.navigation}
							screenProps={this.props.screenProps}
							dataSource={this.state.dataSourceApproval}
							removeItem={this.removeItem}
							searching={this.state.searching}
							selected={this.state.selected}
						/>
					) : null}
					{this.state.currentPage == 3 ? (
						<Pending
							navigation={this.props.navigation}
							screenProps={this.props.screenProps}
							dataSource={this.state.dataSourcePending}
							removeItem={this.removeItem}
							searching={this.state.searching}
							selected={this.state.selected}
						/>
					) : null}
				</View>
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
	viewContainerRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginLeft: 20,
		marginRight: 20,
		marginTop: 3
	}
};

export { Group };
