import React, { Component } from "react";
import { Platform, View, CameraRoll, Text, Image, TouchableOpacity, Button, Dimensions, Alert, Linking, ImagePickerIOS, ActivityIndicator } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Images from "../config/images";
import { HeaderCamera } from "../components";
import fileUpload from "../lib/fileUpload";
import ImageResizer from "react-native-image-resizer";
import Permissions from "react-native-permissions";
import { ProcessingManager } from "react-native-video-processing";
import ImageCropPicker from "react-native-image-crop-picker";
var ImagePicker = require("react-native-image-picker");

class Gallery extends Component {
	constructor(props) {
		super(props);

		this.componentDidMount = this.componentDidMount.bind(this);
		this.openSettings = this.openSettings.bind(this);
		this.uploadImage = this.uploadImage.bind(this);
		this.checkVideo = this.checkVideo.bind(this);
		this.trimVideo = this.trimVideo.bind(this);
		this.compressVideo = this.compressVideo.bind(this);
		this.getThumb = this.getThumb.bind(this);
		this.gotoVideoConfirm = this.gotoVideoConfirm.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.user_id = this.props.screenProps.user_id;
		this.key = this.props.navigation.state.key;
		this.feed = this.props.navigation.state.params.feed;
		this.showVideos = false;
		this.showGallery = this.showGallery.bind(this);

		if (this.feed == 1) {
			//this.showVideos = false;
			this.showVideos = true;
		}

		this.state = {
			photoPermission: true,
			ios: 1,
			isLoaded: 0
		};

		const puffyChannel = this.props.screenProps.puffyChannel;
		const $this = this;
	}

	componentWillUnmount() {
		//console.log("gallery unmount");
	}

	showGallery() {
		if (Platform.OS === "ios") {
			ImagePickerIOS.openSelectDialog(
				{ showVideos: this.showVideos },
				imageUri => {
					this.uploadImage(imageUri);
				},
				error => {
					this.props.navigation.goBack();
				}
			);
		} else {
			let options = {
				storageOptions: {
					skipBackup: true,
					path: "images"
				}
			};

			let options2 = {
				mediaType: "any"
			};

			if (this.showVideos == true) {
				ImageCropPicker.openPicker({
					options2
				})
					.then(image => {
						this.uploadImage(image.path);
					})
					.catch(e => {
						this.props.navigation.goBack();
					});
			} else {
				ImagePicker.launchImageLibrary(options, response => {
					//console.log("Response = ", response);

					if (response.didCancel) {
						//console.log("User cancelled image picker");
						this.props.navigation.goBack();
					} else if (response.error) {
						//console.log("ImagePicker Error: ", response.error);
						this.props.navigation.goBack();
					} else if (response.customButton) {
						//console.log("User tapped custom button: ", response.customButton);
					} else {
						let source = { uri: response.uri };

						this.uploadImage(response.uri);
					}
				});
			}
		}
	}

	componentDidMount() {
		Permissions.check("photo").then(response => {
			//console.log(response);

			this.setState({ photoPermission: response });

			if (response == "denied" || response == "undetermined") {
				Permissions.request("photo").then(response => {
					this.setState({ photoPermission: response });

					if (response == "denied") {
						return false;
					}

					this.showGallery();
				});

				return false;
			}

			this.showGallery();
		});
	}

	openSettings() {
		Linking.openURL("app-settings:");
	}

	checkVideo(video) {
		ProcessingManager.getVideoInfo(video).then(({ duration, size }) => this.trimVideo(video, duration, size.width, size.height));
	}

	trimVideo(video, duration, width, height) {
		const options = {
			startTime: 0,
			endTime: 10
		};

		if (duration > 10) {
			console.log("trimming video");
			ProcessingManager.trim(video, options).then(data => this.getThumb(data, duration, width, height));
		} else {
			console.log("skip trimming");
			this.getThumb(video, duration, width, height);
		}
	}

	getThumb(video, duration, width, height) {
		const maximumSize = { width: 150, height: 150 };
		console.log(video);
		console.log(width);
		console.log(height);

		ProcessingManager.getPreviewForSecond(video, 1, maximumSize, "JPEG")
			.then(data => this.compressVideo(video, data.uri, duration, width, height))
			.catch(console.warn);
	}

	compressVideo(video, thumb, duration, srcWidth, srcHeight) {
		console.log(srcWidth);
		console.log(srcHeight);

		const maxWidth = 640;
		const maxHeight = 640;

		const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

		console.log(ratio);

		let newWidth = srcWidth;
		let newHeight = srcHeight;

		if (srcHeight > maxHeight || srcWidth > maxWidth) {
			newWidth = srcWidth * ratio;
			newHeight = srcHeight * ratio;
		}

		const options = {
			width: newWidth,
			height: newHeight
		};

		console.log("new");
		console.log(options);
		console.log(video);

		//data.source android
		ProcessingManager.compress(video, options).then(data => this.gotoVideoConfirm(data, thumb));
	}

	gotoVideoConfirm(video, thumb) {
		console.log(video);
		this.props.navigation.navigate("VideoConfirm", { video: video.source, thumb: thumb, data: this.props.navigation.state.params, key: this.key });
	}

	uploadImage(imageUri) {
		const $this = this;

		//prevent double updloads.
		if (this.state.isLoaded == 1) {
			return false;
		}
		console.log(imageUri);

		let ext = imageUri.substr(imageUri.lastIndexOf(".") + 1);
		this.setState({ isLoaded: 1 });

		if (ext == "MOV" || ext == "MP4" || ext == "AVI" || ext == "mp4") {
			//this.props.navigation.goBack();
			//return false;

			const options = {
				startTime: 0,
				endTime: 8
			};

			this.checkVideo(imageUri);
		} else {
			ImageResizer.createResizedImage(imageUri, 1080, 1080, "JPEG", 100)
				.then(resizedImageUri => {
					//console.log(resizedImageUri);
					$this.props.navigation.navigate("PhotoConfirm", { photo: resizedImageUri.uri, data: $this.props.navigation.state.params, key: $this.key });
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	noCamera() {
		return (
			<View style={styles.container}>
				<HeaderCamera
					navigation={this.props.navigation}
					deviceTheme={this.props.screenProps.deviceTheme}
					cancel={true}
					next={false}
					nextFunction={this.uploadImage}
					nextText=""
				>
					Gallery
				</HeaderCamera>

				<View style={styles.profileMessage}>
					<Image style={styles.lockedEye} source={Images.camera_icon} />
					<Text style={styles.profileMessageHeader}>Allow access to your photos use gallery</Text>
					<TouchableOpacity style={styles.btn} onPress={this.openSettings}>
						<Text style={styles.btnText}>Go to Settings</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	render() {
		if (this.state.photoPermission == "denied") {
			return this.noCamera();
		}
		if (this.state.isLoaded == 0) {
			return <View style={styles.container} />;
		}

		return (
			<View style={styles.containerLoad}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FFF"
	},
	containerLoad: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#FFF"
	},
	profileMessage: {
		marginTop: 75,
		marginLeft: 20,
		marginRight: 20,
		justifyContent: "center",
		alignItems: "center"
	},
	lockedEye: {
		height: 75,
		width: 75,
		resizeMode: "contain"
	},
	profileMessageHeader: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		color: "#777980",
		marginTop: 15,
		marginBottom: 10
	},
	btn: {
		borderWidth: 1,
		borderColor: "#18B5C3",
		borderRadius: 5,
		backgroundColor: "#18B5C3",
		marginLeft: 5,
		marginRight: 5,
		marginTop: 10,
		justifyContent: "center"
	},
	btnText: {
		color: "#FFF",
		fontSize: 16,
		textAlign: "center",
		fontFamily: "Helvetica",
		marginTop: 8,
		marginBottom: 8,
		marginLeft: 10,
		marginRight: 10
	}
};

export { Gallery };
