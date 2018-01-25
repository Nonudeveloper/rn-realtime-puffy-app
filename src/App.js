import React, { Component } from "react";
import { AsyncStorage, Alert, View, Text, Image, AppState, TouchableOpacity, Platform, Dimensions, PushNotificationIOS, Linking, NetInfo, Modal } from "react-native";
import { NavigationActions } from "react-navigation";
import io from "socket.io-client";
import PushNotification from "react-native-push-notification";
import Geocoder from "react-native-geocoder";
import Auth from "./nav/Auth";
import Tab from "./nav/Tab";
import CompleteProfile from "./nav/CompleteProfile";
import NoPhoto from "./nav/NoPhoto";
import Images from "./config/images";
import { Begin, MyGender, Preferences, Filter, Gps } from "./scenes";
import LinearGradient from "react-native-linear-gradient";
import config from "./config/config";
import Permissions from "react-native-permissions";
import RNRestart from "react-native-restart";
import { setJSExceptionHandler } from "react-native-exception-handler";
import ajaxPostDev from "./lib/ajaxPostDev";
import appsFlyer from "react-native-appsflyer";

import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from "react-native-fcm";

const FBSDK = require("react-native-fbsdk");
const { LoginManager } = FBSDK;

const APP_VERSION = "11.76";
const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

class App extends Component {
	constructor(props) {
		super(props);

		this.appVersion = APP_VERSION;
		this.logout = this.logout.bind(this);
		this.bug = this.bug.bind(this);
		this.connectSocket = this.connectSocket.bind(this);
		this.handleConnectionChange = this.handleConnectionChange.bind(this);
		this.appEventListener = this.appEventListener.bind(this);
		this.handleEmit = this.handleEmit.bind(this);
		this.getLocation = this.getLocation.bind(this);
		this.getUserProfile = this.getUserProfile.bind(this);
		this.updateLocation = this.updateLocation.bind(this);
		this.loginUser = this.loginUser.bind(this);
		this.loginUserAdmin = this.loginUserAdmin.bind(this);
		this.setGlobal = this.setGlobal.bind(this);
		this._onNavigationStateChange = this._onNavigationStateChange.bind(this);
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
		this.setPufferModalVisible = this.setPufferModalVisible.bind(this);
		this.gotoPufferModalMessage = this.gotoPufferModalMessage.bind(this);

		this.backgroundNotification = null;
		this.puffyChannel = null;
		this.navigator;

		if (aspectRatio > 2.1) {
			this.deviceTheme = "IphoneX"; //Iphone X
		} else if (Platform.OS === "android") {
			this.deviceTheme = "Android"; //Android
		} else if (aspectRatio <= 1.775) {
			this.deviceTheme = "IphoneSmall"; //Iphone SE
		} else {
			this.deviceTheme = "Iphone"; //Iphone 6, Iphone 6 plus
		}

		this.state = {
			routeName: 0,
			routeIndex: 0,
			isLogged: false,
			isLoaded: false,
			isUserLoaded: false,
			user_id: 0,
			user_email: "",
			user_name: "",
			user_firstlast: "",
			user_age: "",
			user_location: "",
			user_token: "",
			user_aboutme: "",
			user_interest_name1: "",
			user_interest_name2: "",
			user_interest_name3: "",
			user_interest_name4: "",
			user_interest_name5: "",
			user_gender: null,
			user_thumb: null,
			user_admin: 0,
			unread_count: 0,
			push_token: null,
			push_token_android: 0,
			notification_count: 0,
			gender_check: 1,
			username_check: 1,
			file_check: 1,
			filter_check: 1,
			interest_check: 1,
			complete_check: 0,
			pufferModalVisible: false,
			pufferModalThumb: null,
			pufferModalID: null,
			pufferModalName: null,
			locations: [],
			lat: 0,
			lng: 0,
			street: "",
			city: "",
			state_code: "",
			cityState: "",
			cityStateCountry: "",
			zip: "",
			country: "",
			gpsError: 0,
			socketio: false,
			networkStatus: true,
			devMode: 0,
			upload: false,
			uploadPercent: 0,
			appState: AppState.currentState
		};

		let $this = this;

		if (Platform.OS === "ios") {
			PushNotificationIOS.requestPermissions();

			PushNotificationIOS.addEventListener("register", function(token) {
				$this.setState({ push_token: token });
			});

			PushNotificationIOS.addEventListener("registrationError", function(token) {
				//console.log(token);
			});

			PushNotificationIOS.addEventListener("notification", function(notification) {
				if (AppState.currentState === "background") {
					$this.backgroundNotification = notification;
				}
			});
		} else {
			console.ignoredYellowBox = ["Setting a timer"];

			// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
			FCM.on(FCMEvent.Notification, async notif => {
				// there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
				if (notif.local_notification) {
					//this is a local notification
				}
				if (notif.opened_from_tray) {
					if (notif.from) {
						this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName: "NotificationTab" }));
						FCM.removeAllDeliveredNotifications();
					}

					//iOS: app is open/resumed because user clicked banner
					//Android: app is open/resumed because user clicked banner or tapped app icon
				}
				// await someAsyncCall();
			});
			FCM.on(FCMEvent.RefreshToken, token => {
				//console.log(token);
				// fcm token may not be available on first load, catch it here
			});

			FCM.requestPermissions()
				.then(() => console.log("granted"))
				.catch(() => console.log("notification permission rejected"));

			FCM.getFCMToken().then(token => {
				//console.log("my token" + token);
				// store fcm token in your server
				$this.setState({
					push_token: token,
					push_token_android: 1
				});
			});
		}

		const errorHandler = (e, isFatal) => {
			if (isFatal) {
				let dataString = { user_id: this.state.user_id, page: this.state.routeName, name: e.name, message: e.message, version: APP_VERSION };

				ajaxPostDev(dataString, "crashReport", function(result) {});

				Alert.alert(
					"Unexpected error occurred",
					"Our team has been notified about your error discovery. Please re-open your app by clicking the button below. Thank you.",
					[
						{
							text: "Restart",
							onPress: () => {
								RNRestart.Restart();
							}
						}
					]
				);
			} else {
				console.log(e); // So that we can see it in the ADB logs in case of Android if needed
			}
		};
		setJSExceptionHandler(errorHandler);
	}

	handleEmit = dataString => {
		dataString["user_data"]["UserID"] = this.state.user_id;
		dataString["user_data"]["UserToken"] = this.state.user_token;
		dataString["user_data"]["device"] = Platform.OS;
		//console.log(dataString);

		this.puffyChannel.emit(dataString["user_action"], dataString["user_data"]);

		if (dataString["user_action"] == "like_user" && dataString["user_data"]["likedislike"] == 1) {
			appsFlyer.trackEvent(
				"PUFF_USER",
				{ username: dataString["user_data"]["user_name"] },
				result => {
					//console.log(result);
				},
				error => {
					//console.error(error);
				}
			);
		} else if (dataString["user_action"] == "approve_deny_pending_user_like" && dataString["user_data"]["approvedeny"] == 1) {
			appsFlyer.trackEvent(
				"PUFF_BACK_USER",
				{ username: dataString["user_data"]["user_name"] },
				result => {
					//console.log(result);
				},
				error => {
					//console.error(error);
				}
			);
		} else if (dataString["user_action"] == "approve_deny_pending_user_like" && dataString["user_data"]["approvedeny"] == -1) {
			appsFlyer.trackEvent(
				"PUFF_DENY_USER",
				{ username: dataString["user_data"]["user_name"] },
				result => {
					//console.log(result);
				},
				error => {
					//console.error(error);
				}
			);
		}
	};

	bug = log_string => {
		//console.log(log_string);
	};

	findUser = () => {
		let dataString = {
			user_action: "get_dash",
			user_data: {}
		};

		this.handleEmit(dataString);
	};

	getExplorer = () => {
		let dataString = {
			user_action: "get_explorer_users",
			user_data: {}
		};

		this.handleEmit(dataString);
	};

	getFriendCount = () => {
		let dataString = {
			user_action: "get_friend_count",
			user_data: {}
		};

		this.handleEmit(dataString);
	};

	updateLocation() {
		//console.log("update location called");
		const $this = this;

		this.getLocation(function(position) {
			let dataString2 = {
				user_action: "update_gps",
				user_data: {
					lat: $this.state.lat,
					lng: $this.state.lng,
					street: $this.state.street,
					city: $this.state.city,
					state: $this.state.state_code,
					zip: $this.state.zip,
					country: $this.state.country,
					app_version: $this.appVersion
				}
			};

			$this.handleEmit(dataString2);

			let lat = parseFloat(parseFloat($this.state.lat).toFixed(2));
			let lng = parseFloat(parseFloat($this.state.lng).toFixed(2));

			if (Platform.OS === "ios") {
				appsFlyer.trackLocation(lat, lng, (error, coords) => {
					if (error) {
						//console.error(error);
					} else {
						//console.log(coords);
					}
				});
			}
		});
	}

	getUserProfile() {
		const $this = this;

		let dataString = {
			user_action: "get_my_user",
			user_data: {
				update_push: 1,
				push_token: $this.state.push_token,
				app_version: $this.appVersion,
				push_token_android: $this.state.push_token_android
			}
		};

		this.handleEmit(dataString);
	}

	logout = () => {
		this.handleEmit({
			user_action: "logout_user",
			user_data: {}
		});

		AsyncStorage.removeItem("UserID");
		AsyncStorage.removeItem("UserToken");

		AsyncStorage.removeItem("HomeItem");
		AsyncStorage.removeItem("UserProfile");
		AsyncStorage.clear();

		PushNotification.setApplicationIconBadgeNumber(0);

		this.puffyChannel.removeListener("data_channel", this.appEventListener);
		this.setState({ isLoaded: true, isLogged: false, isUserLoaded: false, user_id: 0, complete_check: 0, user_thumb: null });

		LoginManager.logOut();
	};

	getCurrentRouteName(navigationState, index) {
		if (!navigationState) {
			return null;
		}

		const route = navigationState.routes[navigationState.index];
		// dive into nested navigators
		if (route.routes) {
			return this.getCurrentRouteName(route, index);
		}
		return route.routeName + index;
	}

	_onNavigationStateChange(prevState, newState, action) {
		if (prevState.index != 3 && newState.index == 3) {
			let dataString = {
				user_action: "read_notificatons",
				user_data: {}
			};

			this.handleEmit(dataString);
			PushNotification.setApplicationIconBadgeNumber(0);
		} else if (prevState.index != 4 && newState.index == 4) {
			this.getFriendCount();
		}

		const routeName = this.getCurrentRouteName(newState, newState.index);
		this.setState({ routeName: routeName, routeIndex: newState.index });
	}

	appOpenedByNotificationTap(backgroundNotification) {
		//console.log(backgroundNotification);
		this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName: "NotificationTab" }));
	}

	getLocation(callback) {
		//Only track logged in users.
		if (this.state.isUserLoaded === false) {
			return false;
		}

		Permissions.check("location").then(response => {
			if (response == "undetermined") {
				this.setState({ gpsError: 1, isLoaded: true });

				Permissions.request("location").then(response2 => {
					if (response2 == "denied") {
					} else {
						this.setState({ gpsError: 0, isLoaded: true });
					}
				});
			} else if (response == "denied") {
				this.setState({ gpsError: 1, isLoaded: true });
			} else {
				this.setState({ gpsError: 0 });
			}

			navigator.geolocation.getCurrentPosition(
				position => {
					let pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};

					Geocoder.geocodePosition(pos)
						.then(res => {
							let address = res[0];
							let city = address.locality;
							let country = address.country;

							if (country == null) {
								country = "USA";
							} else {
								country = country.replace(/United States$/, "USA");
							}

							if (city == null) {
								city = address.subAdminArea;
							}

							let streetName = address.streetNumber + " " + address.streetName;
							let cityState = city + ", " + address.adminArea;
							let cityStateCountry = cityState + ", " + country;

							//console.log(cityStateCountry);

							this.setState(
								{
									lat: position.coords.latitude,
									lng: position.coords.longitude,
									street: streetName,
									city: city,
									state_code: address.adminArea,
									cityState: cityState,
									cityStateCountry: cityStateCountry,
									zip: address.postalCode,
									country: country
								},
								() => {
									callback(position);
								}
							);
						})
						.catch(err => console.log(err));
				},
				error => console.log(error),
				{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
			);
		});
	}

	_handleAppStateChange = nextAppState => {
		//console.log(nextAppState);

		if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
			//console.log(this.state.isLogged);

			//update gps when user opens app and logged in already.
			if (this.state.isLogged === true) {
				this.getUserProfile();

				//update location
				if (this.state.complete_check == 1) {
					this.updateLocation();
				}
			}
		}

		if (nextAppState === "active" && this.backgroundNotification != null) {
			this.appOpenedByNotificationTap(this.backgroundNotification);
			this.backgroundNotification = null;
		}

		this.setState({ appState: nextAppState });
	};

	componentDidMount() {
		AsyncStorage.getItem("UserProfile", (err, result) => {
			if (!err && result != null) {
				let user_profile = JSON.parse(result);
				let filter_check = 1;
				let interest_check = 1;
				let username_check = 1;
				let gender_check = 1;
				let file_check = 1;
				let file_id = parseInt(user_profile["file_id"]);

				if (user_profile["user_name"] == null) {
					username_check = 0;
				} else if (user_profile["user_gender"] == null) {
					gender_check = 0;
				} else if (user_profile["user_position_updated_date"] == null) {
					gender_check = 0;
				} else if (user_profile["user_filter_gender"] == null) {
					filter_check = 0;
				} else if (user_profile["user_interest_name1"] == null) {
					interest_check = 0;
				} else if (!file_id > 0) {
					file_check = 0;
				}

				this.setState({
					user_gender: user_profile["user_gender"],
					user_name: user_profile["user_name"],
					user_firstlast: user_profile["user_firstlast"],
					user_age: user_profile["user_age"],
					user_aboutme: user_profile["user_aboutme"],
					user_location: user_profile["user_location"],
					user_thumb: user_profile["file_thumbnail_url"],
					user_interest_name1: user_profile["user_interest_name1"],
					user_interest_name2: user_profile["user_interest_name2"],
					user_interest_name3: user_profile["user_interest_name3"],
					user_interest_name4: user_profile["user_interest_name4"],
					user_interest_name5: user_profile["user_interest_name5"],
					unread_count: parseInt(user_profile["unread_count"]),
					notification_count: parseInt(user_profile["notification_count"]),
					locations: user_profile["location"],
					user_admin: user_profile["user_admin"],
					username_check: username_check,
					gender_check: gender_check,
					file_check: file_check,
					filter_check: filter_check,
					interest_check: interest_check
				});
			}
		});

		NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectionChange);
		AppState.addEventListener("change", this._handleAppStateChange);

		const options = {
			devKey: "qv5agV7YSBoHJJuHYTU5jV",
			appId: "1198078240",
			isDebug: false
		};

		appsFlyer.initSdk(
			options,
			result => {
				//console.log(result);
			},
			error => {
				//console.error(error);
			}
		);
	}

	componentWillUnmount() {
		NetInfo.isConnected.removeEventListener("change", this.handleConnectionChange);
		AppState.removeEventListener("change", this._handleAppStateChange);
	}

	handleConnectionChange = isConnected => {
		this.setState({ networkStatus: isConnected });
	};

	componentWillMount() {
		if (this.state.user_id == 0) {
			AsyncStorage.multiGet(["UserID", "UserToken", "UserEmail", "devMode"], (err, stores) => {
				let UserID = parseInt(stores[0][1]);
				let UserToken = stores[1][1];
				let UserEmail = stores[2][1];
				let devMode = stores[3][1];

				if (devMode == "1") {
					this.setState(
						{
							user_id: UserID,
							user_email: UserEmail,
							user_token: UserToken,
							devMode: 1
						},
						() => {
							if (UserID > 0) {
								this.connectSocketAdmin(UserID, UserToken, 1);
							} else {
								this.setState({ isLoaded: true });
							}
						}
					);
				} else {
					this.setState(
						{
							user_id: UserID,
							user_email: UserEmail,
							user_token: UserToken,
							devMode: 0
						},
						() => {
							if (UserID > 0) {
								appsFlyer.setCustomerUserId(String(UserID), function(result) {
									//console.log(result);
								});

								this.connectSocket(UserID, UserToken, 1);
							} else {
								this.setState({ isLoaded: true });
							}
						}
					);
				}
			});
		}
	}

	loginUser(result) {
		var UserID = parseInt(result["user_id"]);

		AsyncStorage.setItem("UserID", String(result["user_id"]));
		AsyncStorage.setItem("UserToken", String(result["user_token"]));
		AsyncStorage.setItem("UserEmail", String(result["user_email"]));
		AsyncStorage.setItem("devMode", String(0));

		this.setState(
			{
				user_id: UserID,
				user_email: result["user_email"],
				user_token: result["user_token"],
				isLoaded: false,
				devMode: 0
			},
			() => {
				appsFlyer.setCustomerUserId(String(UserID), function(result) {
					//console.log(result);
				});

				appsFlyer.trackEvent(
					"af_login",
					{ user_email: result["user_email"] },
					result => {
						//console.log(result);
					},
					error => {
						//console.error(error);
					}
				);
				this.connectSocket(UserID, result["user_token"], 0);
			}
		);
	}

	loginUserAdmin(result) {
		var UserID = parseInt(result["user_id"]);

		AsyncStorage.setItem("UserID", String(result["user_id"]));
		AsyncStorage.setItem("UserToken", String(result["user_token"]));
		AsyncStorage.setItem("UserEmail", String(result["user_email"]));
		AsyncStorage.setItem("devMode", String(1));

		this.setState(
			{
				user_id: UserID,
				user_email: result["user_email"],
				user_token: result["user_token"],
				isLoaded: false,
				devMode: 1
			},
			() => {
				this.connectSocketAdmin(UserID, result["user_token"], 0);
			}
		);
	}

	openStore() {
		if (Platform.OS === "ios") {
			Linking.openURL("itms-apps://itunes.apple.com/us/app/id1198078240?mt=8");
		} else {
			Linking.openURL("market://details?id=com.puffy");
		}
	}

	connectSocket(user_id, token, setLogged) {
		const $this = this;
		let apiServer = config.apiServerNode;

		if (Platform.OS === "android") {
			apiServer = config.apiServerNodeAndroid;
		}

		this.puffyChannel = io.connect(apiServer, {
			transports: ["websocket"],
			secure: false,
			jsonp: false,
			query: "user_id=" + user_id + "&user_token=" + token + "&app_version=" + this.appVersion + "&device=" + Platform.OS
		});

		this.puffyChannel.on("reconnect_attempt", () => {
			this.puffyChannel.io.opts.transports = ["polling", "websocket"];
		});

		if (setLogged === 1) {
			//offline mode
			setTimeout(function() {
				$this.setState({ isLoaded: true, isLogged: true });
			}, 1500);
		}

		this.puffyChannel.on(
			"error",
			function(err) {
				//console.log("socket error");
				//console.log(err);
				$this.setState({ socketio: false });

				if (err == 401) {
					console.log("Fail Connecting to Puffy API");

					if ($this.state.isLoaded == false) {
						this.setState({ isLoaded: true, isLogged: false, socketio: false });
					}
				}
			}.bind(this)
		);

		this.puffyChannel.on(
			"connect_failed",
			function(data) {
				//console.log("connect_failed");
				$this.setState({ socketio: false });
			}.bind(this)
		);

		this.puffyChannel.on(
			"token_fail",
			function(data) {
				console.log("token_fail");
			}.bind(this)
		);

		this.puffyChannel.on(
			"disconnect",
			function(data) {
				//console.log("disconnect");
				//console.log(data);
				$this.setState({ socketio: false });
			}.bind(this)
		);

		this.puffyChannel.on(
			"connection",
			function(data) {
				//console.log(data);
				$this.setState({ socketio: true, networkStatus: true });
				$this.getUserProfile();
			}.bind(this)
		);

		this.puffyChannel.on("data_channel", this.appEventListener);
	}

	connectSocketAdmin(user_id, token, setLogged) {
		const $this = this;
		const apiServer = config.apiServerDevNode;

		this.puffyChannel = io.connect(apiServer, {
			transports: ["websocket"],
			secure: false,
			jsonp: false,
			query: "user_id=" + user_id + "&user_token=" + token + "&app_version=" + this.appVersion
		});

		this.puffyChannel.on("reconnect_attempt", () => {
			this.puffyChannel.io.opts.transports = ["polling", "websocket"];
		});

		if (setLogged === 1) {
			setTimeout(function() {
				$this.setState({ isLoaded: true, isLogged: true });
			}, 1500);
		}

		this.puffyChannel.on(
			"error",
			function(err) {
				console.log("socket error");
				console.log(err);
				if (err == 401) {
					console.log("Fail Connecting to Puffy API");

					if ($this.state.isLoaded == false) {
						this.setState({ isLoaded: true, isLogged: false, socketio: false });
					}
				}
			}.bind(this)
		);

		this.puffyChannel.on(
			"connect_failed",
			function(data) {
				//console.log("connect_failed");
				$this.setState({ socketio: false });
			}.bind(this)
		);

		this.puffyChannel.on(
			"token_fail",
			function(data) {
				//console.log("token_fail");
			}.bind(this)
		);

		this.puffyChannel.on(
			"disconnect",
			function(data) {
				console.log("disconnect");
				console.log(data);
				$this.setState({ socketio: false });
			}.bind(this)
		);

		this.puffyChannel.on(
			"connection",
			function(data) {
				//console.log(data);
				$this.setState({ socketio: true, networkStatus: true });
				$this.getUserProfile();
			}.bind(this)
		);

		this.puffyChannel.on("data_channel", this.appEventListener);
	}

	appEventListener(data) {
		//console.log(data);

		const $this = this;

		let rows = data["result_data"];

		if (data["result"] == 1) {
			//console.log(data);

			if (data["result_action"] == "show_alert") {
				Alert.alert(data["result_data"]["alert_title"], data["result_data"]["alert_text"]);
			}
			if (data["result_action"] == "force_logout") {
				this.logout();
			}
			if (data["result_action"] == "force_reload") {
				this.getUserProfile();
				this.findUser();
				this.getExplorer();

				setTimeout(function() {
					$this.navigator && $this.navigator.dispatch(NavigationActions.navigate({ routeName: "HomeTab" }));
				}, 1000);
			}
			if (data["result_action"] == "create_user_report_result") {
				Alert.alert(data["result_title"], data["result_text"]);
			}

			if (data["result_action"] == "create_feed_report_result") {
				Alert.alert(data["result_title"], data["result_text"]);
			}

			if (data["result_action"] == "create_event_report_result") {
				Alert.alert(data["result_title"], data["result_text"]);
			}
			if (data["result_action"] == "set_username_result") {
				//console.log($this.state.user_email);

				appsFlyer.trackEvent(
					"af_complete_registration",
					{ user_email: $this.state.user_email },
					result => {
						//console.log(result);
					},
					error => {
						//console.error(error);
					}
				);

				this.getUserProfile();
			}

			if (data["result_action"] == "update_location_gender_result") {
				this.getUserProfile();
			}

			if (data["result_action"] == "update_my_profile_result") {
				Alert.alert("Updated", "Your profile has been updated");
				this.getUserProfile();
				this.findUser();
				this.getExplorer();
			}
			if (data["result_action"] == "update_user_interests_result") {
				this.getUserProfile();
			}

			if (data["result_action"] == "update_user_filter_result") {
				this.getUserProfile();
				this.findUser();
				this.getExplorer();
			}
			if (data["result_action"] == "update_user_filters_result") {
				this.getUserProfile();
				this.findUser();
				this.getExplorer();
			}

			//notification read.
			if (data["result_action"] == "read_notification") {
				this.setState({
					notification_count: 0
				});
			}

			if (data["result_action"] == "read_result") {
				let dataString61 = {
					user_action: "get_noti_count",
					user_data: {}
				};

				this.handleEmit(dataString61);
			}

			if (data["result_action"] == "get_noti_count_result") {
				this.setState({
					notification_count: parseInt(data["result_data"]["notification_count"])
				});
			}

			if (data["result_action"] == "file_like_result") {
				this.setState({
					notification_count: parseInt(data["result_data"]["notification_count"])
				});

				let dataString4 = {
					user_action: "get_notificatons",
					user_data: {}
				};

				this.handleEmit(dataString4);
			}

			if (data["result_action"] == "confirm_event_noti_result") {
				this.setState({
					notification_count: parseInt(data["result_data"]["notification_count"])
				});

				let dataString41 = {
					user_action: "get_notificatons",
					user_data: {}
				};

				this.handleEmit(dataString41);
			}

			if (data["result_action"] == "puff_event_noti_result") {
				this.setState({
					notification_count: parseInt(data["result_data"]["notification_count"])
				});

				let dataString42 = {
					user_action: "get_notificatons",
					user_data: {}
				};

				this.handleEmit(dataString42);
			}

			if (data["result_action"] == "puff_result") {
				this.setState({
					notification_count: parseInt(data["result_data"]["notification_count"])
				});

				let dataString4 = {
					user_action: "get_notificatons",
					user_data: {}
				};

				this.handleEmit(dataString4);
				this.getFriendCount();
			}

			if (data["result_action"] == "update_noti_result") {
				this.setState({
					notification_count: parseInt(data["result_data"]["notification_count"])
				});

				let dataString4 = {
					user_action: "get_notificatons",
					user_data: {}
				};

				this.handleEmit(dataString4);
			}

			if (data["result_action"] == "puff_back_result") {
				this.setState({
					notification_count: parseInt(rows["notification_count"])
				});

				let dataString4 = {
					user_action: "get_notificatons",
					user_data: {}
				};

				this.handleEmit(dataString4);
				this.getFriendCount();

				this.setPufferModalVisible(true, rows["user_thumb"], rows["user_id"], rows["user_name"]);
			}

			if (data["result_action"] == "remove_friend_result") {
				this.getFriendCount();
			}

			if (data["result_action"] == "msg_other_result") {
				let dataString2 = {
					user_action: "list_msgs",
					user_data: {}
				};

				this.handleEmit(dataString2);

				let dataString3 = {
					user_action: "get_notificatons",
					user_data: {}
				};

				this.handleEmit(dataString3);

				this.setState({
					unread_count: parseInt(data["result_data"]["unread_count"]),
					notification_count: parseInt(data["result_data"]["notification_count"])
				});
			}

			if (data["result_action"] == "request_password_reset_result" || data["result_action"] == "register_user_result") {
			}

			if (data["result_action"] == "get_my_profile_result") {
				this.setState({
					user_thumb: data["result_data"]["file_thumbnail_url"],
					gpsError: 0
				});
			}

			if (data["result_action"] == "file_upload_result") {
				if (data["result_data"]["profile"] == 1) {
					setTimeout(function() {
						$this.getUserProfile();
					}, 3000);
				}
			}

			if (data["result_action"] == "get_my_user_result") {
				//console.log(data["result_data"]);

				let filter_check = 1;
				let interest_check = 1;
				let username_check = 1;
				let gender_check = 1;
				let file_check = 1;
				let file_id = parseInt(data["result_data"]["file_id"]);
				let complete_profile = 0;
				let isUserLoaded = this.state.isUserLoaded;

				if (data["result_data"]["user_name"] == null) {
					username_check = 0;
				} else if (data["result_data"]["user_gender"] == null) {
					gender_check = 0;
				} else if (data["result_data"]["user_position_updated_date"] == null) {
					gender_check = 0;
				} else if (data["result_data"]["user_filter_gender"] == null) {
					filter_check = 0;
				} else if (data["result_data"]["user_interest_name1"] == null) {
					interest_check = 0;
				} else if (!file_id > 0) {
					file_check = 0;
				} else {
					complete_profile = 1;
				}

				if (this.state.isUserLoaded == false) {
					if (data["result_data"]["version_check"] == "0") {
						Alert.alert(
							"New Update",
							"You are currently using an older version. Please download our latest update to utilize our new and fun features. Puff Puff and away!",
							[{ text: "Download Now", onPress: () => this.openStore() }]
						);

						$this.setState({ isLogged: false, isLoaded: false });
						return false;
					} else if (data["result_data"]["version_check"] == "-1") {
						Alert.alert(
							"New Update",
							"You are currently using an older version. Please download our latest update to utilize our new and fun features. Puff Puff and away!",
							[{ text: "Download Now", onPress: () => this.openStore() }]
						);
					}
				}

				this.setState(
					{
						user_gender: data["result_data"]["user_gender"],
						user_name: data["result_data"]["user_name"],
						user_firstlast: data["result_data"]["user_firstlast"],
						user_age: data["result_data"]["user_age"],
						user_aboutme: data["result_data"]["user_aboutme"],
						user_location: data["result_data"]["user_location"],
						user_thumb: data["result_data"]["file_thumbnail_url"],
						user_interest_name1: data["result_data"]["user_interest_name1"],
						user_interest_name2: data["result_data"]["user_interest_name2"],
						user_interest_name3: data["result_data"]["user_interest_name3"],
						user_interest_name4: data["result_data"]["user_interest_name4"],
						user_interest_name5: data["result_data"]["user_interest_name5"],
						unread_count: parseInt(data["result_data"]["unread_count"]),
						notification_count: parseInt(data["result_data"]["notification_count"]),
						locations: data["result_data"]["location"],
						user_admin: data["result_data"]["user_admin"],
						isLogged: true,
						isLoaded: true,
						isUserLoaded: true,
						networkStatus: true,
						complete_check: complete_profile,
						username_check: username_check,
						gender_check: gender_check,
						file_check: file_check,
						filter_check: filter_check,
						interest_check: interest_check
					},
					() => {
						//update gps first run only.
						if (isUserLoaded == false && complete_profile == 1) {
							this.updateLocation();
						}
					}
				);

				if (data["result_data"]) {
					let localData = JSON.stringify(data["result_data"]);

					if (localData) {
						AsyncStorage.setItem("UserProfile", localData);
					}
				}
			}
		} else {
			if (data["result_action"] == "set_username_result") {
				Alert.alert("Incorrect", data["result_text"]);
			}

			if (data["result_action"] == "update_gender_result") {
				Alert.alert(data["result_text"]);
			}

			if (data["result_action"] == "register_result") {
				Alert.alert(data["result_text"]);
			}

			if (data["result_action"] == "validate_user_result") {
				//token validation failed
				this.setState({ isLogged: false });
				this.logout();
			}

			if (data["result_action"] == "login_user_result") {
			}
		}

		if (data["result_action"] == "logout_user") {
			//logout override
			this.logout();
		}
	}

	gotoPufferModalMessage() {
		const navigateAction = NavigationActions.navigate({
			routeName: "Message",
			params: { name: this.state.pufferModalName, user_id: this.state.pufferModalID }
		});

		this.navigator && this.navigator.dispatch(NavigationActions.navigate(navigateAction));
		this.setPufferModalVisible(false, null, null, null);
	}

	setPufferModalVisible(visible, thumb, id, name) {
		this.setState({ pufferModalVisible: visible, pufferModalThumb: thumb, pufferModalID: id, pufferModalName: name }, function() {
			let dataString = {
				user_action: "get_user",
				user_data: {
					user_id: id
				}
			};

			this.handleEmit(dataString);
		});
	}

	setGlobal(key, value) {
		this.setState({ [key]: value });
	}

	render() {
		if (this.state.isLoaded === false) {
			return (
				<View style={styles.container}>
					<Image style={styles.viewContainer} source={Images.loading} />
				</View>
			);
		} else if (this.state.isLogged === false) {
			return (
				<View style={[{ flex: 1 }]}>
					<Auth
						screenProps={{
							bug: this.bug,
							global: this.state,
							setGlobal: this.setGlobal,
							deviceTheme: this.deviceTheme,
							handleEmit: this.handleEmit,
							puffyChannel: this.puffyChannel,
							push_token: this.state.push_token,
							user_email: this.state.user_email,
							loginUser: this.loginUser,
							loginUserAdmin: this.loginUserAdmin
						}}
					/>
				</View>
			);
		} else if (this.state.gpsError == 1) {
			return (
				<Gps
					screenProps={{
						getUserProfile: this.getUserProfile,
						deviceTheme: this.deviceTheme,
						logout: this.logout,
						global: this.state,
						setGlobal: this.setGlobal,
						user_id: this.state.user_id,
						user_email: this.state.user_email,
						unread_count: this.state.unread_count,
						bug: this.bug,
						handleEmit: this.handleEmit,
						puffyChannel: this.puffyChannel
					}}
				/>
			);
		} else if (this.state.username_check == 0) {
			return (
				<Begin
					screenProps={{
						getUserProfile: this.getUserProfile,
						deviceTheme: this.deviceTheme,
						logout: this.logout,
						global: this.state,
						setGlobal: this.setGlobal,
						user_id: this.state.user_id,
						user_email: this.state.user_email,
						unread_count: this.state.unread_count,
						bug: this.bug,
						handleEmit: this.handleEmit,
						puffyChannel: this.puffyChannel
					}}
				/>
			);
		} else if (this.state.gender_check == 0) {
			return (
				<MyGender
					screenProps={{
						getUserProfile: this.getUserProfile,
						getLocation: this.getLocation,
						deviceTheme: this.deviceTheme,
						logout: this.logout,
						global: this.state,
						setGlobal: this.setGlobal,
						user_id: this.state.user_id,
						user_email: this.state.user_email,
						unread_count: this.state.unread_count,
						bug: this.bug,
						handleEmit: this.handleEmit,
						puffyChannel: this.puffyChannel
					}}
				/>
			);
		} else if (this.state.filter_check === 0) {
			return (
				<Filter
					screenProps={{
						getUserProfile: this.getUserProfile,
						deviceTheme: this.deviceTheme,
						logout: this.logout,
						global: this.state,
						setGlobal: this.setGlobal,
						user_id: this.state.user_id,
						user_email: this.state.user_email,
						unread_count: this.state.unread_count,
						bug: this.bug,
						handleEmit: this.handleEmit,
						puffyChannel: this.puffyChannel,
						hide_back: 1
					}}
				/>
			);
		} else if (this.state.interest_check === 0) {
			return (
				<Preferences
					screenProps={{
						getUserProfile: this.getUserProfile,
						deviceTheme: this.deviceTheme,
						logout: this.logout,
						global: this.state,
						setGlobal: this.setGlobal,
						user_id: this.state.user_id,
						user_email: this.state.user_email,
						unread_count: this.state.unread_count,
						bug: this.bug,
						handleEmit: this.handleEmit,
						puffyChannel: this.puffyChannel,
						hide_back: 1
					}}
				/>
			);
		} else if (this.state.file_check == 0) {
			return (
				<NoPhoto
					screenProps={{
						getUserProfile: this.getUserProfile,
						deviceTheme: this.deviceTheme,
						logout: this.logout,
						global: this.state,
						setGlobal: this.setGlobal,
						user_id: this.state.user_id,
						user_email: this.state.user_email,
						unread_count: this.state.unread_count,
						bug: this.bug,
						handleEmit: this.handleEmit,
						puffyChannel: this.puffyChannel
					}}
				/>
			);
		} else {
			return (
				<View style={styles.container}>
					<Tab
						ref={nav => {
							this.navigator = nav;
						}}
						onNavigationStateChange={this._onNavigationStateChange}
						screenProps={{
							getUserProfile: this.getUserProfile,
							updateLocation: this.updateLocation,
							appVersion: this.appVersion,
							deviceTheme: this.deviceTheme,
							logout: this.logout,
							global: this.state,
							setGlobal: this.setGlobal,
							user_id: this.state.user_id,
							user_email: this.state.user_email,
							user_thumb: this.state.user_thumb,
							unread_count: this.state.unread_count,
							bug: this.bug,
							handleEmit: this.handleEmit,
							setPufferModalVisible: this.setPufferModalVisible,
							puffyChannel: this.puffyChannel,
							hide_back: 0,
							notification_count: this.state.notification_count
						}}
					/>
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.pufferModalVisible}
						onRequestClose={() => {
							console.log("press close");
						}}
					>
						<LinearGradient
							start={{ x: 0.0, y: 0.25 }}
							end={{ x: 0.0, y: 1.0 }}
							locations={[0, 0.5, 0.8]}
							colors={["#81738A90", "#826DA890", "#9467A590"]}
							style={styles.modal}
						>
							<View style={styles.modalHeader}>
								<Text style={styles.modalHeaderText}>AMAZING!</Text>
								<Text style={styles.modalHeaderTextSub}>You are now Puffers.</Text>
								<Text style={styles.modalHeaderTextSub}>You may send a message.</Text>
							</View>
							<View style={styles.modalRow}>
								<View style={styles.modalAvatar}>
									<Image style={styles.modalAvatarImg} source={{ uri: this.state.user_thumb }} />
								</View>
								<View style={styles.modalAvatar}>
									<Image style={styles.modalAvatarImg} source={{ uri: this.state.pufferModalThumb }} />
								</View>
							</View>
							<View style={styles.modalFooter}>
								<TouchableOpacity
									style={styles.modalBtnGreen}
									onPress={() => {
										this.gotoPufferModalMessage();
									}}
								>
									<View style={styles.modalBtnRow}>
										<Image style={styles.modalBtnIcon} source={Images.white_plane_button} />
										<Text style={styles.modalBtnGreenText}>Say Hi</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.modalBtnWhite}
									onPress={() => {
										this.setPufferModalVisible(false, null, null, null);
									}}
								>
									<View style={styles.modalBtnRow}>
										<Image style={styles.modalBtnIcon} source={Images.white_puff_button} />
										<Text style={styles.modalBtnWhiteText}>Keep Puffing</Text>
									</View>
								</TouchableOpacity>
							</View>
						</LinearGradient>
					</Modal>
				</View>
			);
		}
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FFF"
	},
	viewContainer: {
		flex: 1,
		width: null,
		height: null,
		alignItems: "center",
		backgroundColor: "#000"
	},
	modal: {
		flex: 1,
		backgroundColor: "#00000099",
		paddingTop: 80
	},
	modalHeader: {
		alignItems: "center"
	},
	modalHeaderText: {
		fontSize: 34,
		color: "#18B6C1",
		textAlign: "center",
		fontWeight: "bold",
		fontFamily: "Helvetica"
	},
	modalHeaderTextSub: {
		fontSize: 22,
		color: "#FFFFFF",
		textAlign: "center",
		fontFamily: "Helvetica"
	},
	modalRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 35
	},
	modalAvatar: {
		borderTopColor: "#18B6C1",
		borderTopWidth: 5,
		borderLeftColor: "#4B8EB6",
		borderLeftWidth: 5,
		borderBottomColor: "#A35CA1",
		borderBottomWidth: 5,
		borderRightColor: "#508BB3",
		borderRightWidth: 5,
		borderRadius: 8
	},
	modalAvatarImg: {
		height: 150,
		width: 150
	},
	modalFooter: {
		marginLeft: 40,
		marginRight: 40,
		marginTop: 35
	},
	modalBtnRow: {
		flexDirection: "row",
		justifyContent: "center",
		paddingTop: 10,
		paddingBottom: 10
	},
	modalBtnGreen: {
		backgroundColor: "#18B6C1",
		borderWidth: 1,
		borderColor: "#18B6C1",
		borderRadius: 5
	},
	modalBtnGreenText: {
		color: "#FFF",
		fontSize: 18,
		textAlign: "center",
		fontFamily: "Helvetica"
	},
	modalBtnWhite: {
		marginTop: 20,
		borderWidth: 1,
		borderColor: "#FFF",
		borderRadius: 5
	},
	modalBtnWhiteText: {
		color: "#FFF",
		fontSize: 18,
		textAlign: "center",
		fontFamily: "Helvetica"
	},
	modalBtnIcon: {
		height: 25,
		width: 25,
		marginRight: 10,
		resizeMode: "contain"
	}
};

export default App;
