import React, { Component } from "react";
import { View, FlatList, Image, Dimensions, TouchableOpacity, Text, Platform } from "react-native";
import ActionSheet from "react-native-actionsheet";
import HeaderSearch from "../components/HeaderSearch";
import TopTabIcon from "../components/TopTabIcon";
import Images from "../config/images";
import { Explorer, Feed, FeedAll } from "../scenes";
import UserRow from "../components/UserRow";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Take Photo", "Take Video", "Choose From Gallery"];
//const options = ["Cancel", "Take Photo", "Choose From Gallery"];
const title = "Upload Feed Photo";

class ExplorerHome extends Component {
	constructor(props) {
		super(props);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.renderRow = this.renderRow.bind(this);
		this.filterByProperty = this.filterByProperty.bind(this);
		this.gotoGallery = this.gotoGallery.bind(this);
		this.gotoPhoto = this.gotoPhoto.bind(this);
		this.gotoFeedVideo = this.gotoFeedVideo.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.handlePress = this.handlePress.bind(this);
		this.onChange = this.onChange.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.addPuffer = this.addPuffer.bind(this);
		this.msgListenerFriends = this.msgListenerFriends.bind(this);
		this.timeout = null;
		this.width = Dimensions.get("window").width;

		this.state = {
			currentPage: 1,
			dataSource: [],
			onSearch: 0,
			searching: 0,
			selected: false,
			upload: 0,
			uploadPercent: 0
		};
	}

	msgListenerFriends(data) {
		if (data["result"] == 0 && data["result_action"] == "search_user_result") {
			this.setState({
				dataSource: [],
				searching: 0,
				selected: !this.state.selected
			});
		}

		if (data["result"] == 1 && data["result_action"] == "file_upload_result") {
			if (data["result_data"]["feed"] == 1) {
				this.props.screenProps.setGlobal("upload", false);
				this.props.screenProps.setGlobal("uploadPercent", 0);
				this.setState({
					upload: 0
				});
			}
		}

		if (data["result"] == 1 && data["result_action"] == "search_user_result") {
			this.setState({
				dataSource: data["result_data"],
				searching: 0,
				selected: !this.state.selected
			});
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.msgListenerFriends);
	}

	componentWillMount() {
		if (this.props.navigation.state.params != null) {
			let currentPage = parseInt(this.props.navigation.state.params.currentPage);
			let upload = this.props.navigation.state.params.upload;
			let uploadImage = this.props.navigation.state.params.uploadImage;
			let uploadVideo = this.props.navigation.state.params.uploadVideo;

			if (currentPage > 0) {
				this.setState({
					currentPage: currentPage
				});
			}
		}
	}

	componentDidMount() {
		this.puffyChannel.on("data_channel", this.msgListenerFriends);
	}

	showMenu() {
		if (this.props.screenProps.global.upload == true) {
			return false;
		}

		this.ActionSheet.show();
	}

	handlePress(i) {
		/*
		if (i == 1) {
			this.gotoPhoto();
		} else if (i == 2) {
			this.gotoGallery();
		} else if (i == 3) {
			this.gotoGallery();
		}
		*/

		if (i == 1) {
			this.gotoPhoto();
		} else if (i == 2) {
			this.gotoFeedVideo();
		} else if (i == 3) {
			this.gotoGallery();
		}
	}

	gotoGallery() {
		let activeFeedItem = this.props.screenProps.global.activeFeedItem;

		if (activeFeedItem !== null && typeof activeFeedItem === "object") {
			activeFeedItem.doPaused();
		}

		this.props.navigation.navigate("Gallery", { feed: 1, gallery: 2 });
	}

	gotoPhoto() {
		let activeFeedItem = this.props.screenProps.global.activeFeedItem;

		if (activeFeedItem !== null && typeof activeFeedItem === "object") {
			activeFeedItem.doPaused();
		}

		this.props.navigation.navigate("Photo", { feed: 1 });
	}

	gotoFeedVideo() {
		let activeFeedItem = this.props.screenProps.global.activeFeedItem;

		if (activeFeedItem !== null && typeof activeFeedItem === "object") {
			activeFeedItem.doPaused();
		}

		this.props.navigation.navigate("Video", { feed: 1 });
	}

	setPage(page_no) {
		if (this.state.currentPage == page_no) {
			return false;
		}

		this.setState({
			currentPage: page_no
		});
	}

	filterByProperty(obj, prop, val) {
		var results = [];

		for (var key in obj) {
			if (obj[key]) {
				if (obj[key].hasOwnProperty(prop) && obj[key][prop].toLowerCase().indexOf(val) >= 0) {
					results.push(obj[key]);
				}
			}
		}

		return results;
	}

	onChange(obj) {
		const $this = this;

		if (obj == "clear") {
			clearTimeout(this.timeout);
			this.setState({
				dataSource: [],
				onSearch: 0
			});
			return false;
		}
		if (typeof obj === "undefined") {
			clearTimeout(this.timeout);
			this.setState({
				dataSource: [],
				onSearch: 1
			});
			let dataString = {
				user_action: "get_search_users",
				user_data: {}
			};

			this.handleEmit(dataString);
			return false;
		} else if (obj.text == null) {
			if (this.state.dataSource.length > 0) {
				return false;
			} else {
				clearTimeout(this.timeout);
				this.setState({
					dataSource: [],
					onSearch: 1
				});
				let dataString = {
					user_action: "get_search_users",
					user_data: {}
				};

				this.handleEmit(dataString);
				return false;
			}
		} else if (obj.text == "") {
			if (this.state.dataSource.length > 0) {
				clearTimeout(this.timeout);
				this.setState({
					dataSource: [],
					onSearch: 1
				});
				let dataString = {
					user_action: "get_search_users",
					user_data: {}
				};

				this.handleEmit(dataString);
				return false;
			} else {
				clearTimeout(this.timeout);
				this.setState({
					dataSource: [],
					onSearch: 1
				});
				let dataString = {
					user_action: "get_search_users",
					user_data: {}
				};

				this.handleEmit(dataString);
				return false;
			}
		}
		let string = obj.text.toLowerCase();

		clearTimeout(this.timeout);

		this.timeout = setTimeout(function() {
			let dataString2 = {
				user_action: "get_search_users",
				user_data: {
					string: string
				}
			};

			$this.handleEmit(dataString2);
		}, 800);
	}

	addPuffer(user_id, index) {
		let dataString = {
			user_action: "like_user",
			user_data: {
				user_id: user_id,
				likedislike: 1
			}
		};

		this.handleEmit(dataString);

		let dataSource = this.state.dataSource;

		dataSource[index].pending_check = 1;

		console.log(dataSource[index]);

		this.setState({
			dataSource: dataSource,
			onSearch: 1,
			selected: !this.state.selected
		});
	}

	gotoProfile(props) {
		props["thumb"] = props.profileImage;
		props["id"] = props.user_id;
		props["name"] = props.user_name;

		this.props.navigation.navigate("Profile", { user: props });
	}

	renderRow({ item, index }) {
		if (item.loc == null || item.loc == "" || item.loc == "Location" || item.loc == "Location (Optional)") {
			item.loc = "United States";
		}

		let newCheck = parseInt(item.new_check);
		let actionBTn = "";

		if (item.friend_check > 0) {
			actionBTn = (
				<View style={styles.btnIcon}>
					<Image style={styles.puffIcon} source={Images.puff_person} />
				</View>
			);
		} else if (item.pending_check > 0) {
			actionBTn = (
				<View style={styles.btnPending}>
					<Text style={styles.btnPendingText}>Pending</Text>
				</View>
			);
		} else {
			actionBTn = (
				<TouchableOpacity style={styles.btnStamp} onPress={() => this.addPuffer(item.user_id, index)}>
					<Image style={styles.btnStampImg} source={Images.puff_stamp} />
				</TouchableOpacity>
			);
		}

		return (
			<UserRow id={item.user_id} name={item.user_name} icon={item.profileImage} location={item.loc} user={item} callback={this.gotoProfile}>
				{actionBTn}
			</UserRow>
		);
	}

	render() {
		let uploadText = "Sending";

		let uploadBarWidth = {
			width: 20
		};

		if (this.props.screenProps.global.uploadPercent == 0) {
			uploadBarWidth = {
				width: this.width * 0.2
			};
			uploadText = "Sending";
		} else if (this.props.screenProps.global.uploadPercent == 1) {
			uploadBarWidth = {
				width: this.width
			};
			uploadText = "Sharing";
		} else if (this.props.screenProps.global.uploadPercent == 0.2) {
			uploadBarWidth = {
				width: this.width * 0.2
			};
			uploadText = "Sending";
		} else if (this.props.screenProps.global.uploadPercent == 0.4) {
			uploadBarWidth = {
				width: this.width * 0.4
			};
			uploadText = "Sending";
		} else if (this.props.screenProps.global.uploadPercent == 0.6) {
			uploadBarWidth = {
				width: this.width * 0.6
			};
			uploadText = "Sending";
		} else if (this.props.screenProps.global.uploadPercent == 0.8) {
			uploadBarWidth = {
				width: this.width * 0.8
			};
			uploadText = "Sharing";
		}

		//console.log(this.props.screenProps.global.uploadPercent);
		//console.log(this.props.screenProps.global.upload);
		//console.log(uploadBarWidth);

		//set the custom component based on state
		return (
			<View style={styles.container}>
				<HeaderSearch
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon="photo_plus"
					LeftCallback={this.showMenu}
					placeholder="Search a user"
					onChange={this.onChange}
					RightIcon="circle_chat"
					RightCallback={() => this.props.navigation.navigate("Messages")}
					unread_count={this.props.screenProps.unread_count}
					global={this.props.screenProps.global}
				/>
				{this.state.onSearch == 1 ? (
					<View style={styles.content}>
						{this.state.dataSource.length > 0 ? (
							<FlatList
								enableEmptySections={true}
								removeClippedSubviews={Platform.OS === "android" ? true : false}
								initialNumToRender={18}
								contentContainerStyle={styles.list}
								keyExtractor={item => item.user_id}
								data={this.state.dataSource}
								renderItem={this.renderRow}
								extraData={this.state.selected}
							/>
						) : (
							<View style={styles.noData}>
								<Image style={styles.noDataImg} source={Images.neutral_big} />
								<Text style={styles.noDataText}>No results</Text>
							</View>
						)}
						<ActionSheet ref={o => (this.ActionSheet = o)} title={title} options={options} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress} />
					</View>
				) : (
					<View style={styles.content}>
						<View style={styles.tabNavContainer}>
							<View style={styles.viewContainerRow}>
								<TopTabIcon selected={this.state.currentPage == 1} off="polaroid_explorer_off" on="polaroid_explorer_on" onPress={() => this.setPage(1)}>
									Explorer
								</TopTabIcon>
								<TopTabIcon selected={this.state.currentPage == 2} off="puff_polaroid_off" on="puff_polaroid_on" onPress={() => this.setPage(2)}>
									Puffers Feed
								</TopTabIcon>
								<TopTabIcon selected={this.state.currentPage == 3} off="polaroid_friends_off" on="polaroid_friends_on" onPress={() => this.setPage(3)}>
									All Feed
								</TopTabIcon>
							</View>
						</View>
						{this.props.screenProps.global.upload == true ? (
							<View style={styles.uploadContainer}>
								<Text style={styles.uploadText}>{uploadText}</Text>
								<View style={[styles.uploadBar, uploadBarWidth]} />
							</View>
						) : null}
						<View style={styles.container}>
							{this.state.currentPage == 1 ? <Explorer navigation={this.props.navigation} screenProps={this.props.screenProps} /> : null}
							{this.state.currentPage == 2 ? <FeedAll navigation={this.props.navigation} screenProps={this.props.screenProps} /> : null}
							{this.state.currentPage == 3 ? <Feed navigation={this.props.navigation} screenProps={this.props.screenProps} /> : null}
						</View>
						<ActionSheet ref={o => (this.ActionSheet = o)} title={title} options={options} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress} />
					</View>
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
	content: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	uploadContainer: {
		paddingTop: 5,
		paddingBottom: 2,
		backgroundColor: "#F8F8F8"
	},
	uploadText: {
		color: "#505050",
		fontFamily: "Helvetica",
		fontSize: 12,
		marginLeft: 8,
		marginBottom: 5
	},
	uploadBar: {
		height: 3,
		backgroundColor: "#00B1BB"
	},
	tabNavContainer: {
		marginTop: 1,
		backgroundColor: "#FAFAFA",
		borderTopWidth: 2,
		borderColor: "#D3D3D3",
		borderBottomWidth: 2,
		borderColor: "#D3D3D3"
	},
	viewContainerRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginLeft: 30,
		marginRight: 30,
		marginTop: 1
	},
	list: {
		marginRight: 5,
		marginLeft: 5,
		marginTop: 5
	},
	btnStamp: {
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2
	},
	btnStampImg: {
		padding: 5,
		width: 100,
		height: 50,
		resizeMode: "contain"
	},
	btnIcon: {
		paddingTop: 15,
		paddingBottom: 10,
		paddingRight: 10,
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.6,
		shadowRadius: 2
	},
	puffIcon: {
		height: 28,
		width: 28,
		resizeMode: "contain"
	},
	btnPending: {
		width: 95,
		height: 30,
		marginTop: 15,
		marginBottom: 15,
		marginLeft: 5,
		marginRight: 5,
		borderRadius: 5,
		backgroundColor: "#BFBFBF",
		justifyContent: "center"
	},
	btnPendingText: {
		color: "#FFF",
		textAlign: "center",
		fontFamily: "Helvetica",
		fontSize: 12,
		fontWeight: "bold",
		letterSpacing: 5,
		marginLeft: 5
	},
	noData: {
		marginTop: 50,
		marginLeft: 10,
		marginRight: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	noDataImg: {
		height: 80,
		width: 80,
		resizeMode: "contain"
	},
	noDataText: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		color: "#777980",
		marginTop: 20,
		marginBottom: 10
	}
};

export { ExplorerHome };
