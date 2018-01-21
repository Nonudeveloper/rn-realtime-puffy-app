import React, { Component } from "react";
import { View, Text, Image, FlatList, TextInput, AsyncStorage, Clipboard, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actionsheet";
import { HeaderMessage } from "../components";
import Images from "../config/images";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LinearGradient from "react-native-linear-gradient";
import ImagePreview from "react-native-image-preview";
import { CachedImage } from "react-native-img-cache";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Take Photo", "Choose From Gallery"];
const title = "Add Photo";

const options2 = ["Cancel", "Copy"];

class Message extends Component {
	constructor(props) {
		super(props);

		this.renderRow = this.renderRow.bind(this);
		this.renderMyChat = this.renderMyChat.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.renderOtherChat = this.renderOtherChat.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.sendMsg = this.sendMsg.bind(this);
		this.backFunction = this.backFunction.bind(this);
		this.msgListener = this.msgListener.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.handlePress = this.handlePress.bind(this);
		this.handlePress2 = this.handlePress2.bind(this);
		this.openImage = this.openImage.bind(this);
		this.setVisibleToFalse = this.setVisibleToFalse.bind(this);

		this.gotoPhoto = this.gotoPhoto.bind(this);
		this.gotoGallery = this.gotoGallery.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.showMenu2 = this.showMenu2.bind(this);
		this.key = this.props.navigation.state.key;
		this.routeName = this.props.navigation.state.routeName;

		this.scrollView;
		this.listview;
		this.items = [];
		this.user = { id: this.props.navigation.state.params.user_id };
		this.user_id = this.props.navigation.state.params.user_id;
		this.report_id = this.props.navigation.state.params.report_id;
		this.active = 0;

		this.state = {
			dataSource: [],
			file_url: "",
			visible: false,
			user_name: this.props.navigation.state.params.name,
			msg_text: "",
			selectedText: ""
		};
	}

	msgListener(data) {
		if (data["result"] == 0 && data["result_action"] == "list_msg_result") {
			this.items = [];
			this.setState({
				dataSource: this.items
			});
			AsyncStorage.removeItem("Message" + this.user_id);
		}

		if (data["result"] == 1 && data["result_action"] == "list_msg_result") {
			let result_data = data["result_data"];
			let other_user_id = parseInt(result_data["user_id"]);

			if (this.user_id === other_user_id) {
				this.items = result_data["rows"];

				this.setState({
					dataSource: this.items
				});

				this.active = 1;

				this.handleEmit({
					user_action: "get_my_user",
					user_data: {}
				});

				let localData = JSON.stringify(this.items);

				if (localData) {
					AsyncStorage.setItem("Message" + this.user_id, localData);
				}
			}
		}

		if (data["result"] == 1 && data["result_action"] == "read_other_result") {
			let result_data = data["result_data"];
			let other_user_id = parseInt(result_data["user_id"]);

			console.log("read other result");

			if (this.user_id === other_user_id) {
				for (var i in this.items) {
					this.items[i].puffy_messages_read_date = 1;
				}

				this.setState({
					dataSource: this.items
				});
				//flag all as read
			}
		}

		if (data["result"] == 1 && data["result_action"] == "msg_other_result") {
			let result_data = data["result_data"];
			let other_user_id = parseInt(result_data["user_id"]);

			if (this.user_id === other_user_id) {
				if (this.items) {
					if (this.items.length > 0) {
						if (this.items[0].puffy_messages_id == result_data.puffy_messages_id) {
							return false;
						}
					}
				}

				this.items.unshift(result_data);

				this.setState({
					dataSource: this.items
				});

				console.log("send read other");

				let dataString = {
					user_action: "read_msg",
					user_data: {
						user_id: this.user_id
					}
				};

				this.handleEmit(dataString);
			}
		}

		if (data["result"] == 1 && data["result_action"] == "msg_result") {
			let result_data = data["result_data"];
			let other_user_id = parseInt(result_data["user_id"]);

			if (this.user_id === other_user_id) {
				if (this.items.length > 0) {
					if (this.items[0].puffy_messages_id == result_data.puffy_messages_id) {
						return false;
					}
				}

				this.items.unshift(result_data);

				this.setState({
					dataSource: this.items
				});
			}
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.msgListener);
	}

	componentDidMount() {
		AsyncStorage.getItem("Message" + this.user_id, (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);
				this.items = items;

				this.setState({
					dataSource: this.items
				});
			}
		});

		let dataString = {
			user_action: "list_message",
			user_data: {
				user_id: this.user_id,
				report_id: this.report_id
			}
		};

		this.handleEmit(dataString);
		this.puffyChannel.on("data_channel", this.msgListener);
	}

	gotoProfile(props) {
		this.props.navigation.navigate("Profile", { user: props });
	}

	showMenu() {
		this.ActionSheet.show();
	}

	showMenu2(text) {
		this.setState({
			selectedText: text
		});
		this.ActionSheet2.show();
	}

	handlePress(i) {
		if (i == 1) {
			this.gotoPhoto();
		} else if (i == 2) {
			this.gotoGallery();
		}
	}

	handlePress2(i) {
		if (i == 1) {
			Clipboard.setString(this.state.selectedText);
		}
	}

	gotoPhoto() {
		this.props.navigation.navigate("Photo", { message_user_id: this.user_id, key: this.key, routeName: this.routeName });
	}

	gotoGallery() {
		this.props.navigation.navigate("Gallery", { message_user_id: this.user_id, key: this.key, routeName: this.routeName });
	}
	openImage(file_url) {
		this.setState({ file_url: file_url, visible: true });
	}
	setVisibleToFalse() {
		this.setState({ visible: false });
	}

	renderRow({ item, index }) {
		let setDate = 0;
		let nextMessage = this.items[index + 1];

		if (nextMessage == null) {
			setDate = 1;
		} else if (item.msg_date !== nextMessage.msg_date) {
			setDate = 1;
		}

		if (item.msg_type === 1) {
			return this.renderMyChat(item, setDate);
		} else if (item.msg_type === 2) {
			return this.renderOtherChat(item, setDate);
		}

		return <View />;
	}

	renderMyChat(row, setDate) {
		return (
			<View style={[{ backgroundColor: "transparent", transform: [{ scaleY: -1 }] }]}>
				{setDate == 1 ? <Text style={styles.dateLine}>──────── {row.msg_date} ────────</Text> : null}
				<View style={styles.rowContainer}>
					<View style={styles.rowRight}>
						<View style={styles.body}>
							{row.file_thumb == null ? (
								<TouchableWithoutFeedback onLongPress={() => this.showMenu2(row.puffy_messages_text)}>
									<View>
										<Text style={styles.myText}>{row.puffy_messages_text}</Text>
									</View>
								</TouchableWithoutFeedback>
							) : (
								<TouchableOpacity onPress={() => this.openImage(row.file_url)}>
									<CachedImage style={styles.messageThumb} source={{ uri: row.file_thumb }} />
								</TouchableOpacity>
							)}
						</View>
					</View>

					<View style={styles.myDateContainer}>
						{row.puffy_messages_read_date == null ? null : (
							<Image style={{ width: 12, height: 12, marginTop: 1, resizeMode: "contain" }} source={Images.checkmark_button} />
						)}
						<Text style={styles.myDate}>{row.msg_time}</Text>
						<View style={styles.myDateArrow} />
					</View>
				</View>
			</View>
		);
	}

	renderOtherChat(row, setDate) {
		return (
			<View style={[{ backgroundColor: "transparent", transform: [{ scaleY: -1 }] }]}>
				{setDate == 1 ? <Text style={styles.dateLine}>──────── {row.msg_date} ────────</Text> : null}
				<View style={styles.rowContainer}>
					<View style={styles.row}>
						<TouchableOpacity onPress={() => this.gotoProfile(this.user)}>
							<View style={styles.avatar}>{row.profileImage == null ? null : <CachedImage style={styles.avatarImg} source={{ uri: row.profileImage }} />}</View>
						</TouchableOpacity>

						<View style={styles.otherBody}>
							<View style={styles.otherBodyText}>
								{row.file_thumb == null ? (
									<TouchableWithoutFeedback onLongPress={() => this.showMenu2(row.puffy_messages_text)}>
										<View>
											<Text style={styles.otherText}>{row.puffy_messages_text}</Text>
										</View>
									</TouchableWithoutFeedback>
								) : (
									<TouchableOpacity onPress={() => this.openImage(row.file_url)}>
										<CachedImage style={styles.messageThumb} source={{ uri: row.file_thumb }} />
									</TouchableOpacity>
								)}
							</View>
							<View style={styles.otherDateContainer}>
								<View style={styles.otherDateArrow} />
								<Text style={styles.otherDate}>{row.msg_time}</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
	}

	sendMsg() {
		if (this.state.msg_text === "" || this.state.msg_text === " " || this.state.msg_text === "   ") {
			return false;
		}

		let dataString = {
			user_action: "msg_user",
			user_data: {
				user_id: this.user_id,
				report_id: this.report_id,
				puffy_messages_text: this.state.msg_text
			}
		};

		this.handleEmit(dataString);

		this._textInput.setNativeProps({ text: "" });

		this.setState({
			msg_text: ""
		});
	}

	backFunction() {
		let dataString = {
			user_action: "list_msgs",
			user_data: {}
		};

		this.handleEmit(dataString);

		this.props.navigation.goBack();
	}

	render() {
		let current_date = new Date();
		let current_hour = current_date.getHours();
		let current_minute = current_date.getMinutes();

		let current_time = current_hour + ":" + current_minute;

		return (
			<View style={styles.container}>
				<HeaderMessage
					deviceTheme={this.props.screenProps.deviceTheme}
					navigation={this.props.navigation}
					backfunction={this.backFunction}
					next={false}
					backRoute={false}
					nextFunction={false}
					nextText={false}
					user={this.user}
					global={this.props.screenProps.global}
				>
					{this.state.user_name}
				</HeaderMessage>

				<KeyboardAwareScrollView
					overScrollMode="never"
					extraHeight={this.props.screenProps.deviceTheme == "IphoneX" ? 100 : 80}
					keyboardShouldPersistTaps="always"
					scrollEnabled={false}
					contentContainerStyle={{ flex: 1 }}
				>
					<LinearGradient
						start={{ x: 0.0, y: 0.25 }}
						end={{ x: 0.0, y: 1.0 }}
						locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
						colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
						style={styles.containerList}
					>
						<FlatList
							ref={ref => {
								this.listview = ref;
							}}
							style={[{ transform: [{ scaleY: -1 }] }]}
							inverted={false}
							enableEmptySections={true}
							removeClippedSubviews={true}
							initialNumToRender={30}
							contentContainerStyle={styles.list}
							keyExtractor={(item, index) => index}
							data={this.state.dataSource}
							renderItem={this.renderRow}
						/>
					</LinearGradient>

					<View style={styles.containerBottom}>
						<TextInput
							ref={component => (this._textInput = component)}
							style={styles.inputMessage}
							underlineColorAndroid="transparent"
							autoFocus={false}
							autoCorrect={true}
							maxLength={250}
							multiline={true}
							blurOnSubmit={true}
							onChangeText={msg_text => this.setState({ msg_text })}
							returnKeyType="send"
							placeholder="write a message..."
							placeholderTextColor="#FFF"
							onSubmitEditing={this.sendMsg}
						/>

						<TouchableOpacity style={styles.sendPhoto} onPress={this.showMenu}>
							<Image style={styles.plusIcon} source={Images.plus_icon} />
						</TouchableOpacity>

						<TouchableOpacity style={styles.sendButton} onPress={this.sendMsg}>
							<Text style={styles.sendButtonText}>Send</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAwareScrollView>
				<ImagePreview visible={this.state.visible} source={{ uri: this.state.file_url }} close={this.setVisibleToFalse} />
				<ActionSheet ref={o => (this.ActionSheet = o)} title={title} options={options} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress} />
				<ActionSheet ref={o => (this.ActionSheet2 = o)} options={options2} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress2} />
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#C2B2D2"
	},
	containerList: {
		flex: 1,
		backgroundColor: "blue"
	},
	list: {
		marginTop: 0
	},
	rowContainer: {
		zIndex: 9999,
		backgroundColor: "transparent",
		minHeight: 50,
		marginBottom: 8,
		marginRight: 5,
		marginLeft: 5
	},
	row: {
		marginBottom: 2,
		flexDirection: "row",
		zIndex: 9999
	},
	rowRight: {
		paddingLeft: 5,
		marginRight: 5,
		flexDirection: "row",
		alignSelf: "flex-end",
		minWidth: 30,
		maxWidth: 250,
		zIndex: 9999
	},
	center: {
		textAlign: "center",
		marginTop: 10,
		color: "#B4B7BA"
	},
	avatarImg: {
		borderRadius: 25,
		marginRight: 8,
		marginLeft: 10,
		height: 50,
		width: 50,
		resizeMode: "contain"
	},
	myDateContainer: {
		alignSelf: "flex-end",
		marginRight: 5,
		flexDirection: "row"
	},
	myDateArrow: {
		width: 0,
		height: 0,
		borderStyle: "solid",
		borderRightWidth: 14,
		borderTopWidth: 14,
		borderRightColor: "transparent",
		borderTopColor: "#346397",
		transform: [{ rotate: "90deg" }]
	},
	myDate: {
		fontSize: 10,
		color: "#FFF",
		fontFamily: "Helvetica",
		marginTop: 1,
		marginLeft: 5
	},
	otherDate: {
		color: "#FFF",
		fontFamily: "Helvetica",
		fontSize: 12,
		marginLeft: 2
	},
	otherBody: {},
	otherBodyText: {
		paddingTop: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 10,
		minWidth: 30,
		maxWidth: 250,
		zIndex: 9999,
		backgroundColor: "#BBB6D5",
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		borderBottomRightRadius: 12
	},
	body: {
		paddingTop: 10,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 10,
		minWidth: 30,
		maxWidth: 250,
		zIndex: 9999,
		backgroundColor: "#346397",
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		borderBottomLeftRadius: 12
	},
	containerBottom: {
		backgroundColor: "#C2B2D2",
		zIndex: 9999
	},
	dateLine: {
		color: "#FFF",
		fontFamily: "Helvetica",
		fontSize: 14,
		textAlign: "center",
		marginTop: 5,
		marginBottom: 5
	},
	myText: {
		color: "#FFF",
		fontFamily: "Helvetica",
		fontSize: 14
	},
	otherDateContainer: {
		flexDirection: "row"
	},
	otherDateArrow: {
		width: 0,
		height: 0,
		borderStyle: "solid",
		borderRightWidth: 14,
		borderTopWidth: 14,
		borderRightColor: "transparent",
		borderTopColor: "#BBB6D5"
	},
	otherText: {
		color: "#000",
		fontFamily: "Helvetica",
		fontSize: 14
	},
	messageRow: {},
	inputMessage: {
		height: 40,
		marginBottom: 10,
		marginTop: 10,
		marginLeft: 50,
		marginRight: 10,
		paddingLeft: 10,
		paddingTop: 10,
		paddingBottom: 10,
		paddingRight: 60,
		borderWidth: 2,
		borderColor: "#E4E5E7",
		color: "#FFF",
		fontFamily: "Helvetica",
		fontSize: 14,
		borderRadius: 10
	},
	actionsContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "stretch",
		marginTop: 12,
		height: 20,
		backgroundColor: "transparent"
	},
	center: {
		textAlign: "center",
		fontSize: 14
	},
	bold: {
		fontWeight: "bold"
	},
	sendButton: {
		position: "absolute",
		top: 18,
		right: 22,
		padding: 5
	},
	sendButtonText: {
		color: "#FFF",
		fontSize: 12,
		fontWeight: "bold",
		fontFamily: "Helvetica"
	},
	sendPhoto: {
		position: "absolute",
		top: 8,
		left: 3,
		padding: 5
	},
	plusIcon: {
		width: 30,
		height: 35,
		resizeMode: "contain"
	},
	messageThumb: {
		width: 150,
		height: 150,
		resizeMode: "contain"
	}
};

export { Message };
