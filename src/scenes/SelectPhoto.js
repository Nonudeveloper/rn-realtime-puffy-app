import React, { Component } from "react";
import { TouchableWithoutFeedback, View, Text, Image, Dimensions, Button, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import CheckBox from "react-native-check-box";
import { HeaderCamera } from "../components";
import { NavigationActions } from "react-navigation";
import Images from "../config/images";

class SelectPhoto extends Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
		this.onSave = this.onSave.bind(this);
		this.takePhoto = this.takePhoto.bind(this);
		this.deletePhoto = this.deletePhoto.bind(this);
		this.confirmDeletePhoto = this.confirmDeletePhoto.bind(this);
		this.handleEmit = this.props.screenProps.handleEmit.bind(this);

		console.log(this.props.navigation.state.params);

		if (this.props.navigation.state.params == null) {
			this.previousPage = null;
			this.cancelBtn = false;
			this.firstPage = false;
		} else {
			this.previousPage = this.props.navigation.state.params.previousPage;
			this.firstPage = this.props.navigation.state.params.firstPage;
			this.cancelBtn = true;
		}

		this.state = {
			selectedPhoto: "https://media2.wnyc.org/i/1200/627/l/80/1/blackbox.jpeg",
			selectedPhotoNo: 1,
			selectedPhotoId: 0,
			photo1check: true,
			photo2check: false,
			photo3check: false,
			photo4check: false,
			photo1: null,
			photo2: null,
			photo3: null,
			photo4: null,
			photo1url: null,
			photo2url: null,
			photo3url: null,
			photo4url: null,
			photo1id: 0,
			photo2id: 0,
			photo3id: 0,
			photo4id: 0,
			photoTag: "",
			cancelBtn: this.cancelBtn
		};

		const puffyChannel = this.props.screenProps.puffyChannel;
		const $this = this;

		puffyChannel.on("data_channel", function(data) {
			if (data["result_action"] == "get_files") {
				const row = data["result_data"];

				let photo1 = null;
				let photo1url = null;
				let photo2 = null;
				let photo2url = null;
				let photo3 = null;
				let photo3url = null;
				let photo4 = null;
				let photo4url = null;

				let photo1id = parseInt(row["file_id1"]);
				let photo2id = parseInt(row["file_id2"]);
				let photo3id = parseInt(row["file_id3"]);
				let photo4id = parseInt(row["file_id4"]);

				if (photo1id > 0) {
					photo1 = row["file_thumbnail_url1"];
					photo1url = row["file_original_url1"];
				}

				if (photo2id > 0) {
					photo2 = row["file_thumbnail_url2"];
					photo2url = row["file_original_url2"];
				}
				if (photo3id > 0) {
					photo3 = row["file_thumbnail_url3"];
					photo3url = row["file_original_url3"];
				}

				if (photo4id > 0) {
					photo4 = row["file_thumbnail_url4"];
					photo4url = row["file_original_url4"];
				}

				$this.setState({
					photo1: photo1,
					photo2: photo2,
					photo3: photo3,
					photo4: photo4,
					photo1id: photo1id,
					photo2id: photo2id,
					photo3id: photo3id,
					photo4id: photo4id,
					photo1url: photo1url,
					photo2url: photo2url,
					photo3url: photo3url,
					photo4url: photo4url,
					selectedPhoto: photo1url,
					selectedPhotoNo: 1,
					selectedPhotoId: photo1id
				});
			}
		});
	}

	componentDidMount() {
		let dataString = {
			user_action: "list_file",
			user_data: {}
		};

		this.handleEmit(dataString);
	}

	onSave() {
		let newUser = 0;
		if (this.props.navigation.state.params) {
			if (this.props.navigation.state.params.newUser == 1) {
				newUser = 1;
			}
		}

		if (this.state.photo1id == null) {
			Alert.alert("Required", "You must have a profile image");
			return false;
		}

		console.log("save");

		let dataString = {
			user_action: "select_photo",
			user_data: {
				photoTag: this.state.photoTag,
				photo1id: this.state.photo1id,
				photo2id: this.state.photo2id,
				photo3id: this.state.photo3id,
				photo4id: this.state.photo4id,
				selectedPhotoId: this.state.selectedPhotoId,
				newUser: newUser
			}
		};

		this.handleEmit(dataString);
		//console.log(row);

		if (newUser == 1) {
			console.log("new user");
		} else if (this.previousPage === "MyProfile") {
			this.props.navigation.goBack();
		} else if (this.firstPage == "MyProfile") {
			const resetAction = NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({ routeName: "MyProfile" })]
			});
			this.props.navigation.dispatch(resetAction);
		} else {
			this.setState({ cancelBtn: false });
		}
	}

	onClick(row) {
		console.log(row);

		if (row === 1) {
			this.setState({
				selectedPhoto: this.state.photo1url,
				selectedPhotoId: this.state.photo1id,
				selectedPhotoNo: 1,
				photo1check: true,
				photo2check: false,
				photo3check: false,
				photo4check: false
			});
		} else if (row === 2) {
			this.setState({
				selectedPhoto: this.state.photo2url,
				selectedPhotoId: this.state.photo2id,
				selectedPhotoNo: 2,
				photo1check: false,
				photo2check: true,
				photo3check: false,
				photo4check: false
			});
		} else if (row === 3) {
			this.setState({
				selectedPhoto: this.state.photo3url,
				selectedPhotoId: this.state.photo3id,
				selectedPhotoNo: 3,
				photo1check: false,
				photo2check: false,
				photo3check: true,
				photo4check: false
			});
		} else {
			this.setState({
				selectedPhoto: this.state.photo4url,
				selectedPhotoId: this.state.photo4id,
				selectedPhotoNo: 4,
				photo1check: false,
				photo2check: false,
				photo3check: false,
				photo4check: true
			});
		}

		console.log(this.state.photo1check);
	}

	takePhoto(row_id) {
		if (this.props.navigation.state.params) {
			if (this.props.navigation.state.params.newUser == 1) {
				this.props.navigation.navigate("TakePhoto", { selectedPhotoNo: row_id });
			} else {
				this.props.navigation.navigate("PhotoTab", { selectedPhotoNo: row_id, firstPage: this.previousPage });
			}
		} else {
			this.props.navigation.navigate("PhotoTab", { selectedPhotoNo: row_id, firstPage: this.previousPage });
		}
	}

	deletePhoto() {
		Alert.alert(`Are you sure you want to delete this photo?`, "", [
			{ text: "No", onPress: () => console.log("No Pressed!") },
			{ text: "Yes", onPress: () => this.confirmDeletePhoto() }
		]);
	}

	confirmDeletePhoto() {
		console.log("deleting photo");

		if (this.state.selectedPhotoNo == 1) {
			this.setState({
				selectedPhoto: null,
				selectedPhotoId: 0,
				photo1url: null,
				photo1: null,
				photo1id: null
			});

			Alert.alert("Required", "You must have a profile image");
		} else if (this.state.selectedPhotoNo == 2) {
			this.setState({
				selectedPhoto: null,
				selectedPhotoId: 0,
				photo2url: null,
				photo2: null,
				photo2id: null
			});
		} else if (this.state.selectedPhotoNo == 3) {
			this.setState({
				selectedPhoto: null,
				selectedPhotoId: 0,
				photo3url: null,
				photo3: null,
				photo3id: null
			});
		} else {
			this.setState({
				selectedPhoto: null,
				selectedPhotoId: 0,
				photo4url: null,
				photo4: null,
				photo4id: null
			});
		}

		let dataString = {
			user_action: "remove_photo",
			user_data: {
				selectedPhotoNo: this.state.selectedPhotoNo
			}
		};

		this.handleEmit(dataString);
	}

	render() {
		return (
			<View style={styles.container}>
				<HeaderCamera
					navigation={this.props.navigation}
					cancel={this.state.cancelBtn}
					next={this.state.cancelBtn}
					backRoute={true}
					nextFunction={this.onSave}
					nextText="Save"
				>
					Select a Photo
				</HeaderCamera>
				<ScrollView>
					{this.state.selectedPhoto == null ? (
						<View style={styles.noImagePreview}>
							<Image style={styles.imgStyleCameraBig} source={Images.add_photo_icon} />
						</View>
					) : (
						<View style={styles.imagePreview}>
							<Image style={styles.imageMain} source={{ uri: this.state.selectedPhoto }} />

							<TouchableOpacity style={styles.userPhotoBtn} onPress={this.deletePhoto}>
								<Image style={{ width: 22, height: 22, resizeMode: "contain" }} source={Images.close_out_x_icon} />
							</TouchableOpacity>
						</View>
					)}
					<View style={styles.selectText}>
						<Text style={styles.center}>Select profile image above</Text>
					</View>

					<View style={styles.listMain}>
						{this.state.photo1 == null ? (
							<TouchableWithoutFeedback onPress={() => this.takePhoto(1)}>
								<View style={styles.rowAddd}>
									<Image style={styles.imgStyleCamera} source={Images.add_photo_icon} />
								</View>
							</TouchableWithoutFeedback>
						) : (
							<TouchableWithoutFeedback onPress={() => this.onClick(1)}>
								<View style={styles.row}>
									<Image style={this.state.photo1check == true ? styles.imgStyleSelected : styles.imgStyle} source={{ uri: this.state.photo1 }} />
								</View>
							</TouchableWithoutFeedback>
						)}
					</View>

					<View>
						<Text style={styles.center}>Add more photos below</Text>
					</View>

					<View style={styles.list}>
						{this.state.photo2 == null ? (
							<TouchableWithoutFeedback onPress={() => this.takePhoto(2)}>
								<View style={styles.rowAddd}>
									<Image style={styles.imgStyleCamera} source={Images.add_photo_icon} />
								</View>
							</TouchableWithoutFeedback>
						) : (
							<TouchableWithoutFeedback onPress={() => this.onClick(2)}>
								<View style={styles.row}>
									<Image style={this.state.photo2check == true ? styles.imgStyleSelected : styles.imgStyle} source={{ uri: this.state.photo2 }} />
								</View>
							</TouchableWithoutFeedback>
						)}

						{this.state.photo3 == null ? (
							<TouchableWithoutFeedback onPress={() => this.takePhoto(3)}>
								<View style={styles.rowAddd}>
									<Image style={styles.imgStyleCamera} source={Images.add_photo_icon} />
								</View>
							</TouchableWithoutFeedback>
						) : (
							<TouchableWithoutFeedback onPress={() => this.onClick(3)}>
								<View style={styles.row}>
									<Image style={this.state.photo3check == true ? styles.imgStyleSelected : styles.imgStyle} source={{ uri: this.state.photo3 }} />
								</View>
							</TouchableWithoutFeedback>
						)}

						{this.state.photo4 == null ? (
							<TouchableWithoutFeedback onPress={() => this.takePhoto(4)}>
								<View style={styles.rowAddd}>
									<Image style={styles.imgStyleCamera} source={Images.add_photo_icon} />
								</View>
							</TouchableWithoutFeedback>
						) : (
							<TouchableWithoutFeedback onPress={() => this.onClick(4)}>
								<View style={styles.row}>
									<Image style={this.state.photo4check == true ? styles.imgStyleSelected : styles.imgStyle} source={{ uri: this.state.photo4 }} />
								</View>
							</TouchableWithoutFeedback>
						)}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	listMain: {
		flex: 1,
		alignItems: "center"
	},
	list: {
		flex: 1,
		width: 280,
		flexDirection: "row",
		alignSelf: "center"
	},
	selectText: {
		//borderTopWidth: 1,
		//borderColor: '#d6d6d9',
	},
	noImagePreviewTablet: {
		height: Dimensions.get("window").height / 3.3,
		justifyContent: "center",
		alignSelf: "center"
	},
	imagePreviewTablet: {
		height: Dimensions.get("window").height / 3.3
	},
	imageMainTablet: {
		height: Dimensions.get("window").height / 3.3
	},

	noImagePreview: {
		height: Dimensions.get("window").height / 2.25,
		justifyContent: "center",
		alignSelf: "center"
	},
	imagePreview: {
		height: Dimensions.get("window").height / 2.25
	},
	imageMain: {
		height: Dimensions.get("window").height / 2.25
	},
	center: {
		textAlign: "center",
		color: "#BDBDBD",
		fontSize: 17,
		marginTop: 7,
		marginBottom: 5
	},
	imgStyleSelected: {
		width: 90,
		height: 75,
		resizeMode: "stretch",
		borderWidth: 2,
		borderColor: "#D3D3D3"
	},
	imgStyle: {
		width: 90,
		height: 75,
		resizeMode: "stretch",
		borderWidth: 1,
		borderColor: "white"
	},
	imgStyleCameraBig: {
		width: 100,
		height: 80,
		resizeMode: "stretch"
	},
	imgStyleCamera: {
		width: 50,
		height: 40,
		resizeMode: "stretch"
	},
	rowAddd: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: 90,
		height: 75,
		marginLeft: 2,
		marginRight: 2,
		borderWidth: 1,
		borderColor: "#D3D3D3"
	},
	row: {
		flex: 1,
		justifyContent: "center",
		width: 90,
		height: 75,
		marginLeft: 2,
		marginRight: 2
	},
	userPhotoBtn: {
		position: "absolute",
		top: 5,
		right: 5
	}
};

export { SelectPhoto };
