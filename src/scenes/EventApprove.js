import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert, Dimensions } from "react-native";
import Images from "../config/images";
import Header from "../components/Header";
import ActionSheet from "react-native-actionsheet";
import UserRow from "../components/UserRow";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Yes", "No"];

class EventApprove extends Component {
	constructor(props) {
		super(props);

		this.bug = this.props.screenProps.bug.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.renderRow = this.renderRow.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.denyRequest = this.denyRequest.bind(this);
		this.acceptRequest = this.acceptRequest.bind(this);
		this.eventListener = this.eventListener.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.handlePress = this.handlePress.bind(this);
		this.events_id = this.props.navigation.state.params.events_id;
		this.event_type = this.props.navigation.state.params.event_type;

		this.state = {
			dataSource: [],
			eventTitle: this.props.navigation.state.params.events_title,
			eventDate: this.props.navigation.state.params.events_date,
			selected: false,
			file_count: 0,
			title: "",
			rowToRemove: null,
			rsvpToDelete: 0
		};
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.eventListener);
	}

	componentDidMount() {
		let dataString = {
			user_action: "get_event_approval",
			user_data: {
				event_id: this.events_id
			}
		};

		this.handleEmit(dataString);

		this.puffyChannel.on("data_channel", this.eventListener);
	}

	eventListener(data) {
		if (data["result"] == 1 && data["result_action"] == "get_event_approval_result") {
			console.log(data["result_data"]);
			this.setState({
				dataSource: data["result_data"],
				file_count: data["result_data"].length
			});
		}
	}

	denyRequest(rsvp) {
		let dataString = {
			user_action: "update_puff_rsvp",
			user_data: {
				rsvp_id: rsvp.puffy_events_rsvp_id,
				rsvp_approve_deny: -1,
				user_id_denied: rsvp.user_id
			}
		};

		this.handleEmit(dataString);
		var index = this.state.dataSource.indexOf(rsvp);
		this.state.dataSource.splice(index, 1);
		this.setState({ selected: !this.state.selected });
	}

	acceptRequest(rsvp) {
		let dataString = {
			user_action: "update_puff_rsvp",
			user_data: {
				rsvp_id: rsvp.puffy_events_rsvp_id,
				rsvp_approve_deny: 1
			}
		};

		this.handleEmit(dataString);
		rsvp.puffy_events_rsvp_approve = 1;

		this.setState({ selected: !this.state.selected });
	}

	gotoProfile(props) {
		props["thumb"] = props.file_thumbnail_url;
		props["id"] = props.user_id;
		props["name"] = props.user_name;
		this.props.navigation.navigate("Profile", { user: props });
	}

	handlePress(i) {
		if (i == 1) {
			let dataString = {
				user_action: "delete_rsvp_user",
				user_data: {
					rsvp_id: this.state.rsvpToDelete
				}
			};

			this.handleEmit(dataString);

			let items = this.state.dataSource;
			let count = items.length;

			if (count == 1) {
				items = [];
			} else {
				items.splice(this.state.rowToRemove, 1);
			}

			this.setState({
				dataSource: items
			});
		} else if (i == 2) {
			//this.ActionSheet.hide();
		}
	}

	showMenu(item, index) {
		var titleModal = "Remove " + item.user_name + " from the list?";

		this.setState({ title: titleModal, rsvpToDelete: item.puffy_events_rsvp_id, rowToRemove: index }, function() {
			var $this = this;
			setTimeout(function() {
				$this.ActionSheet.show();
			}, 100);
		});
	}

	renderRow({ item, index }) {
		if (this.event_type == 4) {
			return <UserRow id={item.user_id} name={item.user_name} icon={item.file_thumbnail_url} location={item.user_location} user={item} callback={this.gotoProfile} />;
		} else {
			return (
				<UserRow id={item.user_id} name={item.user_name} icon={item.file_thumbnail_url} location={item.user_location} user={item} callback={this.gotoProfile}>
					{item.puffy_events_rsvp_approve ? (
						<View style={styles.actionsContainer}>
							<TouchableOpacity style={styles.btnAttendee} onPress={() => this.showMenu(item, index)}>
								<Text style={styles.btnAttendeeText}>ATTENDEE</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View style={styles.actionsContainer}>
							<TouchableOpacity style={styles.btnPass} onPress={() => this.denyRequest(item)}>
								<Text style={styles.btnPassText}>DENY</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.btnPuff} onPress={() => this.acceptRequest(item)}>
								<Text style={styles.btnPuffText}>ACCEPT</Text>
							</TouchableOpacity>
						</View>
					)}
				</UserRow>
			);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Header deviceTheme={this.props.screenProps.deviceTheme} LeftIcon="back_arrow" LeftCallback={this.props.navigation.goBack} global={this.props.screenProps.global} />

				<View style={styles.eventHeaderContainer}>
					<Text style={styles.eventTitle}>{this.state.eventTitle}</Text>
					<Text style={styles.eventDate}>{this.state.eventDate}</Text>
					<View style={styles.approveEventContainer}>
						<Text style={styles.approveEventPuffers}>{this.event_type == 4 ? "Event Puffers" : "Approve Event Puffers"}</Text>
					</View>
				</View>
				{this.state.file_count > 0 ? (
					<FlatList
						data={this.state.dataSource}
						renderItem={this.renderRow}
						extraData={this.state.selected}
						horizontal={false}
						numColumns={1}
						keyExtractor={(item, index) => index}
					/>
				) : (
					<View style={styles.profileMessage}>
						<Image style={styles.lockedEye} source={Images.neutral_big} />
						<Text style={styles.profileMessageHeader}>No guests available</Text>
					</View>
				)}
				<ActionSheet ref={o => (this.ActionSheet = o)} title={this.state.title} options={options} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress} />
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
		paddingLeft: 15,
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
		color: "#1bbdcc",
		fontSize: 15
	},
	milesAway: {
		fontSize: 11,
		paddingTop: 5,
		color: "#888d91"
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
	btnAttendee: {
		height: 30,
		width: 90,
		borderColor: "#405353",
		borderWidth: 2,
		borderRadius: 12,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10
	},
	btnAttendeeText: {
		color: "#405353",
		fontSize: 12,
		fontWeight: "bold",
		textAlign: "center"
	},
	btnPass: {
		height: 30,
		width: 70,
		borderColor: "#405353",
		borderWidth: 2,
		borderRadius: 12,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10
	},
	btnPassText: {
		color: "#405353",
		fontSize: 12,
		fontWeight: "bold",
		textAlign: "center"
	},
	btnPuff: {
		height: 30,
		width: 70,
		borderColor: "#00C4CF",
		borderWidth: 2,
		borderRadius: 12,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center"
	},
	btnPuffText: {
		color: "#00C4CF",
		fontSize: 12,
		fontWeight: "bold",
		textAlign: "center"
	},
	greenCircle: {
		width: 10,
		height: 10,
		marginTop: 7,
		marginLeft: 5,
		marginRight: 5,
		resizeMode: "contain"
	},
	attendeeStyle: {
		color: "#29b7c3"
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
	eventHeaderContainer: {
		justifyContent: "center",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: "#e7e7e7"
	},
	eventTitle: {
		color: "#888a99",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginLeft: 30,
		marginRight: 30,
		marginTop: 5,
		marginBottom: 5
	},
	eventDate: {
		color: "#959698",
		fontSize: 12,
		marginBottom: 5,
		marginTop: 2
	},
	approveEventContainer: {
		borderTopWidth: 1,
		borderColor: "#e7e7e7",
		width: Dimensions.get("window").width,
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 8,
		marginBottom: 2
	},
	approveEventPuffers: {
		color: "#8c9195",
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 10
	},
	profileMessage: {
		marginTop: 50,
		justifyContent: "center",
		alignItems: "center"
	},
	lockedEye: {
		height: 100,
		width: 100,
		resizeMode: "contain"
	},
	profileMessageHeader: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		color: "#777980",
		marginTop: 10,
		marginBottom: 10
	}
};

export { EventApprove };
