import React, { Component } from "react";
import { View, Image, Text, TouchableOpacity, Alert, Dimensions, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import InputTextLogin from "../components/InputText";
import BtnWhite from "../components/BtnWhite";
import BtnWhiteSmall from "../components/BtnWhiteSmall";
import BtnWhiteIcon from "../components/BtnWhiteIcon";
import BtnOutline from "../components/BtnOutline";
import BtnOutlineLogin from "../components/BtnOutlineLogin";
import ajaxPost from "../lib/ajaxPost";
import ajaxPostDev from "../lib/ajaxPostDev";
import Images from "../config/images";
import ImageSlider from "react-native-image-slider";
import Swiper from "react-native-swiper";

const DIMENSIONS = Dimensions.get("window");
const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken } = FBSDK;

class Login extends Component {
	constructor(props) {
		super(props);

		this.deviceTheme = this.props.screenProps.deviceTheme;
		this.fbLogin = this.fbLogin.bind(this);
		this.showRegister = this.showRegister.bind(this);
		this.showLogin = this.showLogin.bind(this);
		this.showForgot = this.showForgot.bind(this);
		this.loginUser = this.props.screenProps.loginUser.bind(this);
		this.width = Dimensions.get("window").width;
	}

	fbLogin() {
		let $this = this;

		LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
			function(result) {
				if (result.isCancelled) {
					console.log("Login cancelled");
				} else {
					AccessToken.getCurrentAccessToken().then(data => {
						let fb_id = data.userID;
						let fb_token = data.accessToken;

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
					});
				}
			},
			function(error) {
				console.log("Login fail with error: " + error);
			}
		);
	}

	showRegister() {
		this.props.navigation.navigate("Register");
	}

	showLogin() {
		this.props.navigation.navigate("LoginForm");
	}

	showForgot() {
		this.props.navigation.navigate("ForgotPassword");
	}

	renderSmall() {
		return (
			<LinearGradient
				start={{ x: 0.0, y: 0.25 }}
				end={{ x: 0.0, y: 1.0 }}
				locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]}
				colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8", "#9467A5"]}
				style={styles.container}
			>
				<KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
					<View style={DIMENSIONS.height > 500 ? styles.headerSmall : styles.headerSmaller}>
						<Image style={DIMENSIONS.height > 500 ? styles.logoSmall : styles.logoSmaller} source={Images.puffy_logo} />
					</View>
					<TouchableOpacity style={styles.btnDevMode} onPress={this.setDevCount}>
						<Text style={styles.btnDevModeText} />
					</TouchableOpacity>
					<Swiper
						style={styles.wrapper}
						showsButtons={false}
						autoplay={false}
						loop={false}
						index={0}
						paginationStyle={{
							bottom: 0,
							left: 0,
							right: 0,
							alignItems: "center"
						}}
						height={DIMENSIONS.height > 500 ? 175 : 115}
					>
						<View style={styles.slide1}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideTextSmall}>Meet New and Interesting</Text>
								<Text style={styles.slideTextSmall}>Puffers Nearby</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide1} />
						</View>
						<View style={styles.slide2}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideTextSmall}>Pass by Swiping Left, Puff by</Text>
								<Text style={styles.slideTextSmall}>Swiping Right and Connect</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide1} />
							<Image style={DIMENSIONS.height > 500 ? styles.slideImgOverSmall : styles.slideImgOverSmaller} source={Images.slide2} />
						</View>
						<View style={styles.slide3}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideTextSmall}>Once They Puff Back then You</Text>
								<Text style={styles.slideTextSmall}>Become Puffers</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide4} />
						</View>
						<View style={styles.slide4}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideTextSmall}>Be Able to Chat and Share</Text>
								<Text style={styles.slideTextSmall}>Photos with Puffers for Free</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide3} />
						</View>
					</Swiper>
					<View style={styles.contentSmall}>
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
				<View style={styles.footerSmall}>
					<Text style={styles.textNotPuffer}>Not a puffer yet?</Text>
					<BtnOutlineLogin value="Sign up for free!" onPress={this.showRegister} />
				</View>
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
				<KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
					<View style={this.deviceTheme == "IphoneX" ? styles.headerX : styles.header}>
						<Image style={styles.logo} source={Images.puffy_logo} />
					</View>
					<TouchableOpacity style={styles.btnDevMode} onPress={this.setDevCount}>
						<Text style={styles.btnDevModeText} />
					</TouchableOpacity>
					<Swiper
						style={styles.wrapper}
						showsButtons={false}
						autoplay={false}
						loop={false}
						index={0}
						paginationStyle={{
							bottom: 5,
							left: 0,
							right: 0,
							alignItems: "center"
						}}
						height={this.deviceTheme == "IphoneX" ? 280 : 230}
					>
						<View style={styles.slide1}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideText}>Meet New and Interesting</Text>
								<Text style={styles.slideText}>Puffers Nearby</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide1} />
						</View>
						<View style={styles.slide2}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideText}>Pass by Swiping Left, Puff by</Text>
								<Text style={styles.slideText}>Swiping Right and Connect</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide1} />
							<Image style={this.deviceTheme == "IphoneX" ? styles.slideImgOverLarge : styles.slideImgOver} source={Images.slide2} />
						</View>
						<View style={styles.slide3}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideText}>Once They Puff Back then You</Text>
								<Text style={styles.slideText}>Become Puffers</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide4} />
						</View>
						<View style={styles.slide4}>
							<View style={styles.slideTextContainer}>
								<Text style={styles.slideText}>Be Able to Chat and Share</Text>
								<Text style={styles.slideText}>Photos with Puffers for Free</Text>
							</View>
							<Image style={styles.slideImg} source={Images.slide3} />
						</View>
					</Swiper>
					
					<View style={styles.content}>
						<Text style={styles.textNotPuffer}>Not a puffer yet?</Text>
						<View>
							<BtnWhiteSmall value="Sign up for free" onPress={this.showRegister} />
							<BtnOutline value="Login" onPress={this.showLogin} />
						</View>

						<TouchableOpacity style={this.deviceTheme == "IphoneX" ? styles.btnForgotLarge : styles.btnForgot} onPress={this.showForgot}>
							<Text style={styles.btnForgotText}>Forgot password?</Text>
						</TouchableOpacity>
					
					</View>
				</KeyboardAwareScrollView>
				
				<View style={this.deviceTheme == "IphoneX" ? styles.footerX : styles.footer}>
					<View style={styles.facebook}>
						<BtnWhiteIcon icon="fb_icon" value="Login with Facebook" onPress={this.fbLogin} />
					</View>
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
	headerX: {
		marginTop: 55,
		marginBottom: 10,
		alignItems: "center",
		backgroundColor: "transparent"
	},
	header: {
		marginTop: 25,
		marginBottom: 5,
		alignItems: "center",
		backgroundColor: "transparent"
	},
	headerSmall: {
		marginTop: 25,
		marginBottom: 5,
		alignItems: "center",
		backgroundColor: "transparent"
	},
	headerSmaller: {
		marginTop: 17,
		alignItems: "center",
		backgroundColor: "transparent"
	},
	logoSmaller: {
		width: 40,
		height: 40,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	logoSmall: {
		width: 55,
		height: 55,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
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
	slideTextSmall: {
		color: "#FFFFFF",
		fontFamily: "Helvetica",
		fontSize: 13
	},
	slideText: {
		color: "#FFFFFF",
		fontFamily: "Helvetica",
		fontSize: 18
	},
	slideTextContainer: {
		marginBottom: 5,
		alignItems: "center"
	},
	slide1: {
		flex: 1,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	slide2: {
		flex: 1,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	slide3: {
		flex: 1,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	slide4: {
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
	slideImgOverSmaller: {
		position: "absolute",
		top: 39,
		left: 15,
		right: 0,
		bottom: 0,
		width: null,
		height: 75,
		resizeMode: "contain"
	},
	slideImgOverSmall: {
		position: "absolute",
		top: 39,
		left: 22,
		right: 0,
		bottom: 0,
		width: null,
		height: 135,
		resizeMode: "contain"
	},
	slideImgOver: {
		position: "absolute",
		top: 45,
		left: 28,
		right: 0,
		bottom: 0,
		width: null,
		height: 185,
		resizeMode: "contain"
	},
	slideImgOverLarge: {
		position: "absolute",
		top: 40,
		left: 28,
		right: 0,
		bottom: 0,
		width: null,
		height: 235,
		resizeMode: "contain"
	},
	content: {
		marginTop: 10,
		marginLeft: 35,
		marginRight: 35
	},
	contentSmall: {
		marginTop: 5,
		marginLeft: 35,
		marginRight: 35
	},
	btnForgot: {
		marginTop: 7,
		marginBottom: 5,
		marginLeft: 2
	},
	btnForgotLarge: {
		marginTop: 10,
		marginBottom: 8,
		marginLeft: 2
	},
	btnForgotText: {
		fontSize: 12,
		color: "#0FB7ED"
	},
	footerSmall: {
		position: "absolute",
		left: 50,
		right: 50
	},
	footer: {
		position: "absolute",
		bottom: 40,
		left: 35,
		right: 35
	},
	footerX: {
		position: "absolute",
		bottom: 57,
		left: 50,
		right: 50
	},
	textNotPuffer: {
		marginBottom: 2,
		fontSize: 12,
		textAlign: "center",
		color: "#FFF"
	},
	btnDevMode: {
		position: "absolute",
		top: 25,
		right: 10,
		paddingTop: 32,
		paddingBottom: 32,
		paddingLeft: 18,
		paddingRight: 18
	}
};

export { Login };
