import React, { Component } from "react";
import { Dimensions, Modal, ScrollView, Alert, View, Text, TouchableOpacity, ListView, Image, Button, TextInput, Platform } from "react-native";
import ActionSheet from "react-native-actionsheet";
import FilterInput from "../components/FilterInput";
import { NavigationActions } from "react-navigation";
import Header from "../components/Header";
import Images from "../config/images";
import CheckBox from "react-native-check-box";
import DateTimePicker from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import BtnDefault from "../components/BtnDefault";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputText from "../components/InputText";
import InputTextBtn from "../components/InputTextBtn";
import InputTextMultiEvent from "../components/InputTextMultiEvent";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Take Photo", "Choose From Gallery"];
const title = "Add Event Photo";

const homePlace1 = {
	formatted_address: "Los Angeles, CA",
	description: "Los Angeles, CA",
	geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }
};
const homePlace2 = { formatted_address: "Las Vegas, NV", description: "Las Vegas, NV", geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const homePlace3 = {
	formatted_address: "San Francisco, CA",
	description: "San Francisco, CA",
	geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }
};
const homePlace4 = { formatted_address: "Portland, OR", description: "Portland, OR", geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const homePlace5 = { formatted_address: "Phoenix, AZ", description: "Phoenix, AZ", geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const homePlace6 = { formatted_address: "Denver, CO", description: "Denver, CO", geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };

class EventDetail extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.navigation = this.props.navigation;
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.onCheckGuestsApproved = this.onCheckGuestsApproved.bind(this);
		this.formatDate = this.formatDate.bind(this);
		this.formatAMPM = this.formatAMPM.bind(this);
		this.showDateTimePicker = this.showDateTimePicker.bind(this);
		this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
		this.handleDatePicked = this.handleDatePicked.bind(this);
		this.toggleMoreInfo = this.toggleMoreInfo.bind(this);
		this.onChangeMoreInfo = this.onChangeMoreInfo.bind(this);
		this.createEvent = this.createEvent.bind(this);
		this.eventListener = this.eventListener.bind(this);
		this.setModalVisible = this.setModalVisible.bind(this);
		this.setModalVisibleLocation = this.setModalVisibleLocation.bind(this);
		this.setLocationCityState = this.setLocationCityState.bind(this);
		this.setLocationName = this.setLocationName.bind(this);
		this.setGuestsInvited = this.setGuestsInvited.bind(this);
		this.setAgeInvited = this.setAgeInvited.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.handlePress = this.handlePress.bind(this);
		this.key = this.props.navigation.state.key;
		this.routeName = this.props.navigation.state.routeName;
		this.events_id = this.props.navigation.state.params.events_id;
		this.getSource = this.getSource.bind(this);
		this.setTicketFree = this.setTicketFree.bind(this);
		this.cancelEvent = this.cancelEvent.bind(this);
		this.removeEvent = this.removeEvent.bind(this);
		this.keyBefore = this.props.navigation.state.params.key;
		this.events_type = this.props.navigation.state.params.events_type;
		this.goToRatings = this.goToRatings.bind(this);

		let file_id = 0;

		if (this.props.navigation.state.params.file) {
			file_id = this.props.navigation.state.params.file.file_id;
			console.log("file id" + file_id);
			this.setState({ fileEventId: file_id });
		}

		let d1 = new Date();
		let d2 = new Date();
		d2.setHours(d1.getHours() + 1);

		this.state = {
			isCheckedGuestsApproved: 0,
			eventTitleText: "",
			eventLocationName: "Add Venue",
			eventLocationCityState: "Add Location",
			eventMoreInfo: "",
			guestsInvited: "",
			ageInvited: "",

			eventTitleTextError: false,
			eventDateTimeError: false,
			eventLocationNameError: false,
			eventLocationCityStateError: false,
			guestsInvitedError: false,
			ageInvitedError: false,

			isFree: false,
			eventCost: "0",
			eventDateTime: "Select Date & Time",
			eventDateTimeSql: "",
			isDateTimePickerVisible: false,
			showMoreInfo: false,
			characterCount: 200,
			userImage: "",
			userName: "",
			starValue: 0,
			userId: 0,
			isLoaded: 0,
			isUpdating: 0,
			notFound: 0,
			modalVisibleLocation: false,
			modalVisible: false,
			fileEventId: file_id,
			fileEventThumbnailUrl: "",
			initialDate: d2
		};
	}

	componentDidMount() {
		let dataString = {
			user_action: "get_event_user_profile",
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

	showMenu() {
		this.ActionSheet.show();
	}

	//action menu buton click.
	handlePress(i) {
		if (i == 1) {
			this.gotoPhoto();
		} else if (i == 2) {
			this.gotoGallery();
		}
	}

	gotoPhoto() {
		this.props.navigation.navigate("Photo", { event: 1, key: this.key, routeName: this.routeName });
	}

	gotoGallery() {
		this.props.navigation.navigate("Gallery", { event: 1, key: this.key, routeName: this.routeName });
	}

	goToRatings() {
		this.props.navigation.navigate("EventsRating", {
			user_id: this.state.userId,
			user_name: this.state.userName,
			user_image: this.state.userImage,
			star_value: this.state.starValue
		});
	}

	setModalVisible(visible) {
		if (visible == null) visible = false;
		this.setState({ modalVisible: visible });
	}

	setModalVisibleLocation(visible) {
		if (visible == null) visible = false;
		this.setState({ modalVisibleLocation: visible });
	}

	eventListener(data) {
		if (data["result"] == 1 && data["result_action"] == "create_event_result") {
			if (this.events_id > 0) {
				Alert.alert("Success", "Event succesfully updated.");
				this.props.navigation.state.params.refresh();
			} else {
				Alert.alert("Success", "Event succesfully created.");
				let dataString = {
					user_action: "get_events",
					user_data: {}
				};

				this.handleEmit(dataString);

				let dataString2 = {
					user_action: "get_host_events",
					user_data: {}
				};

				this.handleEmit(dataString2);
			}
			this.props.navigation.goBack();
		} else if (data["result"] == 1 && data["result_action"] == "get_event_user_profile_result") {
			let userData = data["result_data"][0];

			if (userData["puffy_events_id"] > 0) {
				this.setState({
					isCheckedGuestsApproved: userData["puffy_events_approve_by_host"],
					eventTitleText: userData["puffy_events_title"],
					eventDateTime: userData["puffy_events_date_time_formmated"],
					eventDateTimeSql: userData["puffy_events_date_time_24"],
					eventLocationName: userData["puffy_events_location_name"],
					eventLocationCityState: userData["puffy_events_location_address"],
					eventMoreInfo: userData["puffy_events_more_info"],
					guestsInvited: userData["puffy_events_guests_invited"],
					ageInvited: userData["puffy_events_age_invited"],
					eventCost: userData["puffy_events_cost"].toString(),
					showMoreInfo: true,
					fileEventId: userData["fk_file_id"],
					fileEventThumbnailUrl: userData["file_event_thumbnail_url"]
				});

				if (userData["puffy_events_cost"] == 0) {
					this.setState({ isFree: true });
				} else {
					this.setState({ isFree: false });
				}

				var count = userData["puffy_events_more_info"].length;
				var characterCount = 255 - count;

				this.setState({ characterCount: characterCount });
			}

			this.setState({
				userName: userData["user_name"],
				userImage: userData["file_thumbnail_url"],
				userId: userData["user_id"],
				isLoaded: 1,
				isUpdating: 0
			});
		} else if (data["result"] == 0 && data["result_action"] == "get_event_user_profile_result") {
			this.setState({ isLoaded: 1, notFound: 1 });
		}
	}

	createEvent() {
		let showError = 0;

		if (this.props.screenProps.global.networkStatus == false) {
			Alert.alert("Incorrect", "You have no internet connection");
			return false;
		}
		if (this.state.eventCost != "0" && isNaN(this.state.eventCost)) {
			Alert.alert("Incomplete", "Event cost must be a number", [{ text: "OK", onPress: () => console.log("OK Pressed") }], { cancelable: false });
			return false;
		}
		if (this.state.eventTitleText == "" || this.state.eventTitleText == " " || this.state.eventTitleText == "  " || this.state.eventTitleText == "   ") {
			this.setState({ eventTitleTextError: true });
			showError = 1;
		}
		if (this.state.eventDateTime === "Select Date & Time") {
			this.setState({ eventDateTimeError: true });
			showError = 1;
		}
		if (this.state.eventLocationName === "Add Venue") {
			this.setState({ eventLocationNameError: true });
			showError = 1;
		}
		if (this.state.eventLocationCityState === "Add Location") {
			this.setState({ eventLocationCityStateError: true });
			showError = 1;
		}
		if (this.state.guestsInvited === "") {
			this.setState({ guestsInvitedError: true });
			showError = 1;
		}
		if (this.state.ageInvited === "") {
			this.setState({ ageInvitedError: true });
			showError = 1;
		}

		if (showError == 1) {
			Alert.alert("Incomplete", "Please complete required information", [{ text: "OK", onPress: () => console.log("OK Pressed") }], { cancelable: false });
			return false;
		}

		let fileIDEvent = 0;
		if (this.events_id > 0) {
			if (typeof this.props.navigation.state.params.file !== "undefined") {
				fileIDEvent = this.props.navigation.state.params.file.file_id;
			} else {
				fileIDEvent = this.state.fileEventId;
			}
		} else {
			//new event check for file id
			if (typeof this.props.navigation.state.params.file == "undefined") {
				Alert.alert("Incomplete", "Please upload a photo", [{ text: "OK", onPress: () => console.log("OK Pressed") }], { cancelable: false });
				return false;
			} else {
				fileIDEvent = this.props.navigation.state.params.file.file_id;
			}
		}

		let dataString = {
			user_action: "create_event",
			user_data: {
				puffy_events_title: this.state.eventTitleText,
				puffy_events_date_time: this.state.eventDateTimeSql,
				puffy_events_location_name: this.state.eventLocationName,
				puffy_events_location_address: this.state.eventLocationCityState,
				puffy_events_more_info: this.state.eventMoreInfo,
				puffy_events_guests_invited: this.state.guestsInvited,
				puffy_events_age_invited: this.state.ageInvited,
				puffy_events_approve_by_host: this.state.isCheckedGuestsApproved,
				puffy_events_cost: this.state.eventCost,
				puffy_events_id: this.events_id,
				fk_file_id: fileIDEvent
			}
		};

		this.handleEmit(dataString);
		this.setState({ isUpdating: 1 });
	}

	showDateTimePicker() {
		this.setState({ isDateTimePickerVisible: true });
	}

	hideDateTimePicker() {
		this.setState({ isDateTimePickerVisible: false });
	}

	handleDatePicked(date) {
		this.hideDateTimePicker();

		d = new Date(date);
		d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

		this.setState({
			eventDateTime: this.formatDate(date),
			eventDateTimeError: false,
			eventDateTimeSql: d.toISOString().slice(0, -1)
		});
	}

	formatDate(formattedDate) {
		var month = formattedDate.getMonth() + 1 < 10 ? "0" + (formattedDate.getMonth() + 1) : formattedDate.getMonth() + 1;
		var day = formattedDate.getDate().toString() < 10 ? "0" + formattedDate.getDate().toString() : formattedDate.getDate().toString();
		var newDate = month + "-" + day + "-" + formattedDate.getFullYear().toString() + " ";

		return newDate + this.formatAMPM(formattedDate);
	}

	formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 15 ? 0 : minutes;
		minutes = minutes >= 15 ? 30 : minutes;
		minutes = minutes < 10 ? "0" + minutes : minutes;
		var strTime = hours + ":" + minutes + " " + ampm;
		return strTime;
	}

	toggleMoreInfo() {
		this.setState({ showMoreInfo: !this.state.showMoreInfo });
	}

	setLocationName(location) {
		console.log("locc" + location);

		location = location.replace(/, United States$/, "");
		location = location.replace(/, USA$/, "");

		this.setState({
			eventLocationName: location,
			eventLocationNameError: false,
			modalVisibleLocation: false
		});
	}

	setLocationCityState(location) {
		location = location.replace(/, United States$/, "");
		location = location.replace(/, USA$/, "");
		location = location.replace(/, Canada$/, "");

		this.setState({
			eventLocationCityState: location,
			eventLocationCityStateError: false,
			modalVisible: false
		});
	}

	onCheckGuestsApproved() {
		if (this.state.isCheckedGuestsApproved === 0) {
			this.setState({ isCheckedGuestsApproved: 1 });
		} else {
			this.setState({ isCheckedGuestsApproved: 0 });
		}
	}

	onChangeMoreInfo(text) {
		var count = text.length;
		var characterCount = 200 - count;

		console.log(text);

		text = text.replace("\n", "");

		this.setState({ eventMoreInfo: text, characterCount: characterCount });
	}

	setGuestsInvited(value) {
		this.setState({ guestsInvited: value, guestsInvitedError: false });
	}

	setAgeInvited(value) {
		this.setState({
			ageInvited: value,
			ageInvitedError: false
		});
	}

	getSource() {
		if (this.events_id > 0) {
			if (typeof this.props.navigation.state.params.file !== "undefined") {
				return <Image style={styles.addImageEvent} source={{ uri: this.props.navigation.state.params.file.thumb }} />;
			} else {
				return <Image style={styles.addImageEvent} source={{ uri: this.state.fileEventThumbnailUrl }} />;
			}
		} else {
			//new event check for file id
			if (typeof this.props.navigation.state.params.file == "undefined") {
				return <Image style={styles.addImageEvent} source={Images.camera_plus} />;
			} else {
				return <Image style={styles.addImageEvent} source={{ uri: this.props.navigation.state.params.file.thumb }} />;
			}
		}
	}

	setTicketFree() {
		this.setState({ isFree: !this.state.isFree }, function() {
			if (this.state.isFree) {
				this.setState({ eventCost: 0 });
			}
		});
	}

	cancelEvent() {
		Alert.alert("Cancel Event", "Are you sure?", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.removeEvent() }]);
	}

	removeEvent() {
		let dataString = {
			user_action: "delete_event",
			user_data: {
				puffy_events_id: this.events_id
			}
		};

		this.handleEmit(dataString);

		//first tab home
		if (this.events_type == 1) {
			let dataString = {
				user_action: "get_events",
				user_data: {}
			};

			this.handleEmit(dataString);
		} else if (this.events_type == 2) {
			let dataString = {
				user_action: "get_event_up_next",
				user_data: {}
			};

			this.handleEmit(dataString);
		} else if (this.events_type == 3) {
			let dataString = {
				user_action: "get_host_events",
				user_data: {}
			};

			this.handleEmit(dataString);
		} else if (this.events_type == 4) {
			let dataString = {
				user_action: "get_event_past",
				user_data: {}
			};

			this.handleEmit(dataString);
		}

		const $this = this;

		const resetAction = NavigationActions.back({
			key: $this.keyBefore
		});

		$this.props.navigation.dispatch(resetAction);
	}

	render() {
		if (this.state.isLoaded == 0) {
			return (
				<View style={styles.container}>
					<Header
						deviceTheme={this.props.screenProps.deviceTheme}
						LeftIcon="back_arrow"
						LeftCallback={this.props.navigation.goBack}
						title="Create an Event"
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
				<Header
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon="back_arrow"
					LeftCallback={this.props.navigation.goBack}
					RightIcon={this.state.isUpdating == 1 ? "" : "checkmark_button"}
					RightCallback={this.createEvent}
					title="Create an Event"
					global={this.props.screenProps.global}
				/>

				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisibleLocation}
					onRequestClose={() => {
						this.setModalVisibleLocation(false);
					}}
				>
					<View style={styles.locationContainer}>
						<Header
							deviceTheme={this.props.screenProps.deviceTheme}
							LeftIcon="back_arrow"
							LeftCallback={this.setModalVisibleLocation}
							global={this.props.screenProps.global}
						/>
						<GooglePlacesAutocomplete
							placeholder="Enter venue name"
							minLength={1} // minimum length of text to search
							enablePoweredByContainer={false}
							autoFocus={true}
							returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
							listViewDisplayed="auto" // true/false/undefined
							fetchDetails={true}
							renderDescription={row => row.description} // custom description render
							onPress={(data, details = null) => {
								// 'details' is provided when fetchDetails = true
								this.setLocationName(details.name);
							}}
							getDefaultValue={() => ""}
							query={{
								// available options: https://developers.google.com/places/web-service/autocomplete
								key: "AIzaSyCsnViQCXeS1x0W-TxZ3vslGVo2l9CpCqY",
								language: "en", // language of the results
								types: "establishment" // default: 'geocode'
							}}
							nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
							GoogleReverseGeocodingQuery={{
								// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
							}}
							GooglePlacesSearchQuery={{
								// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
								rankby: "distance",
								types: "food"
							}}
							styles={{
								description: {
									height: 20
								}
							}}
							filterReverseGeocodingByTypes={["locality", "administrative_area_level_3"]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
							debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
						/>
					</View>
				</Modal>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setModalVisible(false);
					}}
				>
					<View style={styles.locationContainer}>
						<Header deviceTheme={this.props.screenProps.deviceTheme} LeftIcon="back_arrow" LeftCallback={this.setModalVisible} global={this.props.screenProps.global} />

						<GooglePlacesAutocomplete
							placeholder="Enter City, State"
							minLength={1} // minimum length of text to search
							enablePoweredByContainer={false}
							autoFocus={true}
							returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
							listViewDisplayed="auto" // true/false/undefined
							fetchDetails={true}
							renderDescription={row => row.description.replace(/, United States$/, "").replace(/, Canada$/, "")} // custom description render
							onPress={(data, details = null) => {
								// 'details' is provided when fetchDetails = true
								this.setLocationCityState(details.formatted_address);
							}}
							getDefaultValue={() => ""}
							query={{
								// available options: https://developers.google.com/places/web-service/autocomplete
								key: "AIzaSyCsnViQCXeS1x0W-TxZ3vslGVo2l9CpCqY",
								language: "en", // language of the results
								types: "(cities)",
								components: "country:us|country:ca" // default: 'geocode'
							}}
							nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
							GoogleReverseGeocodingQuery={{
								// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
							}}
							GooglePlacesSearchQuery={{
								// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
								rankby: "distance",
								types: "food"
							}}
							styles={{
								description: {
									height: 20
								}
							}}
							predefinedPlaces={[homePlace1, homePlace2, homePlace3, homePlace4, homePlace5, homePlace6]}
							filterReverseGeocodingByTypes={["locality", "administrative_area_level_3"]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
							debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
						/>
					</View>
				</Modal>
				<KeyboardAwareScrollView overScrollMode="auto" scrollEnabled={true}>
					<View style={styles.cardContainerFirst}>
						<TouchableOpacity onPress={() => this.goToRatings()}>
							<View style={styles.cardContainerRow}>
								<Image style={styles.profileIcon} source={{ uri: this.state.userImage }} />
								<View>
									<Text style={styles.hostName}>{this.state.userName}</Text>
									<Text style={styles.hostLabel}>Host</Text>
								</View>
								<View style={styles.profileInfoContainer}>
									<Image style={styles.cardImage} source={Images.arrow_right} />
								</View>
							</View>
						</TouchableOpacity>
					</View>

					<View style={styles.cardContainer}>
						<View style={styles.cardTitleContainer}>
							<InputText
								inputRef={node => (this.eventTitleText = node)}
								value={this.state.eventTitleText}
								addError={this.state.eventTitleTextError}
								placeholderTextColor="#505050"
								placeholder="Event Title"
								returnKeyType="done"
								keyboardType="default"
								theme="dark"
								themeError="darkRed"
								maxLength={30}
								onChangeText={eventTitleText => this.setState({ eventTitleText, eventTitleTextError: false })}
							/>
						</View>
						<View style={styles.cardContainerImage}>
							<TouchableOpacity onPress={this.showMenu}>{this.getSource()}</TouchableOpacity>
						</View>
						<InputTextBtn text={this.state.eventDateTime} addError={this.state.eventDateTimeError} onPress={() => this.showDateTimePicker()} />
						<InputTextBtn
							text={this.state.eventLocationName}
							addError={this.state.eventLocationNameError}
							onPress={() => this.setModalVisibleLocation(!this.state.modalVisibleLocation)}
						/>
						<InputTextBtn
							text={this.state.eventLocationCityState}
							addError={this.state.eventLocationCityStateError}
							onPress={() => this.setModalVisible(!this.state.modalVisible)}
						/>

						<DateTimePicker
							isVisible={this.state.isDateTimePickerVisible}
							onConfirm={this.handleDatePicked}
							onCancel={this.hideDateTimePicker}
							mode="datetime"
							date={this.state.initialDate}
							minimumDate={this.state.initialDate}
							minuteInterval={30}
						/>
						<View style={styles.boxEventContainer}>
							<View style={styles.guestsApprovedContainer}>
								<Text style={styles.blackText}>Guests must be approved by Host</Text>
								<CheckBox
									style={styles.guestApprovedCheckbox}
									onClick={() => this.onCheckGuestsApproved()}
									isCheckedGuestsApproved={false}
									isChecked={this.state.isCheckedGuestsApproved == 1 ? true : false}
								/>
							</View>
						</View>

						<View style={styles.boxEventContainer}>
							<View style={styles.ticketCostContainer}>
								<Text style={styles.blackText}>Ticket Cost</Text>
								<View style={styles.freeContainer}>
									<BtnDefault value="Free" active={this.state.isFree == true} theme_active="Green" onPress={() => this.setTicketFree()} />
								</View>
								<View style={styles.costContainer}>
									{this.state.isFree ? null : (
										<TextInput
											style={styles.costText}
											keyboardType="number-pad"
											returnKeyType="done"
											onChangeText={eventCost => this.setState({ eventCost })}
											placeholder="$00"
											placeholderTextColor="#505050"
											maxLength={4}
											value={this.state.eventCost}
											underlineColorAndroid="transparent"
										/>
									)}
								</View>
							</View>
						</View>

						<View>
							<InputTextMultiEvent
								inputRef={node => (this.eventinfo = node)}
								value={this.state.eventMoreInfo}
								label="Add details"
								placeholder=""
								returnKeyType="done"
								keyboardType="default"
								theme="event"
								maxLength={200}
								multiline={true}
								numberOfLines={4}
								characterCount={this.state.characterCount}
								onSubmitEditing={this.submit}
								onChangeText={eventinfo => this.onChangeMoreInfo(eventinfo)}
							/>
						</View>
						<View style={styles.boxEventContainer2}>
							<View style={styles.guestLabelContainer}>
								<Text style={styles.guestLabel}>Who can view this?</Text>
							</View>
							<View style={styles.locationRow}>
								<BtnDefault
									value="Puffers"
									addError={this.state.guestsInvitedError}
									active={this.state.guestsInvited == "Puffers"}
									theme_active="Green"
									onPress={() => this.setGuestsInvited("Puffers")}
								/>
								<BtnDefault
									value="All"
									addError={this.state.guestsInvitedError}
									active={this.state.guestsInvited == "All"}
									theme_active="Green"
									onPress={() => this.setGuestsInvited("All")}
								/>
							</View>
						</View>
						<View style={styles.boxEventContainer2}>
							<View style={styles.guestLabelContainer}>
								<Text style={styles.guestLabel}>Please select age group</Text>
							</View>
							<View style={styles.locationRow}>
								<BtnDefault
									value="18+"
									addError={this.state.ageInvitedError}
									active={this.state.ageInvited == "18+"}
									theme_active="Green"
									onPress={() => this.setAgeInvited("18+")}
								/>
								<BtnDefault
									value="21+"
									addError={this.state.ageInvitedError}
									active={this.state.ageInvited == "21+"}
									theme_active="Green"
									onPress={() => this.setAgeInvited("21+")}
								/>
							</View>
						</View>
					</View>

					{this.events_id > 0 ? (
						<View style={styles.cardContainer}>
							<View style={styles.boxEventContainer}>
								<BtnDefault value="Cancel Event" theme_active="Green" onPress={() => this.cancelEvent()} />
							</View>
						</View>
					) : null}
					<ActionSheet ref={o => (this.ActionSheet = o)} title={title} options={options} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress} />
				</KeyboardAwareScrollView>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	locationContainer: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	sectionHeader: {
		borderBottomWidth: 1,
		borderColor: "#EEEEEE",
		paddingTop: 20,
		paddingBottom: 20
	},
	cardContainerFirst: {
		backgroundColor: "#FFF",
		borderRadius: 10,
		marginLeft: 15,
		marginRight: 15,
		marginTop: 10,
		marginBottom: 10
	},
	cardContainer: {
		backgroundColor: "#FFF",
		borderRadius: 10,
		marginLeft: 15,
		marginRight: 15,
		marginTop: 5,
		marginBottom: 10
	},
	cardTitleContainer: {
		marginRight: 40
	},
	cardContainerRow: {
		backgroundColor: "#FFF",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center"
	},
	cardTitle: {
		color: "#8c909b",
		fontWeight: "bold",
		margin: 10,
		height: 40,
		width: 250
	},
	cardContainerImage: {
		position: "absolute",
		top: 5,
		right: -6
	},
	cardImage: {
		width: 20,
		height: 20,
		resizeMode: "contain"
	},
	addImageEvent: {
		width: 35,
		height: 35,
		resizeMode: "contain",
		marginRight: 5
	},
	profileIcon: {
		width: 50,
		height: 50,
		marginLeft: 5,
		marginTop: 5,
		marginBottom: 5,
		marginRight: 10,
		resizeMode: "contain",
		borderRadius: 25,
		...Platform.select({
			android: {
				borderRadius: 50
			}
		})
	},
	profileIconName: {
		marginBottom: 5
	},
	timeLocationContainer: {
		flex: 1,
		flexDirection: "column"
	},
	hostName: {
		color: "#181818",
		fontWeight: "500"
	},
	hostLabel: {
		color: "#505050"
	},
	profileInfoContainer: {
		flex: 1,
		alignItems: "flex-end",
		margin: 10
	},
	boxEventContainer: {
		marginLeft: 5,
		marginTop: 10,
		marginBottom: 10,
		marginRight: 0
	},
	boxEventContainer2: {
		marginLeft: 0,
		marginTop: 5,
		marginBottom: 5,
		marginRight: 0
	},
	eventHostMoreInfo: {
		flexDirection: "row",
		marginBottom: 5,
		marginTop: 5,
		marginLeft: 5
	},
	eventHostMoreInfoImage: {
		flex: 1,
		alignItems: "flex-end"
	},
	eventHostTime: {
		color: "#18B5C3"
	},
	eventHostLocation: {
		color: "#18B5C3",
		marginTop: 3
	},
	eventHostLocationCityState: {
		color: "#18B5C3"
	},
	eventHostMoreInfoLabel: {
		color: "#505050"
	},
	eventHostMoreInfoText: {
		color: "#8e9196",
		height: 60,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: "#d8d8d8",
		paddingLeft: 5
	},
	charactersLeft: {
		color: "#d8d8d8"
	},
	guestLabelContainer: {
		marginBottom: 10
	},
	guestLabel: {
		textAlign: "center",
		fontSize: 16,
		color: "#18B5C3",
		paddingBottom: 5
	},
	guestsApprovedContainer: {
		flexDirection: "row",
		alignItems: "center"
	},
	colorGray: {
		color: "#8e9196"
	},
	ticketCostContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center"
	},
	freeContainer: {
		alignItems: "flex-end",
		flex: 1
	},
	freeText: {
		color: "#00cbca",
		marginRight: 30
	},
	costContainer: {
		borderRadius: 10,
		borderColor: "#18B5C3"
	},
	costText: {
		color: "#181818",
		paddingLeft: 10,
		height: 35,
		width: 60,
		borderWidth: 1,
		borderColor: "#18B5C3",
		borderRadius: 5,
		fontSize: 12,
		marginLeft: 20
	},
	guestApprovedCheckbox: {
		flex: 1,
		alignItems: "flex-end"
	},
	locationRow: {
		justifyContent: "space-between",
		flexDirection: "row",
		marginBottom: 10
	},
	blackText: {
		fontSize: 14,
		fontFamily: "Helvetica",
		color: "#181818"
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
	}
};

export { EventDetail };
