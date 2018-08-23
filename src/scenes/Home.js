import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Platform, PushNotificationIOS, Alert, AsyncStorage, Modal } from "react-native";
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
		this.gotoProfile = this.gotoProfile.bind(this);
		this.createCard = this.createCard.bind(this);
		this.renderCard = this.renderCard.bind(this);
		this.renderCardX = this.renderCardX.bind(this);
		this.renderCardSmall = this.renderCardSmall.bind(this);
		this.renderCardAndroid = this.renderCardAndroid.bind(this);

		this.handlePress = this.handlePress.bind(this);
		this.showBlockUser = this.showBlockUser.bind(this);
		this.showReportUser = this.showReportUser.bind(this);
		this.reportUser = this.reportUser.bind(this);
		this.blockUser = this.blockUser.bind(this);
		this.hideModal = this.hideModal.bind(this);

		this.onRefresh = this.onRefresh.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.showMenu2 = this.showMenu2.bind(this);
		this.gotoFeedPhoto = this.gotoFeedPhoto.bind(this);
		this.gotoFeedVideo = this.gotoFeedVideo.bind(this);
		this.gotoFeedGallery = this.gotoFeedGallery.bind(this);
		this.handlePress2 = this.handlePress2.bind(this);
		this.noMoreCards = this.noMoreCards.bind(this);

		this.lastCard = 0;
		this.matchCount = 5;
		this.card = null;

		this.state = {
			cards: [],
			cardsBack: [],
			actionCheck: false,
			isModalVisible: false,
			isNavigating: false,
			isLoaded: 0,
			notFound: 0,
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

		if (data["result"] == 0 && data["result_action"] == "get_swipe_users_result") {
			if (data["matchCount"] == "5") {
				this.matchCount = 5;
			}
			this.noMoreCards();
		}

		if (data["result"] == 1 && data["result_action"] == "get_swipe_users_result") {
			let cards = data["result_data"].reverse();
			this.lastCard = cards[0]["id"];

			let cardsLeft = cards.length;

			if (data["matchCount"] == "5") {
				this.matchCount = 5;
			}

			if (cardsLeft == 0) {
				this.noMoreCards();
			} else {
				this.setState({
					cards: cards,
					notFound: 0,
					isLoaded: 1
				});
				const card = cards[cardsLeft - 1];
				this.card = card;

				let localData = JSON.stringify(cards);

				if (localData) {
					AsyncStorage.setItem("HomeItems", localData);
				}
			}
			//console.log(cards);
		}

		if (data["result"] == 1 && data["result_action"] == "get_more_swipe_users_result") {
			let cards = data["result_data"].reverse();
			this.lastCard = cards[0]["id"];

			let newCards = [...cards, ...this.state.cards];

			this.setState({
				cards: newCards,
				notFound: 0
			});

			let localData = JSON.stringify(newCards);

			if (localData) {
				AsyncStorage.setItem("HomeItems", localData);
			}
		}
	}

	componentDidMount() {
		const $this = this;

		AsyncStorage.getItem("HomeItems", (err, result) => {
			if (!err && result != null) {
				//console.log(result);
				let cards = JSON.parse(result);
				let cardsLeft = cards.length;

				if (cardsLeft > 0) {
					const card = cards[cardsLeft - 1];
					this.card = card;

					this.setState({
						cards: cards,
						notFound: 0
					});
				}
			}
		});

		let dataString = {
			user_action: "get_swipe_users",
			user_data: {
				matchCount: this.matchCount
			}
		};

		this.handleEmit(dataString);

		let dataString2 = {
			user_action: "get_modal",
			user_data: {}
		};

		this.handleEmit(dataString2);

		this.puffyChannel.on("data_channel", this.homeEventListener);
	}

	noMoreCards() {
		this.matchCount = this.matchCount - 1;

		if (this.matchCount <= 0) {
			this.setState({
				cards: [],
				notFound: 1,
				actionCheck: true
			});
			AsyncStorage.removeItem("HomeItems");
		} else {
			let dataString = {
				user_action: "get_swipe_users",
				user_data: {
					matchCount: this.matchCount
				}
			};

			this.handleEmit(dataString);
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.homeEventListener);
	}

	gotoProfile() {
		if (this.state.actionCheck === true) {
			console.log("please wait!");
			return false;
		}
		if (this.state.isNavigating == true) {
			return false;
		}

		const card = this.card;
		const $this = this;

		this.setState({ isNavigating: true }, () => {
			$this.props.navigation.navigate("Profile", { user: card });
			setTimeout(function() {
				$this.setState({ isNavigating: false });
			}, 500);
		});
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

	onRefresh() {
		this.matchCount = 5;

		let dataString = {
			user_action: "get_swipe_users",
			user_data: {
				refresh: 1,
				matchCount: 5
			}
		};

		this.handleEmit(dataString);
		this.setState({ refreshing: true });
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

		let cardsLeft = this.state.cards.length;

		if (cardsLeft == 0) {
			this.noMoreCards();
		} else {
			this.setState({
				cards: this.state.cards,
				actionCheck: true
			});

			const card = this.state.cards[cardsLeft - 1];
			this.card = card;
		}

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

		let cardsLeft = this.state.cards.length;

		if (cardsLeft == 0) {
			this.noMoreCards();
		} else {
			this.setState({
				cards: this.state.cards,
				cardsBack: this.state.cardsBack,
				actionCheck: true
			});

			const card = this.state.cards[cardsLeft - 1];
			this.card = card;
		}

		//console.log(card);

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
			user_action: "get_swipe_users",
			user_data: {
				user_id: this.lastCard,
				matchCount: this.matchCount
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

	createCard(cardObject) {
		if (this.deviceTheme == "IphoneX") {
			return this.renderCardX(cardObject);
		} else if (this.deviceTheme == "IphoneSmall") {
			return this.renderCardSmall(cardObject);
		} else if (this.deviceTheme == "Android") {
			return this.renderCardAndroid(cardObject);
		}
		return this.renderCard(cardObject);
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
						<TouchableOpacity style={styles.backBtnX} onPress={this.swipeBack}>
							<Image style={{ width: 27, height: 27, resizeMode: "contain" }} source={Images.circle_back} />
						</TouchableOpacity>
					) : null}
					<TouchableOpacity style={styles.menuBtn} onPress={this.showMenu}>
						<Image style={{ width: 27, height: 27, resizeMode: "contain" }} source={Images.circle_flag} />
					</TouchableOpacity>
				</View>
				<View style={styles.cardImageContainerX}>
					<TouchableWithoutFeedback disabled={this.state.isNavigating} onPress={this.gotoProfile}>
						<CachedImage style={styles.cardImageX} source={{ uri: cardObject.file, cache: "force-cache" }} />
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback disabled={this.state.isNavigating} onPress={this.gotoProfile}>
						<View style={styles.cardNameContainer}>
							<Text style={styles.nameText}>
								{cardObject.name}, {cardObject.age}
							</Text>
							<Text style={styles.locationText}>{cardObject.loc}</Text>
						</View>
					</TouchableWithoutFeedback>
					<Text style={styles.aboutText}>{cardObject.about}</Text>
				</View>
				<View style={styles.interestContainerX}>
					<CirclePref name={cardObject.i1} active={pref_name1_active} />
					<CirclePref name={cardObject.i2} active={pref_name2_active} />
					<CirclePref name={cardObject.i3} active={pref_name3_active} />
					<CirclePref name={cardObject.i4} active={pref_name4_active} />
					<CirclePref name={cardObject.i5} active={pref_name5_active} />
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

	renderCardSmall(cardObject) {
		let pref_name1_active = this.checkPref(cardObject.i1);
		let pref_name2_active = this.checkPref(cardObject.i2);
		let pref_name3_active = this.checkPref(cardObject.i3);
		let pref_name4_active = this.checkPref(cardObject.i4);
		let pref_name5_active = this.checkPref(cardObject.i5);

		return (
			<View key={cardObject.id} style={styles.card}>
				<View style={styles.cardHeaderContainerSmall}>
					{this.state.cardsBack.length > 0 ? (
						<TouchableOpacity style={styles.backBtn} onPress={this.swipeBack}>
							<Image style={{ width: 21, height: 21, resizeMode: "contain" }} source={Images.circle_back} />
						</TouchableOpacity>
					) : null}
					<TouchableOpacity style={styles.menuBtn} onPress={this.showMenu}>
						<Image style={{ width: 20, height: 20, resizeMode: "contain" }} source={Images.circle_flag} />
					</TouchableOpacity>
				</View>
				<View style={DIMENSIONS.height > 500 ? styles.cardImageContainerSmall : styles.cardImageContainerSmaller}>
					<TouchableWithoutFeedback disabled={this.state.isNavigating} onPress={this.gotoProfile}>
						<CachedImage style={DIMENSIONS.height > 500 ? styles.cardImageSmall : styles.cardImageSmaller} source={{ uri: cardObject.file, cache: "force-cache" }} />
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback disabled={this.state.isNavigating} onPress={this.gotoProfile}>
						<View style={styles.cardNameContainer}>
							<Text style={styles.nameText}>
								{cardObject.name}, {cardObject.age}
							</Text>
							<Text style={styles.locationText}>{cardObject.loc}</Text>
						</View>
					</TouchableWithoutFeedback>
					<Text style={styles.aboutText}>{cardObject.about}</Text>
				</View>
				<View style={styles.interestContainerSmall}>
					<CirclePref name={cardObject.i1} active={pref_name1_active} />
					<CirclePref name={cardObject.i2} active={pref_name2_active} />
					<CirclePref name={cardObject.i3} active={pref_name3_active} />
					<CirclePref name={cardObject.i4} active={pref_name4_active} />
					<CirclePref name={cardObject.i5} active={pref_name5_active} />
				</View>
				<View style={styles.imgBtnContainer}>
					<TouchableOpacity style={styles.imgBtnLeft} onPress={this.swipeLeft} disabled={this.state.actionCheck}>
						<Image style={styles.imgBtnSmall} source={Images.pass_stamp} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.imgBtnRight} onPress={this.swipeRight} disabled={this.state.actionCheck}>
						<Image style={styles.imgBtnSmall} source={Images.puff_stamp} />
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	renderCardAndroid(cardObject) {
		let pref_name1_active = this.checkPref(cardObject.i1);
		let pref_name2_active = this.checkPref(cardObject.i2);
		let pref_name3_active = this.checkPref(cardObject.i3);
		let pref_name4_active = this.checkPref(cardObject.i4);
		let pref_name5_active = this.checkPref(cardObject.i5);

		const btnPassPuffShadow = {
			height: 50,
			width: DIMENSIONS.width * 0.4,
			color: "#000",
			radius: 25,
			opacity: 0.7,
			x: 0.1,
			y: 6.2
		};
		let { file } = cardObject;
		if (file.includes('https://puffy-uploads.s3.amazonaws.com/uploads')){
			file = file.replace('https://puffy-uploads.s3.amazonaws.com/uploads', 'https://s3-us-west-2.amazonaws.com/puffy.assets/uploads/uploads');
		}
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
					<TouchableWithoutFeedback disabled={this.state.isNavigating} onPress={this.gotoProfile}>
						<CachedImage style={styles.cardImage} source={{ uri: file, cache: "force-cache" }} />
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback disabled={this.state.isNavigating} onPress={this.gotoProfile}>
						<View style={styles.cardNameContainer}>
							<Text style={styles.nameText}>
								{cardObject.name}, {cardObject.age}
							</Text>
							<Text style={styles.locationText}>{cardObject.loc}</Text>
						</View>
					</TouchableWithoutFeedback>
					<Text style={styles.aboutText}>{cardObject.about}</Text>
				</View>
				<View style={DIMENSIONS.height > 700 ? styles.interestContainerAndroid : styles.interestContainerAndroidSmall}>
					<CirclePref name={cardObject.i1} active={pref_name1_active} />
					<CirclePref name={cardObject.i2} active={pref_name2_active} />
					<CirclePref name={cardObject.i3} active={pref_name3_active} />
					<CirclePref name={cardObject.i4} active={pref_name4_active} />
					<CirclePref name={cardObject.i5} active={pref_name5_active} />
				</View>
				<View style={styles.imgBtnContainer}>
					<TouchableOpacity style={styles.imgBtnLeft} onPress={this.swipeLeft} disabled={this.state.actionCheck}>
						<BoxShadow setting={btnPassPuffShadow}>
							<Image style={styles.imgBtn} source={Images.pass_stamp} />
						</BoxShadow>
					</TouchableOpacity>
					<TouchableOpacity style={styles.imgBtnRight} onPress={this.swipeRight} disabled={this.state.actionCheck}>
						<BoxShadow setting={btnPassPuffShadow}>
							<Image style={styles.imgBtn} source={Images.puff_stamp} />
						</BoxShadow>
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
					<TouchableWithoutFeedback disabled={this.state.isNavigating} onPress={this.gotoProfile}>
						<CachedImage style={styles.cardImage} source={{ uri: cardObject.file, cache: "force-cache" }} />
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback disabled={this.state.isNavigating} onPress={this.gotoProfile}>
						<View style={styles.cardNameContainer}>
							<Text style={styles.nameText}>
								{cardObject.name}, {cardObject.age}
							</Text>
							<Text style={styles.locationText}>{cardObject.loc}</Text>
						</View>
					</TouchableWithoutFeedback>
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

	notFound() {
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

	render() {
		if (this.state.notFound == 1) {
			return this.notFound();
		}

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
						renderCard={this.createCard}
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
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 0,
		paddingBottom: 12,
		borderWidth: 1,
		borderColor: "#EBF1F2",
		borderRadius: 15,
		backgroundColor: "#EBF1F2"
	},
	cardX: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
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
	cardImageContainerSmall: {
		marginTop: 5,
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width - 32
	},
	cardImageContainerSmaller: {
		marginTop: 5,
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width - 100
	},
	cardImage: {
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width - 32,
		resizeMode: "contain",
		backgroundColor: "#EBF1F2"
	},
	cardImageSmall: {
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width - 32,
		resizeMode: "contain",
		backgroundColor: "#EBF1F2"
	},
	cardImageSmaller: {
		width: DIMENSIONS.width - 32,
		height: DIMENSIONS.width - 100,
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
	cardHeaderContainerSmall: {
		height: 25
	},
	backBtnX: {
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
		paddingTop: 4,
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
	interestContainerSmall: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 10,
		marginBottom: 2,
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
	interestContainerAndroid: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 25,
		marginBottom: 25,
		marginLeft: 20,
		marginRight: 20
	},
	interestContainerAndroidSmall: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginTop: 15,
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
		height: 50,
		resizeMode: "contain",
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.7,
		shadowRadius: 2
	},
	imgBtnSmall: {
		width: null,
		height: 35,
		resizeMode: "contain",
		backgroundColor: "transparent",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.7,
		shadowRadius: 2
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
