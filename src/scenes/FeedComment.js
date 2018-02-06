import React, { Component } from "react";
import { View, Text, TextInput, Image, AsyncStorage, TouchableHighlight, TouchableOpacity, Platform, FlatList } from "react-native";
import Images from "../config/images";
import Header from "../components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class FeedComment extends Component {
	constructor(props) {
		super(props);

		this.sendMsg = this.sendMsg.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.msgListenerFeedComments = this.msgListenerFeedComments.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.placeHolder = "Write a comment as " + this.props.screenProps.global.user_name;
		this.user_id = this.props.screenProps.global.user_id;
		this.file_id = this.props.navigation.state.params.file_id;
		this.items = [];

		this.state = {
			dataSource: []
		};
	}

	setItems(items) {
		if (items == null) {
			items = [];
		}

		this.items = items;

		this.setState({
			dataSource: items
		});

		let localData = JSON.stringify(items);
	}

	msgListenerFeedComments(data) {
		if (data["result"] == 1 && data["result_action"] == "get_feed_comments") {
			this.setItems(data["result_data"]);
		}
	}

	componentWillUnmount() {
		//console.log("feed all unmount");
		this.puffyChannel.removeListener("data_channel", this.msgListenerFeedComments);
	}

	componentDidMount() {
		let dataString = {
			user_action: "get_feed_comments",
			user_data: {
				file_id: this.file_id
			}
		};

		this.handleEmit(dataString);
		this.puffyChannel.on("data_channel", this.msgListenerFeedComments);
	}

	renderRow({ item, index }) {
		return (
			<View style={styles.row}>
				<TouchableOpacity onPress={() => this.gotoProfile(item.user_id)}>
					<Image style={styles.profileIcon} source={{ uri: item.profileImage }} />
				</TouchableOpacity>
				<View style={styles.body}>
					<Text style={styles.bodyText}>
						<Text style={styles.username}>{item.user_name} </Text>
						{item.puffy_feed_comments_text}
					</Text>
				</View>
				<Text style={styles.timeAgo}>{item.timeago} </Text>
			</View>
		);
	}

	gotoProfile(user_id) {
		this.props.navigation.navigate("Profile", { user: { id: user_id } });
	}

	sendMsg() {
		if (this.state.msg_text === "" || this.state.msg_text === " " || this.state.msg_text === "   ") {
			return false;
		}

		let dataString = {
			user_action: "create_feed_comments",
			user_data: {
				user_id: this.user_id,
				file_id: this.file_id,
				puffy_feed_comments_text: this.state.msg_text
			}
		};

		let newMessage = {
			puffy_feed_comments_text: this.state.msg_text,
			user_name: this.props.screenProps.global.user_name,
			user_id: this.user_id,
			profileImage: this.props.screenProps.global.user_thumb,
			timeago: "1s"
		};

		this.handleEmit(dataString);

		this.items.unshift(newMessage);

		this.setState({
			dataSource: this.items
		});

		this._textInput.setNativeProps({ text: "" });

		this.setState({
			msg_text: ""
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Header deviceTheme={this.props.screenProps.deviceTheme} LeftIcon="back_arrow" LeftCallback={this.props.navigation.goBack} global={this.props.screenProps.global} />
				<View style={styles.section}>
					<Text style={styles.boldHeader}>Comments</Text>
				</View>
				<KeyboardAwareScrollView
					overScrollMode="never"
					extraHeight={this.props.screenProps.deviceTheme == "IphoneX" ? 160 : 140}
					keyboardShouldPersistTaps="always"
					scrollEnabled={false}
					contentContainerStyle={{ flex: 1 }}
				>
					<FlatList
						data={this.state.dataSource}
						style={[{ transform: [{ scaleY: -1 }] }]}
						inverted={true}
						keyExtractor={(item, index) => index}
						renderItem={this.renderRow}
					/>

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
							value={this.msg_text}
							returnKeyType="send"
							placeholder={this.placeHolder}
							placeholderTextColor="#aaaaaa"
							onSubmitEditing={this.sendMsg}
						/>

						<TouchableOpacity style={styles.sendPhoto} onPress={this.showMenu}>
							<Image style={styles.plusIcon} source={{ uri: this.props.screenProps.global.user_thumb }} />
						</TouchableOpacity>

						<TouchableOpacity style={styles.sendButton} onPress={this.sendMsg}>
							<Text style={styles.sendButtonText}>Send</Text>
						</TouchableOpacity>
					</View>
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
	section: {
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		marginLeft: 5,
		marginRight: 5,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 2
	},
	boldHeader: {
		fontSize: 16,
		fontFamily: "Helvetica",
		textAlign: "center",
		color: "#181818"
	},
	avatar: {},
	avatarImg: {
		borderRadius: 25,
		marginRight: 5,
		marginLeft: 2,
		height: 50,
		width: 50,
		resizeMode: "cover"
	},
	body: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 5
	},
	bodyText: {
		fontSize: 12,
		fontFamily: "Helvetica",
		paddingTop: 2,
		paddingBottom: 15
	},
	username: {
		fontSize: 12,
		fontFamily: "Helvetica",
		fontWeight: "bold"
	},
	preview: {
		marginTop: 5,
		fontSize: 12,
		color: "#000000",
		height: 20
	},
	profileIcon: {
		width: 40,
		height: 40,
		margin: 5,
		resizeMode: "contain",
		borderRadius: 20
	},
	row: {
		backgroundColor: "#FEFEFE",
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		paddingRight: 10,
		paddingLeft: 10,
		paddingTop: 1,
		paddingBottom: 1,
		flexDirection: "row"
	},
	containerBottom: {
		backgroundColor: "#FEFEFE",
		zIndex: 9999
	},
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
		borderColor: "#919191",
		color: "#000",
		fontFamily: "Helvetica",
		fontSize: 14,
		borderRadius: 10
	},
	sendButton: {
		position: "absolute",
		top: 18,
		right: 20,
		padding: 5
	},
	sendButtonText: {
		color: "#aaaaaa",
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
		width: 40,
		height: 40,
		resizeMode: "contain",
		borderRadius: 20
	},
	messageThumb: {
		width: 150,
		height: 150,
		resizeMode: "contain"
	},
	timeAgo: {
		fontSize: 10,
		position: "absolute",
		bottom: 9,
		left: 65
	}
};

export { FeedComment };
