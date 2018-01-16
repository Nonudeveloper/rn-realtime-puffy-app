import React, { Component } from "react";
import { KeyboardAvoidingView, View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import Images from "../config/images";
import ajaxPost from "../lib/ajaxPost";
import InputText from "../components/InputText";
import BtnWhite from "../components/BtnWhite";
import BtnOutline from "../components/BtnOutline";

class ForgotPassword extends Component {
	constructor(props) {
		super(props);

		this.submitForgotPassword = this.submitForgotPassword.bind(this);
		this.cancelRequest = this.cancelRequest.bind(this);

		this.state = {
			email: ""
		};
	}

	cancelRequest() {
		this.props.navigation.goBack();
	}

	submitForgotPassword() {
		if (this.state.email === "") {
			Alert.alert("Error", "Please enter your email to continue");
			return false;
		}

		let $this = this;
		let dataString = { user_email: this.state.email, user_password1: this.state.password2 };

		ajaxPost(dataString, "forgotPassword", function(result) {
			//success
			if (result.result == 1) {
				$this.props.navigation.navigate("Reset");
			} else {
				Alert.alert("Incorrect", "Email address not found.");
			}
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<LinearGradient
					start={{ x: 0.0, y: 0.25 }}
					end={{ x: 0.0, y: 1.0 }}
					locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]}
					colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8", "#9467A5"]}
					style={styles.container}
				>
					<KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
						<View style={styles.header}>
							<Image style={styles.logo} source={Images.logo_white} />
							<Text style={styles.headerText}>Forgot Password?</Text>
						</View>
						<View style={styles.content}>
							<InputText
								value={this.state.email}
								placeholderTextColor="#FFF"
								placeholder="Enter Registered Email"
								returnKeyType="done"
								keyboardType="email-address"
								theme="light"
								onSubmitEditing={this.submitForgotPassword}
								onChangeText={email => this.setState({ email })}
							/>
							<BtnWhite value="Submit" onPress={this.submitForgotPassword} />
						</View>
					</KeyboardAwareScrollView>
				</LinearGradient>
				<View style={styles.footer}>
					<BtnOutline value="Back To Log In" onPress={this.cancelRequest} />
				</View>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "transparent"
	},
	header: {
		marginTop: 40,
		alignItems: "center"
	},
	logo: {
		width: 115,
		height: 115,
		resizeMode: "contain"
	},
	headerText: {
		marginTop: 20,
		fontSize: 30,
		color: "#FFF"
	},
	content: {
		marginTop: 45,
		marginLeft: 30,
		marginRight: 30
	},
	btnForgot: {
		marginTop: 5
	},
	btnForgotText: {
		fontSize: 12,
		color: "#0FB7ED"
	},
	textNotPuffer: {
		marginTop: 30,
		marginBottom: 5,
		fontSize: 14,
		textAlign: "center",
		color: "#FFF"
	},
	footer: {
		position: "absolute",
		bottom: 25,
		left: 20,
		right: 20
	}
};

export { ForgotPassword };
