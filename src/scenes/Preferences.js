import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, AsyncStorage, Platform } from "react-native";
import { BtnSaveTxt } from "../components";
import Header from "../components/Header";
import Pref from "../components/PrefLarge";
import Images from "../config/images";
import { NavigationActions } from "react-navigation";

class Preferences extends Component {
	constructor(props) {
		super(props);
		this.updatePreference = this.updatePreference.bind(this);
		this.bug = this.props.screenProps.bug.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.goBack = this.goBack.bind(this);
		this.setModal = this.setModal.bind(this);
		this.setInterest = this.setInterest.bind(this);
		this.removeInterest = this.removeInterest.bind(this);
		this.goBack = this.goBack.bind(this);
		this.logout = this.props.screenProps.logout.bind(this);
		this.cancel = this.cancel.bind(this);

		this.state = {
			user_interest_name1: null,
			user_interest_name2: null,
			user_interest_name3: null,
			user_interest_name4: null,
			user_interest_name5: null,
			smoke: 0,
			vape: 0,
			edibles: 0,
			chill: 0,
			outdoor: 0,
			flicks: 0,
			videogames: 0,
			sports: 0,
			clubs: 0,
			concert: 0,
			food: 0,
			games: 0,
			friend: 0,
			liquor: 0,
			love: 0,
			hotbox: 0,
			karaoke: 0,
			music: 0
		};
	}

	componentWillMount() {
		//if userid exists then lets validate it
		AsyncStorage.getItem("UserProfile", (err, result) => {
			//this.bug(result);

			if (result) {
				this.bug("found them profile");
				//convert to json array and applie to state
				let user_profile = JSON.parse(result);
				this.bug(user_profile);

				this.setModal(user_profile["user_interest_name1"]);
				this.setModal(user_profile["user_interest_name2"]);
				this.setModal(user_profile["user_interest_name3"]);
				this.setModal(user_profile["user_interest_name4"]);
				this.setModal(user_profile["user_interest_name5"]);
			} else {
				this.bug("uhoh");
			}
		});
	}

	setModal(option) {
		let stateFlag = this.state[option];

		if (stateFlag === 1) {
			this.setState({ [option]: 0 });
			this.removeInterest(option);
		} else {
			let interestResult = this.setInterest(option);

			if (interestResult == 1) {
				this.setState({ [option]: 1 });
			} else {
				console.log("5 picked", this.state);
			}
		}
	}

	removeInterest(option) {
		if (this.state.user_interest_name1 == option) {
			this.setState({ user_interest_name1: null });
		}
		if (this.state.user_interest_name2 == option) {
			this.setState({ user_interest_name2: null });
		}
		if (this.state.user_interest_name3 == option) {
			this.setState({ user_interest_name3: null });
		}
		if (this.state.user_interest_name4 == option) {
			this.setState({ user_interest_name4: null });
		}
		if (this.state.user_interest_name5 == option) {
			this.setState({ user_interest_name5: null });
		}
	}

	setInterest(option) {
		let result = 0;

		if (this.state.user_interest_name1 == null) {
			this.setState({ user_interest_name1: option });
			result = 1;
		} else if (this.state.user_interest_name2 == null) {
			this.setState({ user_interest_name2: option });
			result = 1;
		} else if (this.state.user_interest_name3 == null) {
			this.setState({ user_interest_name3: option });
			result = 1;
		} else if (this.state.user_interest_name4 == null) {
			this.setState({ user_interest_name4: option });
			result = 1;
		} else if (this.state.user_interest_name5 == null) {
			this.setState({ user_interest_name5: option });
			result = 1;
		}

		return result;
	}

	updatePreference() {
		if (
			this.state.user_interest_name1 == null ||
			this.state.user_interest_name2 == null ||
			this.state.user_interest_name3 == null ||
			this.state.user_interest_name4 == null ||
			this.state.user_interest_name5 == null
		) {
			Alert.alert("Incomplete", "Must select 5");
			return false;
		}

		//upload preference to db
		let dataString = {
			user_action: "update_user_interest",
			user_data: {
				user_interest_name1: this.state.user_interest_name1,
				user_interest_name2: this.state.user_interest_name2,
				user_interest_name3: this.state.user_interest_name3,
				user_interest_name4: this.state.user_interest_name4,
				user_interest_name5: this.state.user_interest_name5
			}
		};

		//this.bug(dataString);

		this.handleEmit(dataString);

		if (this.props.screenProps.hide_back == 1) {
			return;
		}

		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: "index" })]
		});
		this.props.navigation.dispatch(resetAction);
		Alert.alert("Updated", "Your interest has been updated");
	}

	goBack() {
		this.props.navigation.goBack();
	}

	cancel() {
		Alert.alert("Confirmation", "Are you sure you want to cancel?", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.logout() }]);
	}

	render() {
		return (
			<View style={styles.container}>
				<Header
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon={this.props.screenProps.hide_back == 1 ? null : "back_arrow"}
					LeftText={this.props.screenProps.hide_back == 1 ? "cancel" : null}
					LeftCallback={this.props.screenProps.hide_back == 1 ? this.cancel : this.goBack}
					RightIcon="checkmark_button"
					RightCallback={this.updatePreference}
					title="My Interests"
					global={this.props.screenProps.global}
				/>

				<Text style={styles.sub_sub_title}>Select 5</Text>
				<ScrollView style={styles.content}>
					<View>
						<View style={styles.section3}>
							<TouchableOpacity onPress={() => this.setModal("smoke")}>
								<Pref prefstate={this.state.smoke} name={"smoke"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("vape")}>
								<Pref prefstate={this.state.vape} name={"vape"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("edibles")}>
								<Pref prefstate={this.state.edibles} name={"edibles"} />
							</TouchableOpacity>
						</View>

						<View style={styles.section3}>
							<TouchableOpacity onPress={() => this.setModal("chill")}>
								<Pref prefstate={this.state.chill} name={"chill"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("outdoor")}>
								<Pref prefstate={this.state.outdoor} name={"outdoor"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("flicks")}>
								<Pref prefstate={this.state.flicks} name={"flicks"} />
							</TouchableOpacity>
						</View>

						<View style={styles.section3}>
							<TouchableOpacity onPress={() => this.setModal("videogames")}>
								<Pref prefstate={this.state.videogames} name={"videogames"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("sports")}>
								<Pref prefstate={this.state.sports} name={"sports"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("clubs")}>
								<Pref prefstate={this.state.clubs} name={"clubs"} />
							</TouchableOpacity>
						</View>

						<View style={styles.section3}>
							<TouchableOpacity onPress={() => this.setModal("concert")}>
								<Pref prefstate={this.state.concert} name={"concert"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("food")}>
								<Pref prefstate={this.state.food} name={"food"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("games")}>
								<Pref prefstate={this.state.games} name={"games"} />
							</TouchableOpacity>
						</View>

						<View style={styles.section3}>
							<TouchableOpacity onPress={() => this.setModal("friend")}>
								<Pref prefstate={this.state.friend} name={"friend"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("liquor")}>
								<Pref prefstate={this.state.liquor} name={"liquor"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("love")}>
								<Pref prefstate={this.state.love} name={"love"} />
							</TouchableOpacity>
						</View>

						<View style={styles.section3Last}>
							<TouchableOpacity onPress={() => this.setModal("hotbox")}>
								<Pref prefstate={this.state.hotbox} name={"hotbox"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("karaoke")}>
								<Pref prefstate={this.state.karaoke} name={"karaoke"} />
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.setModal("music")}>
								<Pref prefstate={this.state.music} name={"music"} />
							</TouchableOpacity>
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
		backgroundColor: "#FEFEFE"
	},
	section_border: {
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		marginTop: 12,
		marginBottom: 5
	},
	content: {
		paddingTop: 15,
		paddingLeft: 50,
		paddingRight: 50
	},
	section3: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: 12
	},
	section3Last: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: 35
	},
	title: {
		textAlign: "center",
		marginTop: 15,
		fontSize: 24,
		fontWeight: "bold"
	},
	sub_title: {
		textAlign: "center",
		marginTop: 4,
		marginBottom: 7,
		paddingBottom: 5,
		fontSize: 17,
		fontWeight: "bold"
	},
	sub_sub_title: {
		textAlign: "center",
		fontFamily: "Helvetica",
		fontSize: 16,
		color: "#18B5C3",
		marginTop: 10
	},
	downContainer: {
		marginTop: 50
	},
	btnDown: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	imageDown: {
		width: 25,
		height: 25,
		justifyContent: "center",
		alignSelf: "center",
		resizeMode: "contain"
	},
	upContainer: {
		marginTop: 25,
		marginBottom: 10
	},
	btnUp: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	imageUp: {
		width: 25,
		height: 25,
		justifyContent: "center",
		alignSelf: "center",
		resizeMode: "contain"
	},
	section: {
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		marginLeft: 10,
		marginRight: 10,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 15,
		paddingRight: 15
	},
	boldHeader: {
		fontSize: 16,
		fontFamily: "Helvetica",
		fontWeight: "bold",
		textAlign: "center"
	}
};

export { Preferences };
