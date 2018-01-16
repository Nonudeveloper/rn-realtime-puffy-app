import React, { Component } from "react";
import { Platform, ScrollView, View, Image, TouchableOpacity, TouchableWithoutFeedback, Alert, Dimensions, Text, Button } from "react-native";
import { NavigationActions } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import { HeaderCamera } from "../components";
import fileUpload from "../lib/fileUpload";
import fileUploadFeed from "../lib/fileUploadFeed";
import ImageResizer from "react-native-image-resizer";
import Images from "../config/images";
import { ImageCrop } from "react-native-image-cropper";
import BtnOption from "../components/BtnOption";
//import ImageCrop from "../components/ImageCrop";
import InputTextMultiIcon from "../components/InputTextMultiIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class PhotoConfirm extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.uploadImage = this.uploadImage.bind(this);
		this.uploadCroppedImage = this.uploadCroppedImage.bind(this);
		this.capture = this.capture.bind(this);
		this.switchType = this.switchType.bind(this);
		this.setCaption = this.setCaption.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.getUserProfile = this.props.screenProps.getUserProfile.bind(this);
		this.setPhotoPermission = this.setPhotoPermission.bind(this);
		this.fileListener = this.fileListener.bind(this);
		this.user_id = this.props.screenProps.user_id;
		this.profile = this.props.navigation.state.params.data.profile;
		this.feed = this.props.navigation.state.params.data.feed;
		this.event = this.props.navigation.state.params.data.event;
		this.message_user_id = this.props.navigation.state.params.data.message_user_id;
		this.key = this.props.navigation.state.params.data.key;
		this.keyBefore = this.props.navigation.state.params.key;
		this.routeName = this.props.navigation.state.params.data.routeName;
		this.newUser = this.props.navigation.state.params.data.newUser;
		this.width = Dimensions.get("window").width;

		let photoPermission = "0";

		if (this.feed == 1) {
			photoPermission = "1";
		}
		console.log(this.width);

		console.log(this.props.navigation.state.params.photo);

		this.state = {
			photoPermission: photoPermission,
			imagePreview: null,
			uploading: false,
			visible: false,
			photo: this.props.navigation.state.params.photo.uri,
			isLoaded: 1,
			resizeMode: "cover",
			caption: "",
			characterCount: 30,
			crop: false
		};

		//console.log(this.props.navigation.state.params.photo);
		//console.log(this.props.navigation.state.params.data);

		const puffyChannel = this.props.screenProps.puffyChannel;
		const $this = this;
	}

	fileListener(data) {
		const $this = this;

		//file upload success.
		if (data["result"] == 1 && data["result_action"] == "file_upload_result") {
			let result_data = data["result_data"];
			//console.log(result_data);

			setTimeout(function() {
				$this.setState({ visible: false });

				if ($this.newUser == 1) {
					$this.getUserProfile();
				} else {
					//either profile or feed photo or event

					if ($this.event == 1) {
						const resetAction1 = NavigationActions.setParams({
							params: { file: result_data },
							key: $this.key
						});

						$this.props.navigation.dispatch(resetAction1);

						const resetAction = NavigationActions.back({
							key: $this.keyBefore
						});

						$this.props.navigation.dispatch(resetAction);
					} else if ($this.feed == 1) {
						const resetAction1 = NavigationActions.setParams({
							params: { file: result_data },
							key: $this.key
						});

						$this.props.navigation.dispatch(resetAction1);

						const resetAction = NavigationActions.back({
							key: $this.keyBefore
						});

						$this.props.navigation.dispatch(resetAction);
					} else if ($this.message_user_id > 0) {
						let dataString = {
							user_action: "list_message",
							user_data: {
								user_id: $this.message_user_id
							}
						};

						$this.handleEmit(dataString);

						const resetAction = NavigationActions.back({
							key: $this.keyBefore
						});

						$this.props.navigation.dispatch(resetAction);
					} else {
						const resetAction = NavigationActions.reset({
							index: 0,
							actions: [NavigationActions.navigate({ routeName: "index" })]
						});

						$this.props.navigation.dispatch(resetAction);
					}
				}
			}, 3000);
		}

		//file upload fail
		if (data["result"] == 0 && data["result_action"] == "file_upload_result") {
			//console.log(data);
			this.setState({ visible: false });
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.fileListener);
	}

	componentDidMount() {
		const $this = this;

		this.puffyChannel.on("data_channel", this.fileListener);
	}

	capture() {
		if (this.state.crop == true) {
			this.refs.cropper.crop().then(base64 => this.uploadCroppedImage(base64));
		} else {
			this.uploadImage(this.state.photo);
		}
	}

	uploadCroppedImage(base64) {
		if (this.state.uploading == true) {
			return false;
		}

		const $this = this;

		this.props.screenProps.setGlobal("upload", true);

		if (this.feed == 1) {
			this.setState({ uploading: true });
			ImageResizer.createResizedImage(base64, 750, 750, "JPEG", 85)
				.then(resizedImageUri => {
					fileUploadFeed(
						resizedImageUri,
						this.handleEmit,
						this.user_id,
						this.profile,
						this.feed,
						this.event,
						this.message_user_id,
						this.state.photoPermission,
						this.state.caption,
						this.props.screenProps.setGlobal,
						function(result) {
							//console.log(result);
						}
					);
				})
				.catch(err => {
					//console.log(err);
					this.setState({ uploading: false });
					return Alert.alert("Upload Failed", "Please try to upload image again");
				});

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
		} else {
			this.setState({ visible: true, uploading: true });
			ImageResizer.createResizedImage(base64, 750, 750, "JPEG", 85)
				.then(resizedImageUri => {
					fileUpload(
						resizedImageUri,
						this.handleEmit,
						this.user_id,
						this.profile,
						this.feed,
						this.event,
						this.message_user_id,
						this.state.photoPermission,
						this.state.caption,
						this.props.screenProps.setGlobal,
						function(result) {
							if (result === 0) {
								setTimeout(function() {
									$this.setState({ visible: false });
								}, 350);
								setTimeout(function() {
									Alert.alert("Upload Failed", "Please try to upload image again");
								}, 500);
							}
						}
					);
				})
				.catch(err => {
					//console.log(err);
					this.setState({ visible: false, uploading: false });
					return Alert.alert("Upload Failed", "Please try to upload image again");
				});
		}
	}
	uploadImage(base64) {
		if (this.state.uploading == true) {
			return false;
		}

		const $this = this;

		this.props.screenProps.setGlobal("upload", true);

		if (this.feed == 1) {
			this.setState({ uploading: true });
			ImageResizer.createResizedImage(base64, 1080, 1080, "JPEG", 85)
				.then(resizedImageUri => {
					fileUploadFeed(
						resizedImageUri,
						this.handleEmit,
						this.user_id,
						this.profile,
						this.feed,
						this.event,
						this.message_user_id,
						this.state.photoPermission,
						this.state.caption,
						this.props.screenProps.setGlobal,
						function(result) {
							//console.log(result);
						}
					);
				})
				.catch(err => {
					//console.log(err);
					this.setState({ uploading: false });
					return Alert.alert("Upload Failed", "Please try to upload image again");
				});

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
		} else {
			this.setState({ visible: true, uploading: true });
			ImageResizer.createResizedImage(base64, 1080, 1080, "JPEG", 85)
				.then(resizedImageUri => {
					fileUpload(
						resizedImageUri,
						this.handleEmit,
						this.user_id,
						this.profile,
						this.feed,
						this.event,
						this.message_user_id,
						this.state.photoPermission,
						this.state.caption,
						this.props.screenProps.setGlobal,
						function(result) {
							if (result === 0) {
								setTimeout(function() {
									$this.setState({ visible: false });
								}, 350);
								setTimeout(function() {
									Alert.alert("Upload Failed", "Please try to upload image again");
								}, 500);
							}
						}
					);
				})
				.catch(err => {
					//console.log(err);
					this.setState({ visible: false, uploading: false });
					return Alert.alert("Upload Failed", "Please try to upload image again");
				});
		}
	}

	switchType(type) {
		if (this.state.resizeMode == "contain") {
			this.setState({ resizeMode: "cover", crop: true });
		} else {
			this.setState({ resizeMode: "contain", crop: false });
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
		return (
			<View style={styles.container}>
				<Spinner visible={this.state.visible} textContent={"Uploading..."} textStyle={{ color: "#FFF" }} />
				<HeaderCamera
					navigation={this.props.navigation}
					deviceTheme={this.props.screenProps.deviceTheme}
					cancel={true}
					next={true}
					backRoute="Photo"
					nextFunction={this.capture}
					nextText="Next"
					event={this.event}
					keyBefore={this.keyBefore}
					keyC={this.key}
				>
					Photo Feed
				</HeaderCamera>
				<KeyboardAwareScrollView overScrollMode="never" scrollEnabled={false}>
					{this.state.photo === null ? null : (
						<View style={styles.imagePreview}>
							{this.state.crop == true ? (
								<ImageCrop
									ref={"cropper"}
									resizeMode={"cover"}
									image={this.state.photo}
									cropHeight={this.props.screenProps.deviceTheme === "IphoneSmall" ? Dimensions.get("window").height * 0.45 : Dimensions.get("window").width}
									cropWidth={Dimensions.get("window").width}
									zoom={0}
									maxZoom={80}
									minZoom={0}
									panToMove={true}
									pinchToZoom={true}
								/>
							) : (
								<Image style={styles.imagePreviewImg} source={{ uri: this.state.photo, cache: "force-cache" }} />
							)}
							<View style={styles.topOverlay}>
								<TouchableWithoutFeedback onPress={this.switchType}>
									<View style={styles.typeButton}>
										<Image style={styles.typeIcon} source={Images.back2} />
									</View>
								</TouchableWithoutFeedback>
							</View>
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

	renderEvent() {
		return (
			<View style={styles.container}>
				<Spinner visible={this.state.visible} textContent={"Uploading..."} textStyle={{ color: "#FFF" }} />
				<HeaderCamera
					navigation={this.props.navigation}
					deviceTheme={this.props.screenProps.deviceTheme}
					cancel={true}
					next={true}
					backRoute="Photo"
					nextFunction={this.capture}
					nextText="Next"
					event={this.event}
					keyBefore={this.keyBefore}
					keyC={this.key}
				>
					Photo Event
				</HeaderCamera>
				{this.state.photo === null ? null : (
					<View style={styles.imagePreview}>
						<ImageCrop
							ref={"cropper"}
							resizeMode={this.state.resizeMode}
							image={this.state.photo}
							cropHeight={Dimensions.get("window").width}
							cropWidth={Dimensions.get("window").width}
							zoom={0}
							maxZoom={80}
							minZoom={0}
							panToMove={true}
							pinchToZoom={true}
						/>
						<View style={styles.topOverlay}>
							<TouchableWithoutFeedback style={styles.typeButton} onPress={this.switchType}>
								<Image style={styles.typeIcon} source={Images.back2} />
							</TouchableWithoutFeedback>
						</View>
					</View>
				)}
			</View>
		);
	}

	render() {
		//return <View />;

		if (this.event == 1) {
			return this.renderEvent();
		} else if (this.feed == 1) {
			return this.renderFeed();
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
					nextFunction={this.capture}
					nextText="Next"
					event={this.event}
					keyBefore={this.keyBefore}
					keyC={this.key}
				>
					Photo
				</HeaderCamera>
				{this.state.photo === null ? null : (
					<View style={styles.imagePreview}>
						<ImageCrop
							ref={"cropper"}
							resizeMode={this.state.resizeMode}
							image={this.state.photo}
							cropHeight={Dimensions.get("window").width}
							cropWidth={Dimensions.get("window").width}
							zoom={0}
							maxZoom={80}
							minZoom={0}
							panToMove={true}
							pinchToZoom={true}
						/>
						<View style={styles.topOverlay}>
							<TouchableWithoutFeedback style={styles.typeButton} onPress={this.switchType}>
								<Image style={styles.typeIcon} source={Images.back2} />
							</TouchableWithoutFeedback>
						</View>
					</View>
				)}
			</View>
		);
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
	imagePreviewImg: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").width,
		resizeMode: "contain"
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
		shadowRadius: 1,
		...Platform.select({
			android: {
				height: 30,
				width: 30
			}
		})
	}
};

export { PhotoConfirm };
