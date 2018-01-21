import React, { Component } from "react";
import { ScrollView, View, Image, TouchableOpacity, TouchableWithoutFeedback, Alert, Dimensions, Text, Button } from "react-native";
import { NavigationActions } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import { HeaderCamera } from "../components";
import videoUpload from "../lib/videoUpload";
import Images from "../config/images";
import Video from "react-native-video";
import BtnOption from "../components/BtnOption";
import InputTextMultiIcon from "../components/InputTextMultiIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class VideoConfirm extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.uploadVideo = this.uploadVideo.bind(this);
		this.setCaption = this.setCaption.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.getUserProfile = this.props.screenProps.getUserProfile.bind(this);
		this.setPhotoPermission = this.setPhotoPermission.bind(this);
		this.gotoIndex = this.gotoIndex.bind(this);
		this.user_id = this.props.screenProps.user_id;
		this.profile = this.props.navigation.state.params.data.profile;
		this.feed = this.props.navigation.state.params.data.feed;
		this.event = this.props.navigation.state.params.data.event;
		this.message_user_id = this.props.navigation.state.params.data.message_user_id;
		this.key = this.props.navigation.state.params.data.key;
		this.keyBefore = this.props.navigation.state.params.key;
		this.routeName = this.props.navigation.state.params.data.routeName;
		this.newUser = this.props.navigation.state.params.data.newUser;

		this.playVideo = this.playVideo.bind(this);
		this.onLoad = this.onLoad.bind(this);
		this.onProgress = this.onProgress.bind(this);
		this.onBuffer = this.onBuffer.bind(this);
		this.routeIndex = this.props.screenProps.global.routeIndex;

		let photoPermission = "0";

		if (this.feed == 1) {
			photoPermission = "1";
		}

		this.state = {
			photoPermission: photoPermission,
			imagePreview: null,
			uploading: false,
			visible: false,
			video: this.props.navigation.state.params.video,
			thumb: this.props.navigation.state.params.thumb,
			isLoaded: 1,
			caption: "",
			characterCount: 30,
			rate: 1,
			volume: 1,
			muted: false,
			resizeMode: "cover",
			duration: 0.0,
			currentTime: 0.0,
			controls: false,
			paused: false,
			skin: "custom",
			ignoreSilentSwitch: null,
			isBuffering: false
		};

		const puffyChannel = this.props.screenProps.puffyChannel;
		const $this = this;
	}

	playVideo() {
		this.setState({ paused: !this.state.paused });
	}
	onLoad(data) {
		const $this = this;

		if (data.duration > 12) {
			this.setState({ duration: 0 });
			Alert.alert("Incorrect", "Please upload videos under 10 seconds.", [{ text: "ok", onPress: () => $this.gotoIndex() }]);
		} else {
			this.setState({ duration: data.duration });
		}
	}

	onProgress(data) {
		this.setState({ currentTime: data.currentTime });
	}

	onBuffer({ isBuffering }: { isBuffering: boolean }) {
		this.setState({ isBuffering });
	}
	gotoIndex() {
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: "index" })]
		});

		this.props.navigation.dispatch(resetAction);
	}

	uploadVideo(base64) {
		if (this.state.uploading == true) {
			return false;
		}

		this.setState({ uploading: true });

		this.props.screenProps.setGlobal("upload", true);
		this.props.screenProps.setGlobal("uploadPercent", 0);

		videoUpload(
			this.state.video,
			this.state.thumb,
			this.handleEmit,
			this.user_id,
			this.profile,
			this.feed,
			this.event,
			this.message_user_id,
			this.state.photoPermission,
			this.state.caption,
			this.props.screenProps.setGlobal
		);

		if (this.props.screenProps.global.routeIndex == 2) {
			let currentPage = 2;

			if (this.state.photoPermission == 1) {
				currentPage = 3;
			}

			const resetAction2 = NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: "index", params: { currentPage: currentPage } })]
			});

			this.props.navigation.dispatch(resetAction2);
		} else {
			const resetAction = NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: "index" })]
			});
			this.props.navigation.dispatch(resetAction);

			const navigateAction = NavigationActions.navigate({
				routeName: "ExplorerTab"
			});

			this.props.navigation.dispatch(navigateAction);

			let currentPage = 2;

			if (this.state.photoPermission == 1) {
				currentPage = 3;
			}

			const resetAction2 = NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: "index", params: { currentPage: currentPage } })]
			});

			this.props.navigation.dispatch(resetAction2);
		}
	}

	setCaption(text) {
		var count = text.length;
		var characterCount = 30 - count;

		this.setState({ caption: text, characterCount: characterCount });
	}

	setPhotoPermission(value) {
		this.setState({ photoPermission: value });
	}

	renderFeed() {
		let paused = true;

		if (this.state.paused == false && this.routeIndex == this.props.screenProps.global.routeIndex) {
			paused = false;
		}

		if (this.state.uploading == true) {
			return <View />;
		}

		return (
			<View style={styles.container}>
				<Spinner visible={this.state.visible} textContent={"Uploading..."} textStyle={{ color: "#FFF" }} />
				<HeaderCamera
					navigation={this.props.navigation}
					deviceTheme={this.props.screenProps.deviceTheme}
					cancel={true}
					next={true}
					backRoute="Photo"
					nextFunction={this.uploadVideo}
					nextText="Next"
				>
					Video Feed
				</HeaderCamera>
				<KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
					{this.state.video === null ? null : (
						<View style={styles.imagePreview}>
							<TouchableWithoutFeedback onPress={this.playVideo}>
								<Video
									source={{ uri: this.state.video }}
									ref={ref => {
										this.player = ref;
									}}
									style={styles.nativeVideoControls}
									rate={this.state.rate}
									paused={paused}
									volume={this.state.volume}
									muted={this.state.muted}
									ignoreSilentSwitch={this.state.ignoreSilentSwitch}
									resizeMode={this.state.resizeMode}
									onLoad={this.onLoad}
									onBuffer={this.onBuffer}
									onProgress={this.onProgress}
									onEnd={() => {
										//AlertIOS.alert("Done!");
									}}
									repeat={true}
									controls={this.state.controls}
								/>
							</TouchableWithoutFeedback>
						</View>
					)}

					<View style={styles.boxContainer}>
						<InputTextMultiIcon
							inputRef={node => (this.caption = node)}
							value={this.state.caption}
							icon="about_icon"
							label=""
							placeholder="enter caption"
							returnKeyType="done"
							keyboardType="default"
							maxLength={30}
							multiline={false}
							characterCount={this.state.characterCount}
							onChangeText={caption => this.setCaption(caption)}
						/>

						<View style={styles.labelContainer}>
							<Text style={styles.label}>Who can view this?</Text>
						</View>
						<View style={styles.boxContainerBtn}>
							<BtnOption value="PUFFERS" active={this.state.photoPermission == 1} theme_active="Green" onPress={() => this.setPhotoPermission(1)} />
							<BtnOption value="ALL" active={this.state.photoPermission == 0} theme_active="Green" onPress={() => this.setPhotoPermission(0)} />
						</View>
					</View>
				</KeyboardAwareScrollView>
			</View>
		);
	}

	render() {
		//return <View />;

		if (this.event == 1) {
			return this.renderFeed();
		} else if (this.feed == 1) {
			return this.renderFeed();
		} else {
			return <View />;
		}
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF"
	},
	imagePreview: {
		//alignItems: "center"
	},
	boxContainerBtn: {
		justifyContent: "center",
		flexDirection: "row"
	},
	boxContainer: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 15
	},
	labelContainer: {
		marginTop: 12,
		marginBottom: 10
	},
	label: {
		textAlign: "center",
		fontSize: 16,
		color: "#18B5C3",
		paddingBottom: 5
	},
	topOverlay: {
		position: "absolute",
		padding: 16,
		right: 0,
		left: 0,
		alignItems: "center",
		bottom: 5,
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	typeButton: {
		padding: 5,
		transform: [{ rotate: "130deg" }]
	},
	typeIcon: {
		height: 25,
		width: 25,
		resizeMode: "contain",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 1
	},
	nativeVideoControls: {
		width: null,
		height: Dimensions.get("window").width
	}
};

export { VideoConfirm };
