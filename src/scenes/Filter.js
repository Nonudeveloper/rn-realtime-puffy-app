import React, { Component } from "react";
import { Alert, Text, View, AsyncStorage, ScrollView, Dimensions, Platform } from "react-native";
import { NavigationActions } from "react-navigation";
import Header from "../components/Header";
import BtnIcon from "../components/BtnIcon";
import BtnGrey from "../components/BtnGrey";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

class Filter extends Component {
	constructor(props) {
		super(props);

		this.deviceTheme = this.props.screenProps.deviceTheme;
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.submitData = this.submitData.bind(this);
		this.setGender = this.setGender.bind(this);
		this.setMiles = this.setMiles.bind(this);
		this.setMilesFinish = this.setMilesFinish.bind(this);
		this.filterListener = this.filterListener.bind(this);
		this.ageSliderChange = this.ageSliderChange.bind(this);
		this.setAgeFinish = this.setAgeFinish.bind(this);
		this.goBack = this.goBack.bind(this);
		this.width = Dimensions.get("window").width;
		this.navigation = this.props.navigation;
		this.logout = this.props.screenProps.logout.bind(this);
		this.cancel = this.cancel.bind(this);

		if (this.props.screenProps.hide_back == 1) {
			this.home = 0;
		} else if (this.props.navigation.state.params == null) {
			this.home = 0;
		} else {
			this.home = this.props.navigation.state.params.home;
		}

		this.state = {
			gender: "",
			miles: 125,
			milesSliding: 0,
			minAge: 18,
			maxAge: 50,
			maxAgeText: "50+",
			allowVerticalScroll: true
		};
	}

	filterListener(data) {
		if (data["result"] == 1 && data["result_action"] == "update_user_filters_result") {
			if (this.props.screenProps.hide_back == 1) {
				return;
			}
			Alert.alert("Updated", "Filters successfully updated");
		} else if (data["result"] == 0 && data["result_action"] == "update_user_filters_result") {
			Alert.alert("Error", "Update failed");
		} else if (data["result"] == 1 && data["result_action"] == "list_user_filter") {
			var fdata = data["result_data"][0];

			if (fdata["user_filter_gender"] == null || fdata["user_filter_gender"] == "" || fdata["user_filter_gender"] == "null") {
				fdata["user_filter_gender"] = "";
			}

			if (fdata["user_filter_age_max"] == "50") {
				fdata["user_filter_age_max"] = "50+";
			}

			this.setState({
				gender: fdata["user_filter_gender"],
				miles: fdata["user_filter_miles"],
				minAge: fdata["user_filter_age_min"],
				maxAge: fdata["user_filter_age_max"],
				maxAgeText: fdata["user_filter_age_max"]
			});

			let localData = JSON.stringify(fdata);

			if (localData) {
				AsyncStorage.setItem("Filters", localData);
			}
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.filterListener);
	}

	componentDidMount() {
		let dataString = {
			user_action: "select_user_filter",
			user_data: {}
		};

		this.handleEmit(dataString);
		this.puffyChannel.on("data_channel", this.filterListener);

		AsyncStorage.getItem("Filters", (err, result) => {
			if (!err && result != null) {
				let fdata = JSON.parse(result);
				this.setState({
					gender: fdata["user_filter_gender"],
					miles: fdata["user_filter_miles"],
					minAge: fdata["user_filter_age_min"],
					maxAge: fdata["user_filter_age_max"],
					maxAgeText: fdata["user_filter_age_max"]
				});
			}
		});
	}

	setGender(value) {
		this.setState({ gender: value });
	}

	setMiles(values) {
		this.setState({ miles: values[0], milesSliding: 1, allowVerticalScroll: false });
	}
	setMilesFinish() {
		let miles = this.state.miles;

		if (miles > 112) {
			miles = 125;
		} else if (miles > 87) {
			miles = 100;
		} else if (miles > 62) {
			miles = 75;
		} else if (miles > 37) {
			miles = 50;
		} else {
			miles = 25;
		}

		this.setState({ miles: miles, milesSliding: 0, allowVerticalScroll: true });
	}

	ageSliderChange(values) {
		let maxAge = values[1];

		if (maxAge == "50") {
			maxAge = "50+";
		}

		this.setState({ minAge: values[0], maxAge: values[1], maxAgeText: maxAge, allowVerticalScroll: false });
	}

	setAgeFinish() {
		this.setState({ allowVerticalScroll: true });
	}

	submitData() {
		if (this.state.gender == "") {
			Alert.alert("Missing", "Must select I am looking for");
			return false;
		}

		let dataString = {
			user_action: "update_filters",
			user_data: {
				gender: this.state.gender,
				miles: this.state.miles,
				minAge: this.state.minAge,
				maxAge: this.state.maxAge
			}
		};

		this.handleEmit(dataString);

		if (this.props.screenProps.hide_back == 1) {
			return;
		}

		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: "index" })]
		});
		this.props.navigation.dispatch(resetAction);
	}

	goBack() {
		this.props.navigation.goBack();
	}

	cancel() {
		Alert.alert("Confirmation", "Are you sure you want to cancel?", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.logout() }]);
	}

	renderSmall() {
		return (
			<View style={styles.container}>
				<Header
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon={this.props.screenProps.hide_back == 1 ? null : "back_arrow"}
					LeftText={this.props.screenProps.hide_back == 1 ? "cancel" : null}
					LeftCallback={this.props.screenProps.hide_back == 1 ? this.cancel : this.goBack}
					RightIcon="checkmark_button"
					RightCallback={this.submitData}
					title="Filters"
					global={this.props.screenProps.global}
				/>

				<ScrollView scrollEnabled={this.state.allowVerticalScroll}>
					<View style={styles.contentSmall}>
						<Text style={styles.headerTextGreen}>I am looking for:</Text>
						<View style={styles.genderRow}>
							<BtnIcon
								label="Women"
								icon="women_grey"
								icon_active="women_pink"
								theme_active="Pink"
								active={this.state.gender === "female"}
								onPress={() => this.setGender("female")}
							/>
							<BtnIcon
								label="Man"
								icon="men_grey"
								icon_active="men_green"
								theme_active="Green"
								active={this.state.gender === "male"}
								onPress={() => this.setGender("male")}
							/>
						</View>
						<View style={styles.allRow}>
							<BtnGrey value="Both" active={this.state.gender === "show all"} theme_active="Green" onPress={() => this.setGender("show all")} />
						</View>
						<Text style={styles.headerLocation}>Location</Text>

						<View style={styles.locationWrapper}>
							<View style={styles.locationRow}>
								<Text style={styles.locationLabel}>All</Text>
								<Text style={styles.locationLabel}>100</Text>
								<Text style={styles.locationLabel}>75</Text>
								<Text style={styles.locationLabel}>50</Text>
								<Text style={styles.locationLabel}>25</Text>
							</View>
							<View style={styles.locationOptionRow}>
								<View style={styles.locationOptionPink} />
								{this.state.miles >= 100 ? <View style={styles.locationOptionGreen} /> : <View style={styles.locationOptionPink} />}
								{this.state.miles >= 75 ? <View style={styles.locationOptionGreen} /> : <View style={styles.locationOptionPink} />}
								{this.state.miles >= 50 ? <View style={styles.locationOptionGreen} /> : <View style={styles.locationOptionPink} />}
								{this.state.miles >= 25 ? <View style={styles.locationOptionGreen} /> : <View style={styles.locationOptionPink} />}
							</View>
							<MultiSlider
								values={[this.state.miles]}
								onValuesChange={this.setMiles}
								onValuesChangeFinish={this.setMilesFinish}
								sliderLength={260}
								customMarker={() => (
									<View style={styles.markerStyle}>
										<Text style={styles.markerText}>Mi.</Text>
									</View>
								)}
								min={125}
								max={25}
								step={1}
								containerStyle={{
									paddingLeft: 17
								}}
								trackStyle={{
									height: 8,
									borderRadius: 10
								}}
								selectedStyle={{
									backgroundColor: "#D453A2"
								}}
								unselectedStyle={{
									backgroundColor: "#18B5C3"
								}}
								snapped
							/>
						</View>

						<Text style={styles.headerAge}>Age</Text>
						<View>
							<View style={styles.ageRow}>
								<Text style={styles.minAge}>{this.state.minAge}</Text>
								<Text style={styles.maxAge}>{this.state.maxAgeText}</Text>
							</View>
							<MultiSlider
								values={[this.state.minAge, this.state.maxAge]}
								onValuesChange={this.ageSliderChange}
								onValuesChangeFinish={this.setAgeFinish}
								sliderLength={260}
								customMarker={() => (
									<View style={styles.markerStyle}>
										<Text style={styles.markerText}>Yr.</Text>
									</View>
								)}
								min={18}
								max={50}
								step={1}
								containerStyle={{
									paddingLeft: 17
								}}
								trackStyle={{
									height: 8,
									borderRadius: 10
								}}
								selectedStyle={{
									backgroundColor: "#18B5C3"
								}}
								unselectedStyle={{
									backgroundColor: "#D453A2"
								}}
								snapped
							/>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}

	render() {
		if (this.deviceTheme == "IphoneSmall") {
			return this.renderSmall();
		}
		return (
			<View style={styles.container}>
				<Header
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon={this.props.screenProps.hide_back == 1 ? null : "back_arrow"}
					LeftText={this.props.screenProps.hide_back == 1 ? "cancel" : null}
					LeftCallback={this.props.screenProps.hide_back == 1 ? this.cancel : this.goBack}
					RightIcon="checkmark_button"
					RightCallback={this.submitData}
					title="Filters"
					global={this.props.screenProps.global}
				/>
				<ScrollView scrollEnabled={this.state.allowVerticalScroll}>
					<View style={this.width > 400 ? styles.contentBig : styles.content}>
						<Text style={styles.headerTextGreen}>I am looking for:</Text>
						<View style={styles.genderRow}>
							<BtnIcon
								label="Women"
								icon="women_grey"
								icon_active="women_pink"
								theme_active="Pink"
								active={this.state.gender === "female"}
								onPress={() => this.setGender("female")}
							/>
							<BtnIcon
								label="Man"
								icon="men_grey"
								icon_active="men_green"
								theme_active="Green"
								active={this.state.gender === "male"}
								onPress={() => this.setGender("male")}
							/>
						</View>
						<View style={styles.allRow}>
							<BtnGrey value="Both" active={this.state.gender === "show all"} theme_active="Green" onPress={() => this.setGender("show all")} />
						</View>
						<Text style={styles.headerLocation}>Location</Text>

						<View style={styles.locationWrapper}>
							<View style={styles.locationRow}>
								<Text style={styles.locationLabel}>All</Text>
								<Text style={styles.locationLabel}>100</Text>
								<Text style={styles.locationLabel}>75</Text>
								<Text style={styles.locationLabel}>50</Text>
								<Text style={styles.locationLabel}>25</Text>
							</View>
							<View style={styles.locationOptionRow}>
								<View style={styles.locationOptionPink} />
								{this.state.miles >= 100 ? <View style={styles.locationOptionGreen} /> : <View style={styles.locationOptionPink} />}
								{this.state.miles >= 75 ? <View style={styles.locationOptionGreen} /> : <View style={styles.locationOptionPink} />}
								{this.state.miles >= 50 ? <View style={styles.locationOptionGreen} /> : <View style={styles.locationOptionPink} />}
								{this.state.miles >= 25 ? <View style={styles.locationOptionGreen} /> : <View style={styles.locationOptionPink} />}
							</View>
							<MultiSlider
								values={[this.state.miles]}
								onValuesChange={this.setMiles}
								onValuesChangeFinish={this.setMilesFinish}
								customMarker={() => (
									<View style={styles.markerStyle}>
										<Text style={styles.markerText}>Mi.</Text>
									</View>
								)}
								min={125}
								max={25}
								step={1}
								sliderLength={260}
								containerStyle={{
									paddingLeft: 17
								}}
								trackStyle={{
									height: 8,
									borderRadius: 10
								}}
								selectedStyle={{
									backgroundColor: "#D453A2"
								}}
								unselectedStyle={{
									backgroundColor: "#18B5C3"
								}}
								snapped
							/>
						</View>

						<Text style={styles.headerAge}>Age</Text>
						<View>
							<View style={styles.ageRow}>
								<Text style={styles.minAge}>{this.state.minAge}</Text>
								<Text style={styles.maxAge}>{this.state.maxAgeText}</Text>
							</View>
							<MultiSlider
								values={[this.state.minAge, this.state.maxAge]}
								onValuesChange={this.ageSliderChange}
								customMarker={() => (
									<View style={styles.markerStyle}>
										<Text style={styles.markerText}>Yr.</Text>
									</View>
								)}
								min={18}
								max={50}
								sliderLength={260}
								step={1}
								containerStyle={{
									paddingLeft: 17
								}}
								trackStyle={{
									height: 8,
									borderRadius: 10
								}}
								selectedStyle={{
									backgroundColor: "#18B5C3"
								}}
								unselectedStyle={{
									backgroundColor: "#D453A2"
								}}
								snapped
							/>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FFF"
	},
	contentSmall: {
		marginLeft: 15,
		marginRight: 15
	},
	contentBig: {
		marginLeft: 60,
		marginRight: 60
	},
	content: {
		marginLeft: 40,
		marginRight: 40
	},
	headerText: {
		textAlign: "center",
		fontSize: 16,
		color: "#7A7D83",
		marginLeft: 15,
		marginRight: 15
	},
	headerTextGreen: {
		textAlign: "center",
		fontSize: 22,
		color: "#18B5C3",
		marginLeft: 15,
		marginRight: 15,
		marginTop: 20,
		marginBottom: 20
	},
	headerLocation: {
		textAlign: "center",
		fontSize: 22,
		color: "#18B5C3",
		marginLeft: 15,
		marginRight: 15,
		marginTop: 15,
		marginBottom: 10
	},
	headerAge: {
		textAlign: "center",
		fontSize: 22,
		color: "#18B5C3",
		marginLeft: 15,
		marginRight: 15
	},
	genderRow: {
		justifyContent: "space-between",
		flexDirection: "row",
		marginBottom: 15,
		marginLeft: 6,
		marginRight: 6
	},
	allRow: {
		justifyContent: "space-between",
		flexDirection: "row",
		marginBottom: 5
	},
	locationWrapper: {},
	locationRow: {
		flexDirection: "row",
		marginBottom: 15,
		marginLeft: 10,
		marginRight: 15,
		justifyContent: "space-between"
	},
	locationOptionRow: {
		position: "absolute",
		top: 27,
		left: 6,
		right: 2,
		flexDirection: "row",
		marginLeft: 5,
		marginRight: 10,
		justifyContent: "space-between"
	},
	locationOptionGreen: {
		height: 17,
		width: 17,
		backgroundColor: "#18B5C3",
		borderRadius: 17
	},
	locationOptionPink: {
		height: 17,
		width: 17,
		backgroundColor: "#D453A2",
		borderRadius: 17
	},
	locationLabel: {
		fontSize: 14,
		color: "#7A7D83"
	},
	ageRow: {
		flexDirection: "row",
		paddingBottom: 15,
		marginLeft: 10,
		marginRight: 15,
		justifyContent: "space-between"
	},
	minAge: {
		fontSize: 14,
		color: "#7A7D83"
	},
	maxAge: {
		fontSize: 14,
		color: "#7A7D83"
	},
	markerStyle: {
		zIndex: 9999,
		height: 32,
		width: 32,
		borderRadius: 16,
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		borderColor: "#DDDDDD",
		backgroundColor: "#FFFFFF",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		marginTop: 10,
		padding: 5
	},
	markerText: {
		fontSize: 12,
		color: "#7A7D83"
	}
};

export { Filter };
