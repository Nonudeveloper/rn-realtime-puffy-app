import React, { Component } from "react";
import { ScrollView, Alert, View, Text, TouchableOpacity, ListView, Image, Button, TextInput, FlatList, Dimensions, Platform } from "react-native";
import FilterInput from "../components/FilterInput";
import { NavigationActions } from "react-navigation";
import Header from "../components/Header";
import Images from "../config/images";
import CheckBox from "react-native-check-box";
import DateTimePicker from "react-native-modal-datetime-picker";
import BtnGreen from "../components/BtnGreen";
import Modal from "react-native-modal";
import Rating from "../components/Rating";

class EventsRating extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.navigation = this.props.navigation;
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.eventListener = this.eventListener.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.gotoProfileRater = this.gotoProfileRater.bind(this);

		this.data = this.props.navigation.state.params;
		this.user_id = this.props.navigation.state.params.user_id;
		this.user_name = this.props.navigation.state.params.user_name;
		this.user_image = this.props.navigation.state.params.user_image;
		this.star_value = this.props.navigation.state.params.star_value;
		this.UserID = this.props.screenProps.global.user_id;

		this.state = {
			puffyIsHost: false,
			dataSource: [],
			noRatings: false
		};
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.eventListener);
	}

	componentDidMount() {
		let dataString = {
			user_action: "get_host_ratings",
			user_data: {
				user_id: this.user_id
			}
		};

		this.handleEmit(dataString);

		this.puffyChannel.on("data_channel", this.eventListener);
	}

	eventListener(data) {
		if (data["result"] == 1 && data["result_action"] == "get_host_ratings_result") {
			this.setState({ dataSource: data["result_data"], noRatings: false });
		} else if (data["result"] == 0 && data["result_action"] == "get_host_ratings_result") {
			this.setState({ noRatings: true });
		}
	}

	gotoProfile() {
		if (this.user_id === this.UserID) {
			return false;
		}
		let props = { id: this.user_id };
		this.props.navigation.navigate("Profile", { user: props, user_id: this.user_id });
	}

	gotoProfileRater(user) {
		let user_id = user["user_id"];

		if (user_id === this.UserID) {
			return false;
		}

		user["id"] = user["user_id"];
		user["name"] = user["user_name"];
		user["thumb"] = user["file_thumbnail_url"];
		this.props.navigation.navigate("Profile", { user: user, user_id: user_id });
	}

	renderRow(rowData) {
		return (
			<View style={styles.cardContainerRow}>
				<View style={styles.userRatingContainer}>
					<TouchableOpacity onPress={() => this.gotoProfileRater(rowData.item)}>
						<View style={styles.iconLeft}>
							<Image style={styles.profileIcon} source={{ uri: rowData.item.file_thumbnail_url }} />
							<Text style={styles.eventName}>
								{rowData.item.user_name}, {rowData.item.user_age}
							</Text>
						</View>
					</TouchableOpacity>
					<View style={styles.starIconRight}>
						<Rating starValue={rowData.item.puffy_events_ratings_star_value} />
					</View>
				</View>
				<View style={styles.locationNameContainer}>
					<Text style={styles.eventTitle}>{rowData.item.puffy_events_title}</Text>
					<Text style={styles.eventDate}>{rowData.item.puffy_events_date}</Text>
				</View>
				<View style={styles.commentContainer}>
					<Text style={styles.textInfo}>{rowData.item.puffy_events_ratings_comment}</Text>
				</View>
			</View>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Header deviceTheme={this.props.screenProps.deviceTheme} LeftIcon="back_arrow" LeftCallback={this.props.navigation.goBack} global={this.props.screenProps.global} />
				<View style={styles.section}>
					<Text style={styles.boldHeader}>Ratings</Text>
				</View>
				<View style={styles.cardContainerMargin}>
					<TouchableOpacity onPress={this.gotoProfile} style={styles.cardContainerTouch}>
						<Image style={styles.profileIcon} source={{ uri: this.user_image }} />
						<Text style={styles.eventHostName}>{this.user_name}</Text>
					</TouchableOpacity>
					<Rating starValue={this.star_value} />
				</View>
				{this.state.noRatings ? (
					<View style={styles.profileMessage}>
						<Image style={styles.lockedEye} source={Images.neutral_big} />
						<Text style={styles.profileMessageHeader}>No ratings to show</Text>
					</View>
				) : (
					<FlatList data={this.state.dataSource} renderItem={this.renderRow.bind(this)} horizontal={false} numColumns={1} keyExtractor={(item, index) => index} />
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
	cardContainer: {
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center"
	},
	cardContainerRow: {
		backgroundColor: "#fff",
		flexDirection: "column",
		alignItems: "center",
		margin: 5,
		borderRadius: 5
	},
	cardContainerTouch: {
		justifyContent: "center",
		alignItems: "center"
	},
	cardContainerMargin: {
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
		borderRadius: 5
	},
	ratingHeader: {
		paddingTop: 15,
		paddingBottom: 15,
		color: "#969aa5"
	},
	profileIcon: {
		height: 50,
		width: 50,
		resizeMode: "contain",
		borderRadius: 25,
		margin: 5,
		...Platform.select({
			android: {
				borderRadius: 50
			}
		})
	},
	eventHostName: {
		color: "#181818",
		fontWeight: "500"
	},
	starsImg: {
		height: 20,
		width: 100,
		resizeMode: "cover",
		marginBottom: 5
	},
	iconLeft: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center"
	},
	starIconRight: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
		marginRight: 10
	},
	userRatingContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: "#e6e6e6",
		margin: 10,
		borderRadius: 5
	},
	locationNameContainer: {
		alignItems: "center",
		marginBottom: 5,
		marginLeft: 25,
		marginRight: 25
	},
	eventName: {
		color: "#181818",
		marginLeft: 2
	},
	eventTitle: {
		color: "#181818",
		fontWeight: "500",
		textAlign: "center",
		marginBottom: 3
	},
	eventDate: {
		color: "#505050"
	},
	commentContainer: {
		flex: 1,
		width: Dimensions.get("window").width / 1.1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#e6e6e6",
		margin: 10,
		borderRadius: 1,
		padding: 25
	},
	textInfo: {
		textAlign: "center",
		color: "#505050"
	},
	noRatingsContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	noRatingsText: {
		color: "#8c8e9b"
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
	},
	section: {
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		marginLeft: 20,
		marginRight: 20,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 2
	},
	boldHeader: {
		fontSize: 16,
		fontFamily: "Helvetica",
		textAlign: "center",
		color: "#181818"
	}
};

export { EventsRating };
