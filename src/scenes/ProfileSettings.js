import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, AsyncStorage, ScrollView, Switch } from "react-native";
import Images from "../config/images";
import Header from "../components/Header";

class ProfileSettings extends Component {
	constructor(props) {
		super(props);

		this.logout = this.props.screenProps.logout.bind(this);
		this.gotoEditProfile = this.gotoEditProfile.bind(this);
		this.gotoPreferences = this.gotoPreferences.bind(this);
		this.gotoFilter = this.gotoFilter.bind(this);
		this.gotoChangePassword = this.gotoChangePassword.bind(this);
		this.gotoMisc = this.gotoMisc.bind(this);
		this.goBack = this.goBack.bind(this);

		this.state = {
			trueSwitchIsOn: false
		};
	}

	gotoEditProfile() {
		this.props.navigation.navigate("ProfileEdit");
	}

	gotoPreferences() {
		this.props.navigation.navigate("Preferences");
	}

	gotoChangePassword() {
		this.props.navigation.navigate("ChangePassword");
	}

	gotoFilter() {
		this.props.navigation.navigate("Filter");
	}

	gotoMisc() {
		this.props.navigation.navigate("Misc");
	}

	goBack() {
		this.props.navigation.goBack();
	}

	render() {
		return (
			<View style={styles.container}>
				<Header deviceTheme={this.props.screenProps.deviceTheme} LeftIcon="back_arrow" LeftCallback={this.goBack} title="Settings" global={this.props.screenProps.global} />
				<ScrollView style={styles.scrollview}>
					<TouchableOpacity onPress={this.gotoEditProfile} style={styles.section}>
						<View style={styles.row}>
							<Text>Edit My Profile</Text>
							<View style={styles.rowImage}>
								<Image style={styles.imgStyle} source={Images.pencil} />
							</View>
						</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.gotoPreferences} style={styles.section}>
						<View style={styles.row}>
							<Text>My Interests</Text>
							<View style={styles.rowImage}>
								<Image style={styles.imgStyle} source={Images.pencil} />
							</View>
						</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.gotoFilter} style={styles.section}>
						<View style={styles.row}>
							<Text>I Am Looking For</Text>
							<View style={styles.rowImage}>
								<Image style={styles.imgStyle} source={Images.pencil} />
							</View>
						</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.gotoChangePassword} style={styles.section}>
						<View style={styles.row}>
							<Text>Change Password</Text>
							<View style={styles.rowImage}>
								<Image style={styles.imgStyle} source={Images.pencil} />
							</View>
						</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.gotoMisc} style={styles.section}>
						<View style={styles.row}>
							<Text>Miscellaneous</Text>
							<View style={styles.rowImage}>
								<Image style={styles.imgStyle} source={Images.pencil} />
							</View>
						</View>
					</TouchableOpacity>
				</ScrollView>
				<View style={styles.sectionEnd}>
					<TouchableOpacity onPress={this.logout}>
						<View style={styles.row}>
							<Text style={styles.logoutBtn}>Logout</Text>
						</View>
					</TouchableOpacity>
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
	logoutBtn: {
		color: "#57BBC7",
		marginBottom: 5
	},
	scrollview: {
		marginBottom: 80
	},
	SupportBtn: {
		color: "#57BBC7",
		marginBottom: 5
	},
	sectionEnd: {
		position: "absolute",
		bottom: 15,
		left: 0,
		right: 0,
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		borderTopColor: "#EEEEEE",
		borderTopWidth: 1,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 10,
		paddingTop: 15,
		paddingBottom: 10,
		paddingLeft: 15,
		paddingRight: 15
	},
	sectionEnd2: {
		position: "absolute",
		bottom: 55,
		left: 0,
		right: 0,
		marginLeft: 10,
		marginRight: 10,
		marginTop: 10,
		marginBottom: 15,
		paddingTop: 15,
		paddingBottom: 10,
		paddingLeft: 15,
		paddingRight: 15,
		alignItems: "flex-end"
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
	sectionLast: {
		marginLeft: 20,
		marginRight: 20,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 2
	},
	row: {
		flexDirection: "row"
	},
	boldHeader: {
		fontSize: 16,
		fontFamily: "Helvetica",
		fontWeight: "bold",
		textAlign: "center",
		color: "#7A7D83"
	},
	aboutMeText: {
		borderWidth: 1,
		borderColor: "#EEEEEE",
		marginTop: 15,
		padding: 10,
		height: 150
	},
	btnSave: {
		height: 60,
		backgroundColor: "#00C4CF",
		justifyContent: "center",
		alignItems: "center"
	},
	btnSaveText: {
		color: "#FFFFFF",
		fontSize: 30,
		fontFamily: "Helvetica",
		fontWeight: "bold",
		textAlign: "center"
	},
	bottomContainer: {
		position: "absolute",
		height: 0,
		bottom: 100,
		left: 50,
		right: 50,
		top: null
	},
	textLeft: {
		marginTop: 5,
		textAlign: "right",
		color: "#CDCDCD",
		fontSize: 13
	},
	rowImage: {
		alignItems: "flex-end",
		flex: 1
	},
	imgStyle: {
		height: 15,
		width: 15,
		resizeMode: "contain",
		marginRight: 10
	}
};

export { ProfileSettings };
