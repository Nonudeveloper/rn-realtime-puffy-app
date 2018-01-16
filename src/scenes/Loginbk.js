import React, { Component } from "react";
import { View, Image, Text, TouchableOpacity, Alert, Dimensions, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FBLoginManager } from "react-native-facebook-login";
import LinearGradient from "react-native-linear-gradient";
import InputTextLogin from "../components/InputTextLogin";
import BtnWhite from "../components/BtnWhite";
import BtnWhiteSmall from "../components/BtnWhiteSmall";
import BtnWhiteIcon from "../components/BtnWhiteIcon";
import BtnOutlineLogin from "../components/BtnOutlineLogin";
import ajaxPost from "../lib/ajaxPost";
import ajaxPostDev from "../lib/ajaxPostDev";
import Images from "../config/images";
import ImageSlider from "react-native-image-slider";
import Swiper from "react-native-swiper";

class Login extends Component {
	constructor(props) {
		super(props);

		this.deviceTheme = this.props.screenProps.deviceTheme;
		this.checkLogin = this.checkLogin.bind(this);
		this.checkLoginAdmin = this.checkLoginAdmin.bind(this);
		this.fbLogin = this.fbLogin.bind(this);
		this.showRegister = this.showRegister.bind(this);
		this.showForgot = this.showForgot.bind(this);
		this.focusNextField = this.focusNextField.bind(this);
		this.setDevCount = this.setDevCount.bind(this);
		this.loginUser = this.props.screenProps.loginUser.bind(this);
		this.loginUserAdmin = this.props.screenProps.loginUserAdmin.bind(this);
		this.width = Dimensions.get("window").width;

		let email = this.props.screenProps.user_email;

		this.state = {
			email: email,
			password: "",
			devCount: 0
		};
	}

	fbLogin() {
		let $this = this;

		FBLoginManager.loginWithPermissions(["public_profile", "email"], function(error, data) {
			if (!error) {
				let fb_id = data.credentials.userId;
				let fb_token = data.credentials.token;

				let dataString = { fb_id: fb_id, fb_token: fb_token };

				ajaxPost(dataString, "fbLogin", function(result) {
					if (result.result == 1) {
						console.log(result);
						result["user_email"] = "";
						$this.loginUser(result);
					} else if (result == -1) {
						Alert.alert("Incorrect", "You have no internet connection");
					} else {
						Alert.alert("Registered Email", "Email has an existing account");
					}
				});
			} else {
				Alert.alert("Incorrect", "Facebook account not found");
			}
		});
	}

	setDevCount() {
		let devCount = this.state.devCount + 1;

		if (devCount > 5) {
			this.setState({ devCount: 0 });
		} else {
			this.setState({ devCount: devCount });
		}
	}

	checkLogin() {
		if (this.state.email === "" || this.state.password === "") {
			Alert.alert("Error", "Please enter registered email and password");
			return false;
		}

		let $this = this;
		let dataString = { user_email: this.state.email, user_password1: this.state.password };

		ajaxPost(dataString, "checkLogin", function(result) {
			//success
			if (result.result == 1) {
				console.log(result);
				$this.loginUser(result);
			} else if (result == -1) {
				Alert.alert("Incorrect", "You have no internet connection");
			} else {
				//fail
				Alert.alert("Incorrect", "You entered the wrong Username and Password. Please try again.", [
					{ text: "Try again", onPress: () => console.log("try agan!") },
					{ text: "Forgot?", onPress: () => $this.showForgot() }
				]);
			}
		});
	}

	checkLoginAdmin() {
		if (this.state.email === "" || this.state.password === "") {
			Alert.alert("Error", "Please enter registered email and password");
			return false;
		}

		let $this = this;
		let dataString = { user_email: this.state.email, user_password1: this.state.password };

		ajaxPostDev(dataString, "checkLoginAdmin", function(result) {
			//success
			if (result.result == 1) {
				console.log(result);
				$this.loginUserAdmin(result);
			} else if (result == -1) {
				Alert.alert("Incorrect", "You have no internet connection");
			} else {
				//fail
				Alert.alert("Incorrect", "You entered the wrong Username and Password or You are not an admin. Please try again.", [
					{ text: "Try again", onPress: () => console.log("try agan!") },
					{ text: "Forgot?", onPress: () => $this.showForgot() }
				]);
			}
		});
	}

	showRegister() {
		this.props.navigation.navigate("Register");
	}

	showForgot() {
		this.props.navigation.navigate("ForgotPassword");
	}

	focusNextField(id) {
		this[id].focus();
	}

	render() {
		return (
			<LinearGradient
				start={{ x: 0.0, y: 0.25 }}
				end={{ x: 0.0, y: 1.0 }}
				locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]}
				colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8", "#9467A5"]}
				style={styles.container}
			>
				<KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
					<View style={styles.header}>
						<Image style={styles.logo} source={Images.puffy_logo} />
					</View>
					<Swiper
						style={styles.wrapper}
						showsButtons={false}
						paginationStyle={{
							bottom: 10,
							left: 0,
							right: 0,
							alignItems: "center"
						}}
						height={Dimensions.get("window").height * 0.4}
					>
						<View style={styles.slide}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideText}>Meet New and Interesting</Text>
								<Text style={styles.slideText}>Puffers Nearby</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide1} />
						</View>
						<View style={styles.slide}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideText}>Pass by Swiping Left, Puff by</Text>
								<Text style={styles.slideText}>Swiping Right and Connect</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide1} />
							<Image style={styles.slideImgOver} source={Images.slide2} />
						</View>
						<View style={styles.slide}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideText}>Once They Puff Back then You</Text>
								<Text style={styles.slideText}>Become Puffers</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide4} />
						</View>
						<View style={styles.slide}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideText}>Be Able to Chat and Share</Text>
								<Text style={styles.slideText}>Photos Freely with Puffers</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide3} />
						</View>
					</Swiper>
					<View style={styles.content}>
						<InputTextLogin
							inputRef={node => (this.email = node)}
							value={this.state.email}
							placeholderTextColor="#FFF"
							placeholder="Email"
							returnKeyType="done"
							keyboardType="email-address"
							theme="light"
							maxLength={50}
							onSubmitEditing={() => this.focusNextField("password")}
							onChangeText={email => this.setState({ email })}
						/>
						<InputTextLogin
							inputRef={node => (this.password = node)}
							value={this.state.password}
							placeholderTextColor="#FFF"
							placeholder="Password"
							returnKeyType="done"
							keyboardType="default"
							secureTextEntry={true}
							theme="light"
							onSubmitEditing={this.checkLogin}
							onChangeText={password => this.setState({ password })}
						/>
						{this.state.devCount > 4 ? <BtnWhiteSmall value="Login DEV" onPress={this.checkLoginAdmin} /> : <BtnWhiteSmall value="Login" onPress={this.checkLogin} />}
						<TouchableOpacity style={styles.btnForgot} onPress={this.showForgot}>
							<Text style={styles.btnForgotText}>Forgot password?</Text>
						</TouchableOpacity>
						<View style={styles.facebook}>
							<BtnWhiteIcon icon="fb_icon" value="Login with Facebook" onPress={this.fbLogin} />
						</View>
					</View>
				</KeyboardAwareScrollView>
				<View style={styles.footer}>
					<Text style={styles.textNotPuffer}>Not a puffer yet?</Text>
					<BtnOutlineLogin value="Sign up for free!" onPress={this.showRegister} />
				</View>
			</LinearGradient>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "transparent"
	},
	header: {
		marginTop: 25,
		marginBottom: 10,
		alignItems: "center",
		backgroundColor: "transparent"
	},
	logo: {
		width: 65,
		height: 65,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	wrapper: {},
	slideText: {
		color: "#FFFFFF",
		fontFamily: "Helvetica",
		fontSize: 18
	},
	slideTextContainer: {
		marginBottom: 5,
		alignItems: "center"
	},
	slide: {
		flex: 1,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	slideImg: {
		flex: 1,
		resizeMode: "contain"
	},
	slideImgOver: {
		position: "absolute",
		top: 45,
		left: 45,
		right: 0,
		bottom: 0,
		width: null,
		height: Dimensions.get("window").height * 0.33,
		resizeMode: "contain",
		transform: [{ rotateZ: "5deg" }]
	},
	content: {
		marginTop: 10,
		marginLeft: 35,
		marginRight: 35
	},
	btnForgot: {
		marginTop: 7,
		marginBottom: 2,
		marginLeft: 2
	},
	btnForgotText: {
		fontSize: 12,
		color: "#0FB7ED"
	},
	footer: {
		position: "absolute",
		bottom: 20,
		left: 50,
		right: 50
	},
	textNotPuffer: {
		marginBottom: 2,
		fontSize: 12,
		textAlign: "center",
		color: "#FFF"
	}
};

export { Login };
