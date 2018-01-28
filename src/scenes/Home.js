import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, Platform, PushNotificationIOS, Alert, AsyncStorage, Modal } from "react-native";
import { NavigationActions } from "react-navigation";
import ActionSheet from "react-native-actionsheet";
import LinearGradient from "react-native-linear-gradient";
import { BoxShadow } from "react-native-shadow";
import FCM from "react-native-fcm";
import Header from "../components/Header";
import Card from "../components/Card";
import CardStack from "../components/CardStack";
import CirclePref from "../components/CirclePref";
import { CachedImage } from "react-native-img-cache";
import Images from "../config/images";

const DIMENSIONS = Dimensions.get("window");
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

		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.deviceTheme = this.props.screenProps.deviceTheme;
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.homeEventListener = this.homeEventListener.bind(this);
		this.gotoMessages = this.gotoMessages.bind(this);
		this.renderCard = this.renderCard.bind(this);
		this.renderCardX = this.renderCardX.bind(this);

		this.handlePress = this.handlePress.bind(this);
		this.showBlockUser = this.showBlockUser.bind(this);
		this.showReportUser = this.showReportUser.bind(this);
		this.reportUser = this.reportUser.bind(this);
		this.blockUser = this.blockUser.bind(this);
		this.hideModal = this.hideModal.bind(this);

		this.showMenu = this.showMenu.bind(this);
		this.showMenu2 = this.showMenu2.bind(this);
		this.gotoFeedPhoto = this.gotoFeedPhoto.bind(this);
		this.gotoFeedVideo = this.gotoFeedVideo.bind(this);
		this.gotoFeedGallery = this.gotoFeedGallery.bind(this);
		this.handlePress2 = this.handlePress2.bind(this);

		this.lastCard = 0;
		this.card = null;

		this.state = {
			cards: [],
			cardsBack: [],
			actionCheck: false,
			isModalVisible: false,
			isNavigating: false,
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
				if (notif == null) {
					return false;
				}
				if (notif.opened_from_tray) {
					if (notif.from) {
						$this.props.navigation.dispatch(NavigationActions.navigate({ routeName: "NotificationTab" }));
						FCM.removeAllDeliveredNotifications();
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
			let cards = data["result_data"].reverse();
			this.lastCard = cards[0]["id"];

			//console.log(cards);
			let cardsLeft = cards.length;
			const card = cards[cardsLeft - 1];
			this.card = card;

			this.setState({
				cards: cards
			});

			let localData = JSON.stringify(cards);

			if (localData) {
				AsyncStorage.setItem("HomeItems", localData);
			}

			//console.log(cards);
		}

		if (data["result"] == 1 && data["result_action"] == "get_more_dash_result") {
			let cards = data["result_data"].reverse();
			this.lastCard = cards[0]["id"];

			let newCards = [...cards, ...this.state.cards];

			this.setState({
				cards: newCards
			});

			let localData = JSON.stringify(newCards);

			if (localData) {
				AsyncStorage.setItem("HomeItems", localData);
			}

			//console.log(newCards);
		}
	}

	componentDidMount() {
		const $this = this;

		AsyncStorage.getItem("HomeItems", (err, result) => {
			if (!err && result != null) {
				//console.log(result);
				let cards = JSON.parse(result);

				this.setState({
					cards: cards
				});
			}
		});

		let dataString = {
			user_action: "get_dash",
			user_data: {}
		};

		this.handleEmit(dataString);

		this.puffyChannel.on("data_channel", this.homeEventListener);
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.homeEventListener);
	}

	gotoMessages() {
		this.props.navigation.navigate("Messages");
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
		this.ActionSheet.show();
	}

	handlePress2(i) {
		if (i == 1) {
			this.gotoFeedPhoto();
		} else if (i == 2) {
			this.gotoFeedVideo();
		} else if (i == 3) {
			this.gotoFeedGallery();
		}
	}

	handlePress(i) {
		if (this.card == null) {
			return false;
		}

		if (i == 1) {
			this.showBlockUser();
		} else if (i == 2) {
			this.showReportUser();
		}
	}

	showBlockUser() {
		Alert.alert(`Block ${this.card.name}?`, "", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.blockUser() }]);
	}

	showReportUser() {
		this.setState(
			{
				reportTitle: `Report ${this.card.name}?`
			},
			() => {
				this.ActionSheet3.show();
			}
		);
	}

	blockUser() {
		let dataString = {
			user_action: "block_user",
			user_data: {
				user_id: this.card.id
			}
		};

		this.handleEmit(dataString);
		this.swipeLeft();
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
				user_id: this.card.id,
				type: "USER",
				subType: subType
			}
		};

		this.handleEmit(dataString);
		this.swipeLeft();
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

	onSwipeRight = item => {
		if (this.state.actionCheck == true) {
			return false;
		}

		//console.log("on swipe right");

		const $this = this;

		this.state.cards.pop();
		this.setState({
			cards: this.state.cards,
			actionCheck: true
		});

		let cardsLeft = this.state.cards.length;

		const card = this.state.cards[cardsLeft - 1];
		this.card = card;

		console.log(card);

		//check for more cards.
		if (cardsLeft == 2) {
			this.loadMore();
		}

		let dataString = {
			user_action: "like_user",
			user_data: {
				user_id: item.id,
				user_name: item.name,
				likedislike: 1
			}
		};

		//console.log(dataString);

		this.handleEmit(dataString);

		setTimeout(function() {
			$this.setState({ actionCheck: false });
		}, 300);
		//console.log(this.state.cards);
		//console.log(this.lastCard);
	};

	onSwipeLeft = item => {
		if (this.state.actionCheck == true) {
			return false;
		}

		//console.log("on swipe left");

		const $this = this;

		this.state.cardsBack.push(item);
		this.state.cards.pop();

		this.setState({
			cards: this.state.cards,
			cardsBack: this.state.cardsBack,
			actionCheck: true
		});

		let cardsLeft = this.state.cards.length;

		const card = this.state.cards[cardsLeft - 1];
		this.card = card;

		console.log(card);

		//check for more cards.
		if (cardsLeft == 2) {
			this.loadMore();
		}

		let dataString = {
			user_action: "like_user",
			user_data: {
				user_id: item.id,
				user_name: item.name,
				likedislike: 0
			}
		};

		//console.log(dataString);

		this.handleEmit(dataString);

		setTimeout(function() {
			$this.setState({ actionCheck: false });
		}, 300);
		//console.log(this.state.cards);
		//console.log(this.lastCard);
	};

	loadMore = () => {
		//console.log("load more cards");

		let dataString = {
			user_action: "get_dash",
			user_data: {
				user_id: this.lastCard
			}
		};

		this.handleEmit(dataString);
	};

	swipeLeft = () => {
		this.swiper.swipeLeft();
	};

	swipeRight = () => {
		this.swiper.swipeRight();
	};

	swipeBack = () => {
		if (this.state.cardsBack.length == 0) {
			return false;
		}

		const card = this.state.cardsBack.pop();
		this.state.cards.push(card);

		this.setState({
			cards: this.state.cards,
			cardsBack: this.state.cardsBack
		});
	};

	checkPref(pref_name) {
		if (this.props.screenProps.global.user_interest_name1 == pref_name) {
			return 1;
		} else if (this.props.screenProps.global.user_interest_name2 == pref_name) {
			return 1;
		} else if (this.props.screenProps.global.user_interest_name3 == pref_name) {
			return 1;
		} else if (this.props.screenProps.global.user_interest_name4 == pref_name) {
			return 1;
		} else if (this.props.screenProps.global.user_interest_name5 == pref_name) {
			return 1;
		}
		return 0;
	}

	renderCardX(cardObject) {
		let pref_name1_active = this.checkPref(cardObject.i1);
		let pref_name2_active = this.checkPref(cardObject.i2);
		let pref_name3_active = this.checkPref(cardObject.i3);
		let pref_name4_active = this.checkPref(cardObject.i4);
		let pref_name5_active = this.checkPref(cardObject.i5);

		return (
			<View key={cardObject.id} style={styles.cardX}>
				<View style={styles.cardHeaderContainerX}>
					{this.state.cardsBack.length > 0 ? (
						<TouchableOpacity style={styles.backBtn} onPress={this.swipeBack}>
							<Image style={{ width: 25, height: 25, resizeMode: "contain" }} source={Images.circle_back} />
						</TouchableOpacity>
					) : null}
					<TouchableOpacity style={styles.menuBtn} onPress={this.showMenu}>
						<Image style={{ width: 30, height: 30, resizeMode: "contain" }} source={Images.circle_flag} />
					</TouchableOpacity>
				</View>
				<View style={styles.cardImageContainerX}>
					<CachedImage style={styles.cardImageX} source={{ uri: cardObject.file, cache: "force-cache" }} />
					<View style={styles.cardNameContainer}>
						<Text style={styles.nameText}>
							{cardObject.name}, {cardObject.age}
						</Text>
						<Text style={styles.locationText}>{cardObject.loc}</Text>
					</View>
					<Text style={styles.aboutText}>{cardObject.about}</Text>
				</View>
				<View style={styles.interestContainerX}>
					<CirclePref name={cardObject.i1} active={pref_name1_active} />
					<CirclePref name={cardObject.i2} active={pref_name1_active} />
					<CirclePref name={cardObject.i3} active={pref_name1_active} />
					<CirclePref name={cardObject.i4} active={pref_name1_active} />
					<CirclePref name={cardObject.i5} active={pref_name1_active} />
				</View>
				<View style={styles.imgBtnContainerX}>
					<TouchableOpacity style={styles.imgBtnLeft} onPress={this.swipeLeft} disabled={this.state.actionCheck}>
						<Image style={styles.imgBtn} source={Images.pass_stamp} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.imgBtnRight} onPress={this.swipeRight} disabled={this.state.actionCheck}>
						<Image style={styles.imgBtn} source={Images.puff_stamp} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	renderCard(cardObject) {
		//console.log(cardObject);

		let pref_name1_active = this.checkPref(cardObject.i1);
		let pref_name2_active = this.checkPref(cardObject.i2);
		let pref_name3_active = this.checkPref(cardObject.i3);
		let pref_name4_active = this.checkPref(cardObject.i4);
		let pref_name5_active = this.checkPref(cardObject.i5);

		return (
			<View key={cardObject.id} style={styles.card}>
				<View style={styles.cardHeaderContainer}>
					{this.state.cardsBack.length > 0 ? (
						<TouchableOpacity style={styles.backBtn} onPress={this.swipeBack}>
							<Image style={{ width: 28, height: 28, resizeMode: "contain" }} source={Images.circle_back} />
						</TouchableOpacity>
					) : null}
					<TouchableOpacity style={styles.menuBtn} onPress={this.showMenu}>
						<Image style={{ width: 27, height: 27, resizeMode: "contain" }} source={Images.circle_flag} />
					</TouchableOpacity>
				</View>
				<View style={styles.cardImageContainer}>
					<CachedImage style={styles.cardImage} source={{ uri: cardObject.file, cache: "force-cache" }} />
					<View style={styles.cardNameContainer}>
						<Text style={styles.nameText}>
							{cardObject.name}, {cardObject.age}
						</Text>
						<Text style={styles.locationText}>{cardObject.loc}</Text>
					</View>
					<Text style={styles.aboutText}>{cardObject.about}</Text>
				</View>
				<View style={styles.interestContainer}>
					<CirclePref name={cardObject.i1} active={pref_name1_active} />
					<CirclePref name={cardObject.i2} active={pref_name2_active} />
					<CirclePref name={cardObject.i3} active={pref_name3_active} />
					<CirclePref name={cardObject.i4} active={pref_name4_active} />
					<CirclePref name={cardObject.i5} active={pref_name5_active} />
				</View>
				<View style={styles.imgBtnContainer}>
					<TouchableOpacity style={styles.imgBtnLeft} onPress={this.swipeLeft} disabled={this.state.actionCheck}>
						<Image style={styles.imgBtn} source={Images.pass_stamp} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.imgBtnRight} onPress={this.swipeRight} disabled={this.state.actionCheck}>
						<Image style={styles.imgBtn} source={Images.puff_stamp} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<Header
					deviceTheme={this.props.screenProps.deviceTheme}
					LeftIcon="photo_plus"
					LeftCallback={this.showMenu2}
					RightIcon="circle_chat"
					RightCallback={this.gotoMessages}
					unread_count={this.props.screenProps.unread_count}
					global={this.props.screenProps.global}
					devMode={this.props.screenProps.global.devMode}
				/>
				<View style={styles.content}>
					<CardStack
						ref={swiper => {
							this.swiper = swiper;
						}}
						cardList={this.state.cards}
						disable={this.state.actionCheck}
						renderCard={this.deviceTheme == "IphoneX" ? this.renderCardX : this.renderCard}
						cardRotation={20}
						cardOpacity={0.5}
						onSwipeRight={this.onSwipeRight}
						onSwipeLeft={this.onSwipeLeft}
						leftLabel={
							<Image
								style={{
									position: "absolute",
									top: 50,
									right: 20,
									width: 120,
									height: 60,
									resizeMode: "contain",
									transform: [{ rotate: "15deg" }],
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.7,
									shadowRadius: 2
								}}
								source={Images.passed}
							/>
						}
						rightLabel={
							<Image
								style={{
									position: "absolute",
									top: 50,
									left: 20,
									width: 120,
									height: 60,
									resizeMode: "contain",
									transform: [{ rotate: "-15deg" }],
									shadowColor: "#000",
									shadowOffset: { width: 0, height: 2 },
									shadowOpacity: 0.7,
									shadowRadius: 2
								}}
								source={Images.puffed}
							/>
						}
						onSwipeLeftThreshold={-80}
						onSwipeRightThreshold={80}
						leftSwipeThreshold={-150}
						rightSwipeThreshold={150}
						upSwipeThreshold={-150}
						downSwipeThreshold={150}
					/>
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
		flex: 1,
		marginTop: 5
	},
	card: {
		flex: 1,
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: 0,
		paddingBottom: 12,
		borderWidth: 1,
		borderColor: "#EBF1F2",
		borderRadius: 15,
		backgroundColor: "#EBF1F2"
	},
	cardX: {
		flex: 1,
		paddingLeft: 12,
		paddingRight: 12,
		paddingTop: 5,
		paddingBottom: 12,
		borderWidth: 1,
		borderColor: "#EBF1F2",
		borderRadius: 15,
		backgroundColor: "#EBF1F2"
	},
	cardImageContainer: {
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width - 32
	},
	cardImageContainerX: {
		marginTop: 5,
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width + 32
	},
	cardImage: {
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width - 32,
		resizeMode: "contain",
		backgroundColor: "#EBF1F2"
	},
	cardImageX: {
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width + 32,
		resizeMode: "cover",
		backgroundColor: "#EBF1F2"
	},
	cardHeaderContainer: {
		height: 40
	},
	cardHeaderContainerX: {
		height: 40
	},
	backBtn: {
		position: "absolute",
		top: 1,
		left: 0,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.7,
		shadowRadius: 1,
		paddingLeft: 1,
		paddingRight: 10,
		paddingTop: 5,
		paddingBottom: 10,
		borderWidth: 1,
		backgroundColor: "transparent",
		borderColor: "transparent"
	},
	menuBtn: {
		position: "absolute",
		top: 0,
		right: 0,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.7,
		shadowRadius: 1,
		paddingLeft: 10,
		paddingRight: 0,
		paddingTop: 5,
		paddingBottom: 10,
		borderWidth: 1,
		backgroundColor: "transparent",
		borderColor: "transparent"
	},
	cardNameContainer: {
		position: "absolute",
		bottom: 37,
		left: 0
	},
	nameText: {
		color: "#FFFFFF",
		fontFamily: "Helvetica",
		fontSize: 22,
		fontWeight: "bold",
		paddingLeft: 7,
		textShadowColor: "#000",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 5
	},
	locationText: {
		color: "#FFFFFF",
		fontFamily: "Helvetica",
		fontSize: 20,
		paddingBottom: 2,
		paddingLeft: 7,
		textShadowColor: "#000",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 5
	},
	aboutText: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 30,
		paddingTop: 5,
		paddingBottom: 5,
		justifyContent: "center",
		color: "#FFFFFF",
		backgroundColor: "#00000099",
		fontFamily: "Helvetica",
		fontSize: 16,
		textAlign: "center",
		textShadowColor: "#000",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 5
	},
	interestContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 15,
		marginLeft: 20,
		marginRight: 20
	},
	interestContainerX: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 15,
		marginLeft: 20,
		marginRight: 20
	},
	imgBtnContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingLeft: 15,
		paddingRight: 15
	},
	imgBtnContainerX: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingLeft: 15,
		paddingRight: 15
	},
	imgBtnLeft: {
		flex: 1,
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	imgBtnRight: {
		flex: 1,
		marginLeft: 20,
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	imgBtn: {
		width: null,
		height: 60,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	}
};

export { Home };
