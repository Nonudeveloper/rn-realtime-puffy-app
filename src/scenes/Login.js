import React, { Component } from "react";
import { View, Image, Text, TouchableOpacity, Alert, Dimensions, Platform, BackHandler } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FBLoginManager } from "react-native-facebook-login";
import LinearGradient from "react-native-linear-gradient";
import InputText from "../components/InputText";
import BtnWhite from "../components/BtnWhite";
import BtnWhiteSmall from "../components/BtnWhiteSmall";
import BtnWhiteIcon from "../components/BtnWhiteIcon";
import BtnOutline from "../components/BtnOutline";
import ajaxPost from "../lib/ajaxPost";
import ajaxPostDev from "../lib/ajaxPostDev";
import Images from "../config/images";

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

		let email = this.props.screenProps.user_email;

		this.state = {
			email: email,
			password: "",
			devCount: 0
		};
	}

	fbLogin() {
		let $this = this;

		//FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Browser);

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

	//For IPAD in iphone mode.
	renderSmall() {
		return (
			<LinearGradient
				start={{ x: 0.0, y: 0.25 }}
				end={{ x: 0.0, y: 1.0 }}
				locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]}
				colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8", "#9467A5"]}
				style={styles.container}
			>
				<KeyboardAwareScrollView overScrollMode="never" keyboardShouldPersistTaps={"always"} scrollEnabled={false}>
					<View style={styles.headerSmall}>
						<Image style={styles.logoSmall} source={Images.puffy_logo} />
					</View>
					<View style={styles.contentSmall}>
						<InputText
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
						<InputText
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

						<View style={styles.facebookSmall}>
							<BtnWhiteIcon icon="fb_icon" value="Login with Facebook" onPress={this.fbLogin} />
						</View>
					</View>
					{Platform.OS === "android" ? (
						<View style={styles.signupForFree}>
							<Text style={styles.textNotPuffer}>Not a puffer yet?</Text>
							<BtnOutline value="Sign up for free!" onPress={this.showRegister} />
						</View>
					) : null}
				</KeyboardAwareScrollView>
				{Platform.OS === "ios" ? (
					<View style={styles.footerSmall}>
						<Text style={styles.textNotPufferSmall}>Not a puffer yet?</Text>
						<BtnOutline value="Sign up for FREE!" onPress={this.showRegister} />
					</View>
				) : null}
			</LinearGradient>
		);
	}

	render() {
		if (this.deviceTheme == "IphoneSmall") {
			return this.renderSmall();
		}

		return (
			<LinearGradient
				start={{ x: 0.0, y: 0.25 }}
				end={{ x: 0.0, y: 1.0 }}
				locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]}
				colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8", "#9467A5"]}
				style={styles.container}
			>
				<KeyboardAwareScrollView overScrollMode="never" keyboardShouldPersistTaps={"always"} scrollEnabled={false}>
					<View style={styles.header}>
						<Image style={this.props.screenProps.deviceTheme === "IphoneX" ? styles.logoBig : styles.logo} source={Images.puffy_logo} />
					</View>
					<TouchableOpacity style={styles.btnDevMode} onPress={this.setDevCount}>
						<Text style={styles.btnDevModeText} />
					</TouchableOpacity>
					<View style={styles.content}>
						<InputText
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
						<InputText
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

						<View style={this.props.screenProps.deviceTheme === "IphoneX" ? styles.facebookBig : styles.facebook}>
							<BtnWhiteIcon icon="fb_icon" value="Login with Facebook" onPress={this.fbLogin} />
						</View>
					</View>

					{Platform.OS === "android" ? (
						<View style={styles.signupForFree}>
							<Text style={styles.textNotPuffer}>Not a puffer yet?</Text>
							<BtnOutline value="Sign up for free!" onPress={this.showRegister} />
						</View>
					) : null}
				</KeyboardAwareScrollView>
				{Platform.OS === "ios" ? (
					<View style={this.props.screenProps.deviceTheme === "IphoneX" ? styles.footerBig : styles.footer}>
						<Text style={styles.textNotPuffer}>Not a puffer yet?</Text>
						<BtnOutline value="Sign up for free!" onPress={this.showRegister} />
					</View>
				) : null}
			</LinearGradient>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "transparent"
	},
	btnDevMode: {
		position: "absolute",
		top: 25,
		right: 10,
		paddingTop: 32,
		paddingBottom: 32,
		paddingLeft: 18,
		paddingRight: 18
	},
	footerSmall: {
		position: "absolute",
		bottom: 10,
		left: 30,
		right: 30
	},
	footer: {
		position: "absolute",
		bottom: 25,
		left: 30,
		right: 30
	},
	footerBig: {
		position: "absolute",
		bottom: 55,
		left: 30,
		right: 30
	},
	header: {
		marginTop: 40,
		alignItems: "center"
	},
	headerSmall: {
		marginTop: 20,
		alignItems: "center"
	},
	logoSmall: {
		width: 125,
		height: 125,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	logo: {
		width: 140,
		height: 140,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	logoBig: {
		marginTop: 45,
		marginBottom: 10,
		width: 190,
		height: 190,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	facebookSmall: {
		marginTop: 5,
		paddingTop: 5,
		borderTopWidth: 1,
		borderColor: "#FFF"
	},
	facebook: {
		marginTop: 20,
		paddingTop: 15,
		borderTopWidth: 1,
		borderColor: "#FFF"
	},
	facebookBig: {
		marginTop: 30,
		paddingTop: 25,
		borderTopWidth: 1,
		borderColor: "#FFF"
	},
	contentSmall: {
		marginTop: 5,
		marginLeft: 30,
		marginRight: 30
	},
	content: {
		marginTop: 25,
		marginLeft: 30,
		marginRight: 30
	},
	btnForgot: {
		marginTop: 5,
		marginLeft: 2
	},
	btnForgotText: {
		fontSize: 14,
		color: "#0FB7ED"
	},
	textNotPufferSmall: {
		marginBottom: 2,
		fontSize: 12,
		textAlign: "center",
		color: "#FFF"
	},
	textNotPuffer: {
		marginBottom: 5,
		fontSize: 14,
		textAlign: "center",
		color: "#FFF"
	},
	signupForFree: {
		marginLeft: 30,
		marginRight: 30,
		marginTop: 15
	}
};

export { Login };
