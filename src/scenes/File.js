import React, { Component } from "react";
import { Alert, View, Text, AsyncStorage, TouchableOpacity } from "react-native";
import FilterInput from "../components/FilterInput";
import { NavigationActions } from "react-navigation";
import Header from "../components/Header";
import FeedItem from "../components/FeedItem";

class File extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.msgListener = this.msgListener.bind(this);
		this.navigation = this.props.navigation;
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.data = this.props.navigation.state.params.data;
		this.file = null;
		this.gotoProfile = this.gotoProfile.bind(this);
		this.likePhoto = this.likePhoto.bind(this);
		this.deletePost = this.deletePost.bind(this);
		this.unlikePhoto = this.unlikePhoto.bind(this);
		this.user_id = this.props.screenProps.user_id;

		this.state = {
			data: 0,
			refreshing: true,
			selected: false,
			myPost: 0
		};
	}

	msgListener(data) {
		//no more feed
		if (data["result"] == 0 && data["result_action"] == "get_single_feed_result") {
			this.setState({
				refreshing: false,
				selected: !this.state.selected
			});
		}

		if (data["result"] == 1 && data["result_action"] == "add_update_like_result") {
			let data_file_id = parseInt(data["result_data"]["file_id"]);
			let remove_file_like = parseInt(data["result_data"]["remove_file_like"]);
			let state_data = this.state.data;

			if (data_file_id > 0) {
				if (remove_file_like === 1) {
					if (state_data["file_id"] == data_file_id) {
						state_data["likes"] = null;
					}
				} else {
					if (state_data["file_id"] == data_file_id) {
						state_data["likes"] = 1;
					}
				}

				this.setState({ data: state_data, selected: !this.state.selected });
			}
		}

		//append feed images
		if (data["result"] == 1 && data["result_action"] == "get_single_feed_result") {
			let myPost = 0;
			let file_id = data["result_data"]["file_id"];
			let user_id = data["result_data"]["user_id"];

			if (this.user_id == user_id) {
				myPost = 1;
			}

			if (this.data.file_id != file_id) {
				return false;
			}

			data["result_data"]["isActive"] = true;

			this.setState({
				data: data.result_data,
				refreshing: false,
				myPost: myPost,
				selected: !this.state.selected
			});

			let localData = JSON.stringify(data["result_data"]);

			if (localData) {
				AsyncStorage.setItem("Feed" + file_id, localData);
			}
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.msgListener);
	}

	componentDidMount() {
		AsyncStorage.getItem("Feed" + this.data.file_id, (err, result) => {
			if (!err && result != null) {
				let item = JSON.parse(result);
				let myPost = 0;

				if (this.user_id == item.user_id) {
					myPost = 1;
				}

				this.setState({
					data: item,
					refreshing: false,
					myPost: myPost
				});
			}
		});

		let dataString = {
			user_action: "get_single_feed",
			user_data: { file_id: this.data.file_id }
		};

		this.handleEmit(dataString);
		this.puffyChannel.on("data_channel", this.msgListener);
	}

	gotoProfile(props) {
		props["thumb"] = props.file_thumbnail_url;
		props["id"] = props.user_id;
		props["name"] = props.user_name;

		this.props.navigation.navigate("Profile", { user: props });
	}

	likePhoto(data) {
		//cant like your own photo.
		if (this.user_id == data.user_id) {
			console.log("cant like your own photo");
			return false;
		}

		let dataString = {
			user_action: "add_update_like",
			user_data: {
				file_id: data.file_id
			}
		};

		data.likes = 1;

		this.handleEmit(dataString);

		this.setState({ selected: !this.state.selected });
	}

	unlikePhoto(data) {
		let dataString = {
			user_action: "add_update_like",
			user_data: {
				file_id: data.file_id
			}
		};

		data.likes = null;

		this.handleEmit(dataString);

		this.setState({ selected: !this.state.selected });
	}

	deletePost(data) {
		let dataString = {
			user_action: "delete_feed",
			user_data: {
				file_id: data.file_id
			}
		};

		this.handleEmit(dataString);

		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: "index" })]
		});
		this.navigation.dispatch(resetAction);
	}

	render() {
		return (
			<View style={styles.container}>
				<Header deviceTheme={this.props.screenProps.deviceTheme} LeftIcon="back_arrow" LeftCallback={this.props.navigation.goBack} global={this.props.screenProps.global} />

				{this.state.data == 0 ? null : (
					<FeedItem
						data={this.state.data}
						index={0}
						autoplay={true}
						extraData={this.state.selected}
						myPost={this.state.myPost}
						likePhoto={this.likePhoto}
						unlikePhoto={this.unlikePhoto}
						gotoProfile={this.gotoProfile}
						deletePost={this.deletePost}
						handleEmit={this.handleEmit}
						global={this.props.screenProps.global}
						setGlobal={this.props.screenProps.setGlobal}
						navigation={this.props.navigation}
					/>
				)}
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	sectionHeader: {
		borderBottomWidth: 1,
		borderColor: "#EEEEEE",
		paddingTop: 20,
		paddingBottom: 20
	},
	section: {
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		paddingTop: 10,
		paddingBottom: 5,
		paddingLeft: 15
	},
	boldHeader: {
		fontSize: 16,
		fontFamily: "Helvetica",
		fontWeight: "bold",
		textAlign: "center"
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
	mainStyle: {
		fontSize: 26,
		fontWeight: "bold",
		justifyContent: "center",
		textAlign: "center",
		color: "#B2B2B2",
		marginTop: 100
	}
};

export { File };
