import React, { Component } from "react";
import { ScrollView, Alert, View, Text, TouchableOpacity, ListView, Image, Button, TextInput, Dimensions, AsyncStorage, Platform } from "react-native";
import FilterInput from "../components/FilterInput";
import { CachedImage } from "react-native-img-cache";
import { NavigationActions } from "react-navigation";
import Header from "../components/Header";
import Images from "../config/images";
import CheckBox from "react-native-check-box";
import DateTimePicker from "react-native-modal-datetime-picker";
import BtnGreen from "../components/BtnGreen";
import Modal from "react-native-modal";
import Rating from "../components/Rating";
import ActionSheet from "react-native-actionsheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Unpuff"];

const options2 = ["Cancel", "Report"];
const DESTRUCTIVE_INDEX = 1;

class EventsView extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.navigation = this.props.navigation;
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.eventListener = this.eventListener.bind(this);
		this.onPuff = this.onPuff.bind(this);
		this.onPass = this.onPass.bind(this);
		this.onPending = this.onPending.bind(this);
		this.createEvent = this.createEvent.bind(this);
		this.approveGuests = this.approveGuests.bind(this);
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.didNotAttend = this.didNotAttend.bind(this);
		this.attended = this.attended.bind(this);
		this.goToRatings = this.goToRatings.bind(this);
		this.clickStar = this.clickStar.bind(this);
		this.refreshFunction = this.refreshFunction.bind(this);
		this.handlePress = this.handlePress.bind(this);
		this.onChangeRatingComment = this.onChangeRatingComment.bind(this);
		this.showMenu2 = this.showMenu2.bind(this);
		this.handlePress2 = this.handlePress2.bind(this);
		this.reportEvent = this.reportEvent.bind(this);
		this.gotoEventComment = this.gotoEventComment.bind(this);
		this.key = this.props.navigation.state.key;
		this.events_id = this.props.navigation.state.params.events_id;
		this.past = this.props.navigation.state.params.past;
		this.events_type = this.props.navigation.state.params.events_type;
		this.UserID = this.props.screenProps.global.user_id;

		this.state = {
			puffyEventsId: 0,
			puffyEventsTitle: "",
			puffyEventsImage: "",
			puffyEventsDate: "",
			puffyEventsTime: "",
			puffyEventsAgeInvited: "",
			puffyEventsLocationName: "",
			puffyEventsLocationAddress: "",
			puffyEventsCost: "",
			userImage: "",
			userName: "",
			userId: 0,
			puffyEventsMoreInfo: "",
			puffyIsHost: false,
			puffyAlreadyRsvp: 0,
			approvedRsvp: 0,
			isModalVisible: false,
			eventRatingComment: "",
			starValue: 0,
			starValueRating: 0,
			firstStarClicked: false,
			secondStarClicked: false,
			thirdStarClicked: false,
			fourthStarClicked: false,
			fifthStarClicked: false,
			isLoaded: 0,
			notFound: 0,
			character_count: 80,
			eventsType: this.props.navigation.state.params.events_type
		};
	}

	componentDidMount() {
		AsyncStorage.getItem("Event" + this.events_id, (err, result) => {
			if (!err && result != null) {
				let data = {};
				data["result_data"] = JSON.parse(result);

				this.setState({
					puffyEventsId: data["result_data"]["puffy_events_id"],
					puffyEventsTitle: data["result_data"]["puffy_events_title"],
					puffyEventsImage: data["result_data"]["file_event_image"],
					puffyEventsDate: data["result_data"]["puffy_events_date"],
					puffyEventsTime: data["result_data"]["puffy_events_time"],
					puffyEventsAgeInvited: data["result_data"]["puffy_events_age_invited"],
					puffyEventsLocationName: data["result_data"]["puffy_events_location_name"],
					puffyEventsLocationAddress: data["result_data"]["puffy_events_location_address"],
					puffyEventsCost: data["result_data"]["puffy_events_cost"],
					userImage: data["result_data"]["file_user_image"],
					userName: data["result_data"]["user_name"],
					userId: data["result_data"]["fk_user_id"],
					puffyEventsMoreInfo: data["result_data"]["puffy_events_more_info"],
					puffyIsHost: data["result_data"]["isHost"],
					puffyAlreadyRsvp: data["result_data"]["alreadyRsvp"],
					approvedRsvp: data["result_data"]["approvedRsvp"],
					starValue: data["result_data"]["starValue"],
					isLoaded: 1
				});

				if (this.past == 1 && data["result_data"]["rated_event"] == null && this.state.puffyAlreadyRsvp > 0 && data["result_data"]["rsvpAttended"] == null) {
					this.setState({ isModalVisible: true });
				} else {
					this.setState({ isModalVisible: false });
				}
			}
		});

		let dataString = {
			user_action: "get_events_view",
			user_data: {
				events_id: this.events_id
			}
		};

		this.handleEmit(dataString);

		this.puffyChannel.on("data_channel", this.eventListener);
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.eventListener);
	}

	eventListener(data) {
		if (data["result"] == 0 && data["result_action"] == "get_events_view_result") {
			this.setState({ isLoaded: 1, notFound: 1 });
		}

		if (data["result"] == 0 && data["result_action"] == "add_update_rsvp_result") {
			if (data["result_data"]["event_id"] == this.events_id) {
				this.setState({ puffyAlreadyRsvp: null });
			}
		}
		if (data["result"] == 1 && data["result_action"] == "add_update_rsvp_result") {
			if (data["result_data"]["event_id"] == this.events_id) {
				this.setState({ puffyAlreadyRsvp: data["result_data"]["rsvp_id"] });
			}
		}

		if (data["result"] == 0 && data["result_action"] == "create_puff_rsvp_result") {
			if (data["result_data"]["event_id"] == this.events_id) {
				this.setState({ puffyAlreadyRsvp: null });
			}
		}
		if (data["result"] == 1 && data["result_action"] == "create_puff_rsvp_result") {
			if (data["result_data"]["event_id"] == this.events_id) {
				this.setState({ puffyAlreadyRsvp: data["result_data"]["rsvp_id"] });
			}
		}

		if (data["result"] == 0 && data["result_action"] == "delete_rsvp_user_result") {
			if (data["result_data"]["rsvp_id"] == this.state.puffyAlreadyRsvp) {
				this.setState({ puffyAlreadyRsvp: null });
			}
		}
		if (data["result"] == 1 && data["result_action"] == "delete_rsvp_user_result") {
			if (data["result_data"]["rsvp_id"] == this.state.puffyAlreadyRsvp) {
				this.setState({ puffyAlreadyRsvp: null });
			}
		}

		if (data["result"] == 1 && data["result_action"] == "get_events_view_result") {
			this.setState({
				puffyEventsId: data["result_data"]["puffy_events_id"],
				puffyEventsTitle: data["result_data"]["puffy_events_title"],
				puffyEventsImage: data["result_data"]["file_event_image"],
				puffyEventsDate: data["result_data"]["puffy_events_date"],
				puffyEventsTime: data["result_data"]["puffy_events_time"],
				puffyEventsAgeInvited: data["result_data"]["puffy_events_age_invited"],
				puffyEventsLocationName: data["result_data"]["puffy_events_location_name"],
				puffyEventsLocationAddress: data["result_data"]["puffy_events_location_address"],
				puffyEventsCost: data["result_data"]["puffy_events_cost"],
				userImage: data["result_data"]["file_user_image"],
				userName: data["result_data"]["user_name"],
				userId: data["result_data"]["fk_user_id"],
				puffyEventsMoreInfo: data["result_data"]["puffy_events_more_info"],
				puffyIsHost: data["result_data"]["isHost"],
				puffyAlreadyRsvp: data["result_data"]["alreadyRsvp"],
				approvedRsvp: data["result_data"]["approvedRsvp"],
				starValue: data["result_data"]["starValue"],
				isLoaded: 1
			});

			if (this.past == 1 && data["result_data"]["rated_event"] == null && this.state.puffyAlreadyRsvp > 0 && data["result_data"]["rsvpAttended"] == null) {
				this.setState({ isModalVisible: true });
			} else {
				this.setState({ isModalVisible: false });
			}

			let localData = JSON.stringify(data["result_data"]);

			if (localData) {
				AsyncStorage.setItem("Event" + this.events_id, localData);
			}
		}
	}

	createEvent() {
		this.props.navigation.navigate("EventDetail", {
			events_id: this.state.puffyEventsId,
			key: this.key,
			refresh: this.refreshFunction,
			events_type: this.events_type
		});
	}

	refreshFunction() {
		let dataString = {
			user_action: "get_events_view",
			user_data: {
				events_id: this.events_id
			}
		};

		this.handleEmit(dataString);
	}

	approveGuests() {
		this.props.navigation.navigate("EventApprove", {
			events_id: this.state.puffyEventsId,
			events_title: this.state.puffyEventsTitle,
			events_date: this.state.puffyEventsDate,
			event_type: this.events_type
		});
	}

	onPuff(event_id) {
		let dataString = {
			user_action: "create_puff_rsvp",
			user_data: {
				event_id: event_id,
				likedislike: 1
			}
		};

		this.handleEmit(dataString);
	}

	onPass(event_id) {
		let dataString = {
			user_action: "create_puff_rsvp",
			user_data: {
				event_id: event_id,
				likedislike: 0
			}
		};

		this.handleEmit(dataString);
	}

	onPending() {
		this.ActionSheet.show();
	}

	gotoProfile(user_id, props) {
		if (user_id === this.UserID) {
			return false;
		}

		props["id"] = props["userId"];
		props["name"] = props["userName"];
		props["thumb"] = props["userImage"];

		this.props.navigation.navigate("Profile", { user: props, user_id: user_id });
	}

	gotoEventComment() {
		this.props.navigation.navigate("EventComment", { event_id: this.events_id });
	}

	goToRatings(user_id) {
		this.props.navigation.navigate("EventsRating", {
			user_id: user_id,
			user_name: this.state.userName,
			user_image: this.state.userImage,
			star_value: this.state.starValue
		});
	}

	showModal() {
		this.setState({ isModalVisible: true });
	}

	hideModal() {
		this.setState({ isModalVisible: false });
	}

	didNotAttend() {
		this.setState({ isModalVisible: false });
		let dataString = {
			user_action: "add_event_rating",
			user_data: {
				attended: 0,
				event_id: this.events_id
			}
		};

		this.handleEmit(dataString);
	}

	attended() {
		if (this.state.starValueRating == 0) {
			alert("Please select rating.");
			return false;
		}

		if (this.state.eventRatingComment == "") {
			alert("Please enter comment.");
			return false;
		}

		this.setState({ isModalVisible: false });
		let dataString = {
			user_action: "add_event_rating",
			user_data: {
				attended: 1,
				event_id: this.events_id,
				star_rating: this.state.starValueRating,
				comment: this.state.eventRatingComment
			}
		};

		this.handleEmit(dataString);
	}

	clickStar(starNumber) {
		this.setState({ starValueRating: starNumber });

		if (starNumber == 1) {
			this.setState({
				firstStarClicked: true,
				secondStarClicked: false,
				thirdStarClicked: false,
				fourthStarClicked: false,
				fifthStarClicked: false
			});
		} else if (starNumber == 2) {
			this.setState({
				firstStarClicked: true,
				secondStarClicked: true,
				thirdStarClicked: false,
				fourthStarClicked: false,
				fifthStarClicked: false
			});
		} else if (starNumber == 3) {
			this.setState({
				firstStarClicked: true,
				secondStarClicked: true,
				thirdStarClicked: true,
				fourthStarClicked: false,
				fifthStarClicked: false
			});
		} else if (starNumber == 4) {
			this.setState({
				firstStarClicked: true,
				secondStarClicked: true,
				thirdStarClicked: true,
				fourthStarClicked: true,
				fifthStarClicked: false
			});
		} else if (starNumber == 5) {
			this.setState({
				firstStarClicked: true,
				secondStarClicked: true,
				thirdStarClicked: true,
				fourthStarClicked: true,
				fifthStarClicked: true
			});
		}
	}

	handlePress(i) {
		if (i == 1) {
			//this.setState({ puffyAlreadyRsvp: null });

			let dataString = {
				user_action: "delete_rsvp_user",
				user_data: {
					rsvp_id: this.state.puffyAlreadyRsvp
				}
			};

			console.log(dataString);

			this.handleEmit(dataString);
		}
	}

	onChangeRatingComment(text) {
		var count = text.length;
		var characterCount = 80 - count;

		this.setState({ eventRatingComment: text, character_count: characterCount });
	}

	showMenu2() {
		this.ActionSheet2.show();
	}

	handlePress2(i) {
		if (i == 1) {
			this.reportEvent();
		}
	}

	reportEvent() {
		let dataString = {
			user_action: "report_event",
			user_data: {
				event_id: this.events_id
			}
		};

		this.handleEmit(dataString);
	}

	render() {
		if (this.state.isLoaded == 0) {
			return (
				<View style={styles.container}>
					<Header
						deviceTheme={this.props.screenProps.deviceTheme}
						LeftIcon="back_arrow"
						LeftCallback={this.props.navigation.goBack}
						RightIcon={this.state.puffyIsHost == true && this.state.eventsType != 4 ? "edit_event" : null}
						RightCallback={this.createEvent}
						global={this.props.screenProps.global}
					/>
				</View>
			);
		} else if (this.state.notFound == 1) {
			return (
				<View style={styles.container}>
					<Header
						deviceTheme={this.props.screenProps.deviceTheme}
						LeftIcon="back_arrow"
						LeftCallback={this.props.navigation.goBack}
						RightIcon={this.state.puffyIsHost == true && this.state.eventsType != 4 ? "edit_event" : null}
						RightCallback={this.createEvent}
						global={this.props.screenProps.global}
					/>
					<View style={styles.profileMessage}>
						<Image style={styles.lockedEye} source={Images.neutral_big} />
						<Text style={styles.profileMessageHeader}>Event not found!</Text>
					</View>
				</View>
			);
		}

		return (
			<View style={styles.container}>
				{this.state.puffyIsHost == true ? (
					<Header
						deviceTheme={this.props.screenProps.deviceTheme}
						LeftIcon="back_arrow"
						LeftCallback={this.props.navigation.goBack}
						RightIcon={this.state.eventsType != 4 ? "edit_event" : null}
						RightCallback={this.createEvent}
						global={this.props.screenProps.global}
					/>
				) : (
					<Header
						deviceTheme={this.props.screenProps.deviceTheme}
						LeftIcon="back_arrow"
						LeftCallback={this.props.navigation.goBack}
						RightIcon={"circles_3"}
						RightCallback={this.showMenu2}
						RightIconStyle="menuIcon"
						global={this.props.screenProps.global}
					/>
				)}
				<Modal isVisible={this.state.isModalVisible} animationIn={"slideInUp"}>
					<View style={styles.modalContainer}>
						<View style={styles.modalView}>
							<View style={styles.headerContainer}>
								<Text style={styles.modalHeaderText}>Rate the Host</Text>
							</View>
							<KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
								<View style={styles.ratingContainer}>
									<CachedImage style={styles.profileIcon} source={{ uri: this.state.userImage }} />
									<Text>{this.state.userName}</Text>
									<Text style={styles.locationStyle}>{this.state.puffyEventsTitle}</Text>
									<Text style={styles.locationCityStyle}>
										{this.state.puffyEventsLocationName} | {this.state.puffyEventsLocationAddress}
									</Text>
									<Text style={styles.locationCityStyle}>{this.state.puffyEventsTime}</Text>
									<View style={styles.ratingStarContainer}>
										<TouchableOpacity onPress={() => this.clickStar(1)}>
											{this.state.firstStarClicked ? (
												<Image style={styles.ratingStar} source={Images.gold_star} />
											) : (
												<Image style={styles.ratingStar} source={Images.gray_star} />
											)}
										</TouchableOpacity>

										<TouchableOpacity onPress={() => this.clickStar(2)}>
											{this.state.secondStarClicked ? (
												<Image style={styles.ratingStar} source={Images.gold_star} />
											) : (
												<Image style={styles.ratingStar} source={Images.gray_star} />
											)}
										</TouchableOpacity>

										<TouchableOpacity onPress={() => this.clickStar(3)}>
											{this.state.thirdStarClicked ? (
												<Image style={styles.ratingStar} source={Images.gold_star} />
											) : (
												<Image style={styles.ratingStar} source={Images.gray_star} />
											)}
										</TouchableOpacity>

										<TouchableOpacity onPress={() => this.clickStar(4)}>
											{this.state.fourthStarClicked ? (
												<Image style={styles.ratingStar} source={Images.gold_star} />
											) : (
												<Image style={styles.ratingStar} source={Images.gray_star} />
											)}
										</TouchableOpacity>

										<TouchableOpacity onPress={() => this.clickStar(5)}>
											{this.state.fifthStarClicked ? (
												<Image style={styles.ratingStar} source={Images.gold_star} />
											) : (
												<Image style={styles.ratingStar} source={Images.gray_star} />
											)}
										</TouchableOpacity>
									</View>
									<TextInput
										style={styles.ratingsComment}
										multiline={true}
										numberOfLines={2}
										maxLength={80}
										returnKeyType="done"
										characterCount={this.state.character_count}
										onChangeText={eventRatingComment => this.onChangeRatingComment(eventRatingComment)}
										value={this.state.eventRatingComment}
										placeholder="Enter comment..."
									/>
									<Text style={styles.charactersLeft}>{this.state.character_count} characters Left</Text>
									<View style={styles.rateBtnContainer}>
										<TouchableOpacity style={styles.btn} onPress={() => this.didNotAttend()}>
											<Text style={styles.btnText}>Did not attend</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.btn} onPress={() => this.attended()}>
											<Text style={styles.btnText}>Submit Rating</Text>
										</TouchableOpacity>
									</View>
								</View>
							</KeyboardAwareScrollView>
						</View>
					</View>
				</Modal>
				<ScrollView>
					<View style={styles.cardContainer}>
						<Text style={styles.eventTitle}>{this.state.puffyEventsTitle}</Text>
						<Image style={styles.cardImage} source={{ uri: this.state.puffyEventsImage }} />

						{this.state.puffyAlreadyRsvp == null ? (
							<View style={styles.puffyBtnContainer}>
								<TouchableOpacity style={styles.btnContainerLeft} onPress={() => this.onPass(this.state.puffyEventsId)}>
									<Image style={styles.stampBtn} source={Images.passBtn5} />
								</TouchableOpacity>
								<TouchableOpacity style={styles.btnContainerRight} onPress={() => this.onPuff(this.state.puffyEventsId)}>
									<Image style={styles.stampBtn} source={Images.puffBtn5} />
								</TouchableOpacity>
							</View>
						) : null}

						<View style={styles.cardContainerrating}>
							<View style={styles.cardContainerRow}>
								<TouchableOpacity onPress={() => this.gotoProfile(this.state.userId, this.state)}>
									<Image style={styles.profileIcon} source={{ uri: this.state.userImage }} />
								</TouchableOpacity>
								<View>
									<TouchableOpacity onPress={() => this.gotoProfile(this.state.userId, this.state)}>
										<Text style={styles.hostName}>{this.state.userName}</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={() => this.goToRatings(this.state.userId)}>
										<View>
											<Rating starValue={this.state.starValue} />
										</View>
									</TouchableOpacity>
								</View>
							</View>
							<TouchableOpacity onPress={this.gotoEventComment}>
								<Image style={styles.eventCommentIcon} source={Images.message_friend} />
							</TouchableOpacity>
						</View>
						<View style={styles.eventrow}>
							<View style={styles.eventsDetailLeft}>
								<Text style={styles.fontLabel}>
									When: <Text style={styles.fontColor}>{this.state.puffyEventsDate}</Text>
								</Text>
								<Text style={styles.fontLabel}>
									Time: <Text style={styles.fontColor}>{this.state.puffyEventsTime}</Text>
								</Text>
								<Text style={styles.fontLabel}>
									Age: <Text style={styles.fontColor}>{this.state.puffyEventsAgeInvited}</Text>
								</Text>
							</View>
							<View style={styles.eventsDetailRight}>
								<Text numberOfLines={1} style={styles.eventLocation}>
									{this.state.puffyEventsLocationName}
								</Text>
								<Text numberOfLines={1} style={styles.eventLocation}>
									{this.state.puffyEventsLocationAddress}
								</Text>
								{this.state.puffyEventsCost > 0 ? (
									<Text style={styles.fontLabel}>
										Ticket: <Text style={styles.fontColor}>${this.state.puffyEventsCost}</Text>
									</Text>
								) : (
									<Text style={styles.fontLabel}>Ticket: Free</Text>
								)}
							</View>
						</View>
					</View>

					{this.state.puffyEventsMoreInfo ? (
						<View style={styles.cardContainer}>
							<View style={styles.cardContainerRow}>
								<Text style={styles.eventInfo}>{this.state.puffyEventsMoreInfo}</Text>
							</View>
						</View>
					) : null}

					{this.state.puffyIsHost == true ? (
						<View style={styles.userAction}>
							{this.events_type == 4 ? (
								<TouchableOpacity style={styles.btnPreviousTouch} onPress={() => this.approveGuests()}>
									<Text style={styles.btnPreviousGuest}>PREVIOUS GUESTS</Text>
								</TouchableOpacity>
							) : (
								<TouchableOpacity style={styles.btnApproveTouch} onPress={() => this.approveGuests()}>
									<Text style={styles.btnApproveGuest}>APPROVE GUESTS</Text>
								</TouchableOpacity>
							)}
						</View>
					) : (
						<View>
							{this.state.puffyAlreadyRsvp == null ? null : (
								<View style={styles.userAction}>
									{this.events_type == 4 ? (
										<TouchableOpacity style={styles.btnPreviousTouch}>
											<Text style={styles.btnPreviousGuest}>ENDED</Text>
										</TouchableOpacity>
									) : (
										<TouchableOpacity style={styles.btnApproveTouch} onPress={() => this.onPending()}>
											<Text style={styles.btnApproveGuest}>{this.state.approvedRsvp > 0 ? "CONFIRMED" : "PENDING"}</Text>
										</TouchableOpacity>
									)}
								</View>
							)}
						</View>
					)}
					<ActionSheet ref={o => (this.ActionSheet = o)} title="Unpuff this event" options={options} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress} />
					<ActionSheet
						ref={o => (this.ActionSheet2 = o)}
						options={options2}
						destructiveButtonIndex={DESTRUCTIVE_INDEX}
						cancelButtonIndex={CANCEL_INDEX}
						onPress={this.handlePress2}
					/>
				</ScrollView>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#e9ebf2"
	},
	cardContainer: {
		backgroundColor: "#fff",
		margin: 5,
		borderRadius: 10
	},
	cardContainerrating: {
		backgroundColor: "#fff",
		marginLeft: 15,
		marginRight: 15,
		borderRadius: 10,
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 3
	},
	cardContainerRow: {
		backgroundColor: "#FFF",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center"
	},
	hostName: {
		color: "#181818",
		fontWeight: "500"
	},
	hostLabel: {
		color: "#8e9196"
	},
	profileInfoContainer: {
		flex: 1,
		alignItems: "flex-end",
		margin: 10
	},
	cardImage: {
		height: Dimensions.get("window").width - 15,
		width: null,
		resizeMode: "contain",
		margin: 5
	},
	cardProfileImage: {
		width: 20,
		height: 20,
		resizeMode: "contain"
	},
	eventTitle: {
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
		marginBottom: 10,
		textAlign: "center",
		color: "#181818",
		fontWeight: "500"
	},
	eventrow: {
		flex: 1,
		flexDirection: "row"
	},
	eventsDetailLeft: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 20
	},
	eventsDetailRight: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 20
	},
	profileIcon: {
		width: 40,
		height: 40,
		margin: 5,
		resizeMode: "contain",
		borderRadius: 20
	},
	cohostTitle: {
		margin: 10
	},
	eventInfo: {
		margin: 10,
		color: "#505050"
	},
	fontLabel: {
		color: "#181818"
	},
	fontColor: {
		color: "#505050"
	},
	eventLocation: {
		color: "#505050",
		width: 140
	},
	userAction: {
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 10,
		paddingBottom: 20,
		paddingLeft: 35,
		paddingRight: 35,
		flexDirection: "row"
	},
	btnPass: {
		flex: 1,
		borderColor: "#E97E4F",
		borderWidth: 4,
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 20,
		paddingTop: 5,
		paddingBottom: 5
	},
	btnPassText: {
		color: "#E97E4F",
		fontSize: 24,
		fontWeight: "bold",
		fontFamily: "Helvetica",
		textAlign: "center",
		letterSpacing: 5,
		marginLeft: 5
	},
	btnPuff: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 5,
		borderColor: "#57BBC7",
		borderWidth: 4,
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center"
	},
	btnPuffText: {
		color: "#57BBC7",
		fontSize: 24,
		fontWeight: "bold",
		fontFamily: "Helvetica",
		textAlign: "center",
		letterSpacing: 5,
		marginLeft: 5
	},
	starsImg: {
		height: 30,
		width: 160,
		resizeMode: "cover"
	},
	btnApproveTouch: {
		height: 35,
		width: 250,
		borderWidth: 2,
		borderColor: "#00AABA",
		borderRadius: 5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 17,
		paddingRight: 17,
		justifyContent: "center"
	},
	btnApproveGuest: {
		color: "#00AABA",
		fontSize: 16,
		textAlign: "center",
		fontFamily: "Helvetica"
	},
	btnPreviousTouch: {
		height: 35,
		width: 250,
		borderWidth: 2,
		borderColor: "#ccc",
		borderRadius: 5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 17,
		paddingRight: 17,
		justifyContent: "center"
	},
	btnPreviousGuest: {
		color: "#ccc",
		fontSize: 16,
		textAlign: "center",
		fontFamily: "Helvetica"
	},
	modalContainer: {
		flex: 1,
		flexDirection: "column",
		marginTop: 45,
		alignItems: "center",
		borderRadius: 10
	},
	modalView: {
		width: Dimensions.get("window").width / 1.1,
		height: 345,
		backgroundColor: "white",
		borderRadius: 10
	},
	headerContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		height: 30,
		borderBottomColor: "#1abdcc",
		borderBottomWidth: 1,
		marginLeft: 10,
		marginRight: 10
	},
	ratingContainer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center"
	},
	profileIcon: {
		width: 40,
		height: 40,
		margin: 5,
		resizeMode: "contain",
		borderRadius: 20,
		...Platform.select({
			android: {
				borderRadius: 40
			}
		})
	},
	btn: {
		width: 150,
		height: 30,
		borderWidth: 1,
		borderColor: "#1abdcc",
		borderRadius: 3,
		marginTop: 10,
		marginLeft: 5,
		marginRight: 5,
		justifyContent: "center",
		backgroundColor: "#1abdcc"
	},
	btnText: {
		color: "#fff",
		fontSize: 14,
		textAlign: "center",
		fontFamily: "Helvetica"
	},
	ratingsComment: {
		height: 50,
		width: 230,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: "#d8d8d8",
		paddingLeft: 5
	},
	charactersLeft: {
		color: "#d8d8d8"
	},
	locationStyle: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 5,
		textAlign: "center"
	},
	locationCityStyle: {
		fontSize: 18,
		color: "#909098"
	},
	modalHeaderText: {
		fontSize: 16,
		fontWeight: "bold"
	},
	rateBtnContainer: {
		flex: 1,
		flexDirection: "row"
	},
	ratingStarContainer: {
		flex: 1,
		flexDirection: "row",
		marginTop: 5,
		marginBottom: 5
	},
	ratingStar: {
		height: 30,
		width: 30,
		resizeMode: "cover",
		marginRight: 5
	},
	stampBtn: {
		width: 60,
		height: 60
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
	profileText: {
		fontSize: 16,
		textAlign: "center",
		color: "#777980"
	},
	puffyBtnContainer: {
		flex: 1,
		flexDirection: "row",
		position: "absolute",
		justifyContent: "center",
		bottom: 140,
		left: 0,
		right: 0
	},
	eventComment: {
		flex: 1,
		postion: "absolute",
		right: 10,
		backgroundColor: "#fff"
	},
	eventCommentIcon: {
		position: "absolute",
		right: 0,
		bottom: 0,
		height: 50,
		width: 50
	},
	btnContainerRight: {
		marginLeft: 45
	}
};

export { EventsView };
