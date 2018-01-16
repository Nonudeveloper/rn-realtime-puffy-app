import React, { Component } from "react";
import {
	Modal,
	View,
	Text,
	Image,
	TouchableOpacity,
	TouchableWithoutFeedback,
	AsyncStorage,
	Dimensions,
	ScrollView,
	RefreshControl,
	Alert,
	Platform,
	PushNotificationIOS
} from "react-native";
import { NavigationActions } from "react-navigation";
import ActionSheet from "react-native-actionsheet";
import { CachedImage } from "react-native-img-cache";
import Images from "../config/images";
import Interest from "../components/InterestShadow";
import Header from "../components/Header";
import HideableView from "../components/HideableView";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";

import FCM from "react-native-fcm";

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 2;

const options = ["Cancel", "Block", "Report"];
const title = "";

//const options2 = ["Cancel", "Take Photo", "Choose From Gallery"];
const options2 = ["Cancel", "Take Photo", "Take Video", "Choose From Gallery"];
const title2 = "Upload Feed Photo";

const options3 = ["Cancel", "No Profile Image", "Inappropriate", "Spam"];

class Home extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.updateLocation = this.props.screenProps.updateLocation.bind(this);
		this.setNextItem = this.setNextItem.bind(this);
		this.homeEventListener = this.homeEventListener.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.loadMore = this.loadMore.bind(this);

		this.onPass = this.onPass.bind(this);
		this.onPuff = this.onPuff.bind(this);
		this.goBack = this.goBack.bind(this);
		this.showMenu = this.showMenu.bind(this);

		this.gotoFilters = this.gotoFilters.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.gotoEvents = this.gotoEvents.bind(this);
		this.gotoMessages = this.gotoMessages.bind(this);

		this.handlePress = this.handlePress.bind(this);
		this.showBlockUser = this.showBlockUser.bind(this);
		this.showReportUser = this.showReportUser.bind(this);
		this.reportUser = this.reportUser.bind(this);
		this.blockUser = this.blockUser.bind(this);

		this.showMenu2 = this.showMenu2.bind(this);
		this.gotoFeedPhoto = this.gotoFeedPhoto.bind(this);
		this.gotoFeedVideo = this.gotoFeedVideo.bind(this);
		this.gotoFeedGallery = this.gotoFeedGallery.bind(this);
		this.handlePress2 = this.handlePress2.bind(this);

		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.items = [];
		this.user_id = 0;
		this.user_name = "";

		this.hideModal = this.hideModal.bind(this);

		this.state = {
			notFound: 0,
			isLoaded: 0,
			currentItem: 0,
			reportTitle: "",
			actionCheck: false,
			showPass: false,
			showPuff: false,
			refreshing: false,
			item: [],
			isModalVisible: false,
			modalID: 0,
			modalEventID: 0,
			modalTitle: "",
			modalUrl: ""
		};

		let $this = this;

		if (Platform.OS === "ios") {
			PushNotificationIOS.getInitialNotification().then(function(notification) {
				if (notification != null) {
					$this.props.navigation.dispatch(NavigationActions.navigate({ routeName: "NotificationTab" }));
				}
			});
		} else {
			FCM.getInitialNotification().then(notif => {
				console.log("get initial on home" + notif);
				if (Platform.OS === "android") {
					if (notif.opened_from_tray) {
						$this.props.navigation.dispatch(NavigationActions.navigate({ routeName: "NotificationTab" }));
					}
				}
			});
		}
	}

	homeEventListener(data) {
		const $this = this;

		if (data["result"] == 1 && data["result_action"] == "get_modal_result") {
			const row = data["result_data"];
			//console.log(row);
			this.setState({
				modalID: row["puffy_modal_id"],
				modalTitle: row["puffy_modal_title"],
				modalUrl: row["file_original_url"],
				modalEventID: row["fk_puffy_events_id"],
				isModalVisible: true
			});
		}

		if (data["result"] == 1 && data["result_action"] == "get_dash_result") {
			this.items = data["result_data"];
			const item = this.items[0];
			this.user_id = item.id;
			this.user_name = item.name;
			this.setState({ item: item, currentItem: 0, isLoaded: 1, notFound: 0, refreshing: false, showPass: false, showPuff: false, actionCheck: false });

			let localData = JSON.stringify(item);

			if (localData) {
				AsyncStorage.setItem("HomeItem", localData);
			}
			//for (var i in data["result_data"]) {
			//	var response = Image.prefetch(data["result_data"][i]["file"], () => console.log("Image is being fetched"));
			//	console.log(response);
			//}
		}

		if (data["result"] == 1 && data["result_action"] == "like_user_result") {
			if (data["result_data"].user_id == this.user_id) {
				//puff
				if (data["result_data"].likedislike == 1) {
					this.items.splice(this.state.currentItem, 1);
					this.setNextItem(0);
				} else {
					//pass
					this.setNextItem(1);
				}
			} else {
				//check if user is on the list
				for (var i in this.items) {
					let item = this.items[i];

					//remove from the list
					if (data["result_data"].user_id == item.id) {
						this.items.splice(i, 1);
					}
				}
			}
		}

		if (data["result"] == 1 && data["result_action"] == "get_more_dash_result") {
			for (var i = 0; i < data["result_data"].length; i++) {
				this.items.push(data["result_data"][i]);
			}

			this.setNextItem(1);

			//	for (var i = 0; i < data["result_data"].length; i++) {
			//var response = Image.prefetch(data["result_data"][i]["file"], () => console.log("Image is being fetched"));
			//console.log(response);
			//}
		}
		if (data["result"] == 0 && data["result_action"] == "get_dash_result") {
			this.items = [];
			this.user_id = 0;
			this.user_name = "";

			setTimeout(function() {
				$this.setState({ item: [], currentItem: 0, isLoaded: 1, refreshing: false, notFound: 1, showPass: false, showPuff: false, actionCheck: false });
			}, 150);
		}
	}

	componentDidMount() {
		const $this = this;

		AsyncStorage.getItem("HomeItem", (err, result) => {
			if (!err && result != null) {
				//console.log(result);
				let item = JSON.parse(result);
				$this.user_id = item.id;
				$this.user_name = item.name;
				$this.setState({ item: item, isLoaded: 1, notFound: 0 });
			}
		});

		let dataString = {
			user_action: "get_dash",
			user_data: {}
		};

		this.handleEmit(dataString);

		let dataString2 = {
			user_action: "get_modal",
			user_data: {}
		};

		this.handleEmit(dataString2);

		this.puffyChannel.on("data_channel", this.homeEventListener);
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.homeEventListener);
	}

	showMenu2() {
		if (this.props.screenProps.global.upload == true) {
			return false;
		}

		this.ActionSheet2.show();
	}

	gotoFeedGallery() {
		this.props.navigation.navigate("Gallery", { feed: 1, gallery: 2 });
	}

	gotoFeedPhoto() {
		this.props.navigation.navigate("Photo", { feed: 1 });
	}

	gotoFeedVideo() {
		this.props.navigation.navigate("Video", { feed: 1 });
	}

	showMenu() {
		console.log("show menu");
		this.ActionSheet.show();
	}

	handlePress2(i) {
		/*
		if (i == 1) {
			this.gotoFeedPhoto();
		} else if (i == 2) {
			this.gotoFeedGallery();
		} else if (i == 3) {
			this.gotoFeedGallery();
		}
		*/

		if (i == 1) {
			this.gotoFeedPhoto();
		} else if (i == 2) {
			this.gotoFeedVideo();
		} else if (i == 3) {
			this.gotoFeedGallery();
		}
	}

	handlePress(i) {
		if (i == 1) {
			this.showBlockUser();
		} else if (i == 2) {
			this.showReportUser();
		}
	}

	showBlockUser() {
		Alert.alert(`Block ${this.user_name}?`, "", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.blockUser() }]);
	}

	showReportUser() {
		this.setState(
			{
				reportTitle: `Report ${this.user_name}?`
			},
			() => {
				this.ActionSheet3.show();
			}
		);

		//Alert.alert(`Report ${this.user_name}?`, "", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.reportUser() }]);
	}

	blockUser() {
		let dataString = {
			user_action: "block_user",
			user_data: {
				user_id: this.user_id
			}
		};

		this.handleEmit(dataString);

		this.items.splice(this.state.currentItem, 1);
		this.setNextItem(0);
	}

	reportUser(i) {
		let subType = "";

		if (i == 1) {
			subType = "NO PROFILE IMAGE";
		} else if (i == 2) {
			subType = "INAPPROPRIATE PROFILE";
		} else if (i == 3) {
			subType = "SPAM";
		} else {
			return false;
		}

		let dataString = {
			user_action: "report_user",
			user_data: {
				user_id: this.user_id,
				type: "USER",
				subType: subType
			}
		};

		this.handleEmit(dataString);

		this.items.splice(this.state.currentItem, 1);
		this.setNextItem(0);
	}

	gotoProfile() {
		if (this.state.actionCheck === true) {
			console.log("please wait!");
			return false;
		}
		console.log(this.user_id);
		this.props.navigation.navigate("Profile", { user: this.state.item });
	}

	gotoFilters() {
		this.props.navigation.navigate("Filter", { home: 1 });
	}

	gotoEvents() {
		this.props.navigation.navigate("EventsHome");
	}

	gotoMessages() {
		this.props.navigation.navigate("Messages");
	}

	goBack() {
		let nextItem = this.state.currentItem - 1;
		const item = this.items[nextItem];

		//this.setState({ item: [] });

		const $this = this;

		setTimeout(function() {
			$this.user_id = item.id;
			$this.user_name = item.name;
			$this.setState({ item: item, currentItem: nextItem, isLoaded: 1, refreshing: false, notFound: 0, showPass: false, showPuff: false, actionCheck: false });
		}, 50);
	}

	setNextItem(addNext) {
		let nextItem = this.state.currentItem;

		if (addNext === 1) {
			nextItem = this.state.currentItem + 1;
		}

		const item = this.items[nextItem];

		if (item == null) {
			this.loadMore();
			return false;
		}

		const $this = this;

		setTimeout(function() {
			$this.user_id = item.id;
			$this.user_name = item.name;
			$this.setState({ item: item, currentItem: nextItem, isLoaded: 1, refreshing: false, notFound: 0 });

			let localData = JSON.stringify(item);

			if (localData) {
				AsyncStorage.setItem("HomeItem", localData);
			}
		}, 50);

		setTimeout(function() {
			$this.setState({ refreshing: false, showPass: false, showPuff: false });
		}, 150);

		setTimeout(function() {
			$this.setState({ actionCheck: false });
		}, 450);
	}

	loadMore() {
		let dataString = {
			user_action: "get_dash",
			user_data: {
				user_id: this.user_id
			}
		};

		this.handleEmit(dataString);

		const $this = this;

		//setTimeout(function() {
		$this.setState({ refreshing: true, actionCheck: true });
		//}, 50);
	}

	onRefresh() {
		let dataString = {
			user_action: "get_dash",
			user_data: {
				refresh: 1
			}
		};

		this.handleEmit(dataString);
		this.setState({ refreshing: true });
	}

	onPass() {
		if (this.state.actionCheck === true) {
			console.log("please wait!");
			return false;
		}

		let user_id = this.user_id;

		let dataString = {
			user_action: "like_user",
			user_data: {
				user_id: user_id,
				likedislike: 0
			}
		};

		this.handleEmit(dataString);
		this.setState({ showPass: true, actionCheck: true });

		const $this = this;

		//to fix if server is slow.
		setTimeout(function() {
			if ($this.state.actionCheck === true && user_id == $this.user_id) {
				$this.setState({ showPass: false, actionCheck: false });
			}
		}, 5000);
	}

	onPuff() {
		if (this.state.actionCheck === true) {
			console.log("please wait!");
			return false;
		}

		let user_id = this.user_id;
		let user_name = this.user_name;

		let dataString = {
			user_action: "like_user",
			user_data: {
				user_id: this.user_id,
				user_name: this.user_name,
				likedislike: 1
			}
		};

		this.handleEmit(dataString);
		this.setState({ showPuff: true, actionCheck: true });

		const $this = this;

		//to fix if server is slow.
		setTimeout(function() {
			if ($this.state.actionCheck === true && user_id == $this.user_id) {
				$this.setState({ showPuff: false, actionCheck: false });
			}
		}, 5000);
	}

	notLoaded() {
		return (
			<View style={styles.container}>
				<Header
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon="white_add_photo_button"
					LeftCallback={this.showMenu2}
					RightIcon="white_plane_button"
					RightCallback={this.gotoMessages}
					unread_count={this.props.screenProps.unread_count}
					global={this.props.screenProps.global}
				/>
				<ActionSheet
					ref={o => (this.ActionSheet = o)}
					options={options}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
				<ActionSheet ref={o => (this.ActionSheet2 = o)} title={title2} options={options2} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress2} />
				<ActionSheet ref={o => (this.ActionSheet3 = o)} title={this.state.reportTitle} options={options3} cancelButtonIndex={CANCEL_INDEX} onPress={this.reportUser} />
			</View>
		);
	}

	notFound() {
		return (
			<View style={styles.container}>
				<Header
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon="white_add_photo_button"
					LeftCallback={this.showMenu2}
					RightIcon="white_plane_button"
					RightCallback={this.gotoMessages}
					unread_count={this.props.screenProps.unread_count}
					global={this.props.screenProps.global}
				/>
				<View style={styles.errorContainer}>
					<TouchableOpacity onPress={this.onRefresh}>
						<Image style={styles.errorIcon} source={Images.ref} />
					</TouchableOpacity>
					<Text style={styles.errorHeader}>Want to see more Puffers?</Text>
					<Text style={styles.errorText}>Click the Refresh button above</Text>
				</View>
				<ActionSheet
					ref={o => (this.ActionSheet = o)}
					options={options}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
				<ActionSheet ref={o => (this.ActionSheet2 = o)} title={title2} options={options2} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress2} />
				<ActionSheet ref={o => (this.ActionSheet3 = o)} title={this.state.reportTitle} options={options3} cancelButtonIndex={CANCEL_INDEX} onPress={this.reportUser} />
			</View>
		);
	}

	hideModal() {
		let modalEventID = parseInt(this.state.modalEventID);

		let dataString = {
			user_action: "get_modal",
			user_data: {
				read_modal: 1,
				modal_id: this.state.modalID
			}
		};

		this.handleEmit(dataString);
		this.setState({ isModalVisible: false, modalEventID: 0 });

		//land of the event.
		if (modalEventID > 0) {
			this.props.navigation.navigate("EventsView", { events_id: modalEventID, events_type: 1 });
		}
	}

	render() {
		if (this.state.isLoaded === 0) {
			return this.notLoaded();
		}
		if (this.state.notFound == 1) {
			return this.notFound();
		}
		if (this.state.item == null) {
			return this.notLoaded();
		}

		const btnPassPuffShadow = {
			height: 50,
			width: Dimensions.get("window").width * 0.43,
			color: "#000",
			radius: 25,
			opacity: 0.7,
			x: 0.1,
			y: 6.2
		};

		return (
			<View style={styles.container}>
				<Header
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon="white_add_photo_button"
					LeftCallback={this.showMenu2}
					RightIcon="white_plane_button"
					RightCallback={this.gotoMessages}
					unread_count={this.props.screenProps.unread_count}
					global={this.props.screenProps.global}
					devMode={this.props.screenProps.global.devMode}
				/>

				<View style={styles.content}>
					<CachedImage style={styles.photo} source={{ uri: this.state.item.file, cache: "force-cache" }} />
					<CachedImage
						style={{ position: "absolute", top: 0, right: 0, width: 1, height: 1, resizeMode: "cover" }}
						source={{ uri: this.state.item.thumb, cache: "force-cache" }}
					/>
					<HideableView visible={this.state.showPuff} style={styles.stampContainer}>
						<Image style={{ width: 240, height: 120, resizeMode: "contain" }} source={Images.puffed} />
					</HideableView>

					<HideableView visible={this.state.showPass} style={styles.stampContainer}>
						<Image style={{ width: 240, height: 120, resizeMode: "contain" }} source={Images.passed} />
					</HideableView>

					<TouchableWithoutFeedback onPress={this.gotoProfile}>
						<View style={styles.detailOpen} />
					</TouchableWithoutFeedback>

					<View style={styles.detailContainer}>
						<TouchableOpacity onPress={this.gotoProfile}>
							<Text style={styles.nameText}>
								{this.state.item.name}, {this.state.item.age}
							</Text>
						</TouchableOpacity>
						<Text style={styles.locationText}>{this.state.item.loc}</Text>
						<Text style={styles.aboutText}>{this.state.item.about}</Text>
						<View style={styles.interestRow}>
							<Interest name={this.state.item.i1} />
							<Interest name={this.state.item.i2} />
							<Interest name={this.state.item.i3} />
							<Interest name={this.state.item.i4} />
							<Interest name={this.state.item.i5} />
						</View>
					</View>

					{this.state.refreshing == true ? (
						<View style={styles.contentRefreshContainer}>
							<ScrollView
								style={styles.contentRefresh}
								contentContainerStyle={styles.contentContainerRefresh}
								refreshControl={
									<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} tintColor="#FFF" colors={["#57BBC7", "#57BBC7", "#57BBC7"]} />
								}
							/>
						</View>
					) : null}

					{this.state.currentItem > 0 ? (
						<TouchableOpacity style={styles.backBtn} onPress={this.goBack}>
							<Image style={{ width: 25, height: 25, resizeMode: "contain" }} source={Images.back2} />
						</TouchableOpacity>
					) : null}
					<TouchableOpacity style={styles.menuBtn} onPress={this.showMenu}>
						<Image style={{ width: 30, height: 30, resizeMode: "contain" }} source={Images.red_flag} />
					</TouchableOpacity>
				</View>

				{this.props.screenProps.deviceTheme == "Android" ? (
					<View style={styles.action}>
						<TouchableOpacity style={styles.btnContainerLeft} onPress={this.onPass} disabled={this.state.actionCheck}>
							<BoxShadow setting={btnPassPuffShadow}>
								<Image style={styles.stampBtn} source={Images.pass_stamp} />
							</BoxShadow>
						</TouchableOpacity>
						<TouchableOpacity style={styles.btnContainerRight} onPress={this.onPuff} disabled={this.state.actionCheck}>
							<BoxShadow setting={btnPassPuffShadow}>
								<Image style={styles.stampBtn} source={Images.puff_stamp} />
							</BoxShadow>
						</TouchableOpacity>
					</View>
				) : (
					<View style={styles.action}>
						<TouchableOpacity style={styles.btnContainerLeft} onPress={this.onPass} disabled={this.state.actionCheck}>
							<Image style={styles.stampBtn} source={Images.pass_stamp} />
						</TouchableOpacity>
						<TouchableOpacity style={styles.btnContainerRight} onPress={this.onPuff} disabled={this.state.actionCheck}>
							<Image style={styles.stampBtn} source={Images.puff_stamp} />
						</TouchableOpacity>
					</View>
				)}

				<ActionSheet
					ref={o => (this.ActionSheet = o)}
					options={options}
					destructiveButtonIndex={DESTRUCTIVE_INDEX}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.handlePress}
				/>
				<ActionSheet ref={o => (this.ActionSheet2 = o)} title={title2} options={options2} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress2} />
				<ActionSheet ref={o => (this.ActionSheet3 = o)} title={this.state.reportTitle} options={options3} cancelButtonIndex={CANCEL_INDEX} onPress={this.reportUser} />
				<Modal
					visible={this.state.isModalVisible}
					animationType="slide"
					transparent={true}
					onRequestClose={() => {
						this.hideModal;
					}}
				>
					<View style={styles.photoModal}>
						<LinearGradient
							start={{ x: 0.0, y: 0.25 }}
							end={{ x: 0.0, y: 1.0 }}
							locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
							colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
							style={styles.modalHeader}
						>
							<Text style={styles.modalHeaderText}>{this.state.modalTitle}</Text>
						</LinearGradient>
						<TouchableOpacity style={styles.modalBtn} onPress={this.hideModal}>
							<Image style={styles.photo} source={{ uri: this.state.modalUrl }} />
						</TouchableOpacity>
					</View>
				</Modal>
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
		flex: 1
	},
	contentRefreshContainer: {
		position: "absolute",
		top: 60,
		left: 0,
		right: 0,
		justifyContent: "center",
		alignItems: "center"
	},
	contentRefresh: {
		width: 100,
		height: 100
	},
	modalBtn: {
		flex: 1,
		backgroundColor: "#FFF"
	},
	modalHeaderText: {
		fontSize: 16,
		fontFamily: "Helvetica",
		color: "#FFF",
		marginLeft: 15,
		marginRight: 15,
		marginTop: 10,
		marginBottom: 10
	},
	photoModal: {
		flex: 1,
		marginLeft: 30,
		marginRight: 30,
		marginTop: 110,
		marginBottom: 110,
		borderWidth: 1,
		borderColor: "#FFF"
	},
	photo: {
		flex: 1
	},
	backBtn: {
		position: "absolute",
		top: 8,
		left: 0,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.7,
		shadowRadius: 2,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
		borderWidth: 1,
		backgroundColor: "transparent",
		borderColor: "transparent"
	},
	menuBtn: {
		position: "absolute",
		top: 8,
		right: 0,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.9,
		shadowRadius: 2,
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 8,
		paddingBottom: 10,
		borderWidth: 1,
		backgroundColor: "transparent",
		borderColor: "transparent"
	},
	detailOpen: {
		position: "absolute",
		top: 80,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "transparent"
	},
	btnContainerLeft: {
		flex: 1,
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	btnContainerRight: {
		flex: 1,
		marginLeft: 20,
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	stampContainer: {
		position: "absolute",

		top: 0,
		bottom: 80,
		left: 0,
		right: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	stampBtn: {
		width: null,
		height: 60,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.7,
		shadowRadius: 2,
		...Platform.select({
			android: {
				width: Dimensions.get("window").width * 0.43,
				height: 55
			}
		})
	},
	detailContainer: {
		position: "absolute",
		bottom: 63,
		left: 0,
		right: 0,
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	nameText: {
		color: "#FFFFFF",
		fontFamily: "Helvetica",
		fontSize: 24,
		fontWeight: "bold",
		paddingLeft: 10,
		textShadowColor: "#000",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 5
	},
	locationText: {
		color: "#FFFFFF",
		fontFamily: "Helvetica",
		fontSize: 20,
		paddingBottom: 2,
		paddingLeft: 10,
		textShadowColor: "#000",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 5
	},
	aboutText: {
		height: 30,
		color: "#FFFFFF",
		backgroundColor: "#60606050",
		fontFamily: "Helvetica",
		fontSize: 16,
		textAlign: "center",
		paddingLeft: 10,
		paddingTop: 5,
		paddingBottom: 4,
		textShadowColor: "#000",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 5
	},
	interestRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 7,
		marginBottom: 7,
		marginLeft: 70,
		marginRight: 70
	},
	action: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingLeft: 15,
		paddingRight: 15,
		position: "absolute",
		bottom: 10,
		left: 0,
		right: 0,
		backgroundColor: "transparent"
	},
	btnPass: {
		flex: 1,
		borderColor: "#E97E4F",
		borderWidth: 4,
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 20,
		paddingTop: 5,
		paddingBottom: 5
	},
	btnPassText: {
		color: "#E97E4F",
		fontSize: 24,
		fontWeight: "bold",
		fontFamily: "Helvetica",
		textAlign: "center",
		letterSpacing: 5,
		marginLeft: 5
	},
	btnPuff: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 5,
		borderColor: "#57BBC7",
		borderWidth: 4,
		borderRadius: 8,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center"
	},
	btnPuffText: {
		color: "#57BBC7",
		fontSize: 24,
		fontWeight: "bold",
		fontFamily: "Helvetica",
		textAlign: "center",
		letterSpacing: 5,
		marginLeft: 5
	},
	errorContainer: {
		marginTop: 50,
		justifyContent: "center",
		alignItems: "center"
	},
	errorIcon: {
		height: 75,
		width: 75,
		resizeMode: "contain"
	},
	errorHeader: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		color: "#777980",
		marginTop: 10,
		marginBottom: 10
	},
	errorText: {
		fontSize: 14,
		textAlign: "center",
		color: "#777980"
	}
};

export { Home };
