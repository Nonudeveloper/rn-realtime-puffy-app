import React, { Component } from "react";
import { Alert, View, Text, Image, AsyncStorage, TouchableOpacity, RefreshControl, FlatList, Platform } from "react-native";
import ActionSheet from "react-native-actionsheet";
import Images from "../config/images";
import FilterInput from "../components/FilterInput";
import { NavigationActions } from "react-navigation";
import FeedItem from "../components/FeedItem";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Take Photo", "Choose From Gallery"];
const title = "Upload Feed Photo";

class FeedAll extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.navigation = this.props.navigation;
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.msgListener = this.msgListener.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.likePhoto = this.likePhoto.bind(this);
		this.unlikePhoto = this.unlikePhoto.bind(this);
		this.deletePost = this.deletePost.bind(this);
		this.user_id = this.props.screenProps.user_id;
		this.onRefresh = this.onRefresh.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 70 };

		this.state = {
			data: [],
			refreshing: true,
			pullRefreshing: false,
			last_id: 0,
			isLoaded: 0,
			selected: false,
			emptyResult: false
		};
	}

	msgListener(data) {
		const $this = this;

		//no more feed
		if (data["result"] == 0 && data["result_action"] == "get_public_feeds_result") {
			this.setState({
				refreshing: false,
				pullRefreshing: false,
				isLoaded: 1
			});
		}

		if (data["result"] == 1 && data["result_action"] == "file_upload_result") {
			//setTimeout(function() {
			$this.setState({ refreshing: true, last_id: 0 });

			let dataString = {
				user_action: "get_public_feeds",
				user_data: { last_id: 0 }
			};

			$this.handleEmit(dataString);
			//}, 3000);
		}

		if (data["result"] == 1 && data["result_action"] == "add_update_like_result") {
			let data_file_id = parseInt(data["result_data"]["file_id"]);
			let remove_file_like = parseInt(data["result_data"]["remove_file_like"]);
			let state_data = this.state.data;

			if (data_file_id > 0 && state_data.length > 0) {
				if (remove_file_like === 1) {
					for (var i in state_data) {
						if (state_data[i]["file_id"] == data_file_id) {
							state_data[i]["likes"] = null;
						}
					}
				} else {
					for (var i in state_data) {
						if (state_data[i]["file_id"] == data_file_id) {
							state_data[i]["likes"] = 1;
						}
					}
				}

				this.setState({ data: state_data, selected: !this.state.selected });
			}
		}

		//append feed images
		if (data["result"] == 1 && data["result_action"] == "get_public_feeds_result") {
			let file_count = data["result_data"].length;
			let last_id = 0;

			if (file_count > 0) {
				last_id = data["result_data"][file_count - 1]["file_id"];
			}

			if (this.state.pullRefreshing == false && this.state.last_id > 0) {
				this.setState(
					{
						data: [...this.state.data, ...data.result_data],
						last_id: last_id,
						refreshing: false,
						pullRefreshing: false,
						isLoaded: 1
					},
					function() {
						if (this.state.data.length == 0) {
							this.setState({ emptyResult: true });
						} else {
							this.setState({ emptyResult: false });
						}
					}
				);
			} else {
				this.setState(
					{
						data: data.result_data,
						last_id: last_id,
						refreshing: false,
						pullRefreshing: false,
						isLoaded: 1
					},
					function() {
						if (this.state.data.length == 0) {
							this.setState({ emptyResult: true });
						} else {
							this.setState({ emptyResult: false });
						}
					}
				);

				let localData = JSON.stringify(data.result_data);

				if (localData) {
					AsyncStorage.setItem("FeedAll", localData);
				}
			}
		}
	}

	//load more data for flatlist
	handleLoad() {
		//dont load if we are already loading or not loaded yet.
		if (this.state.last_id == 0 || this.state.refreshing == true) {
			return;
		}

		this.setState({ refreshing: true });

		setTimeout(() => {
			let dataString = {
				user_action: "get_public_feeds",
				user_data: {
					last_id: this.state.last_id
				}
			};

			this.handleEmit(dataString);
		}, 500);
	}

	onRefresh() {
		//console.log("refresh");
		this.setState({ refreshing: true, pullRefreshing: true, last_id: 0 });

		let dataString = {
			user_action: "get_public_feeds",
			user_data: { last_id: 0 }
		};

		this.handleEmit(dataString);
	}

	componentWillUnmount() {
		//console.log("feed all unmount");
		this.puffyChannel.removeListener("data_channel", this.msgListener);
	}

	componentDidMount() {
		AsyncStorage.getItem("FeedAll", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);
				this.setState(
					{
						data: items,
						isLoaded: 1
					},
					function() {
						if (items.length == 0) {
							this.setState({ emptyResult: true });
						} else {
							this.setState({ emptyResult: false });
						}
					}
				);
			}
		});

		let dataString = {
			user_action: "get_public_feeds",
			user_data: { last_id: 0 }
		};

		this.handleEmit(dataString);
		this.puffyChannel.on("data_channel", this.msgListener);
		this.props.screenProps.setGlobal("activeFeedItem", null);
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

		if (data.likes == 1) {
			data.likes = null;
		} else {
			data.likes = 1;
		}

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

	deletePost(data, index) {
		let dataString = {
			user_action: "delete_feed",
			user_data: {
				file_id: data.file_id
			}
		};

		this.handleEmit(dataString);

		let items = this.state.data;
		let count = items.length;

		if (count == 1) {
			items = [];
			AsyncStorage.removeItem("FeedAll");
		} else {
			items.splice(index, 1);
		}

		this.setState({ data: items, selected: !this.state.selected });
	}

	handleScroll({ changed }) {
		changed.forEach(row => {
			const { isViewable, key } = row;
			const ref = this[`FeedItem_${key}`];

			if (ref == null) {
				console.log("no ref");
			} else {
				if (isViewable) {
					ref.setPaused(false);
				} else {
					ref.setPaused(true);
				}
			}
		});
	}

	render() {
		return (
			<View style={styles.container}>
				{this.state.isLoaded == 1 ? (
					<View>
						{this.state.data.length == 0 ? (
							<View style={styles.noFeedContainer}>
								<Image style={styles.lockedEye} source={Images.camera_plus} />
								<Text style={styles.noFeedHeader}>Your Puffers have not posted</Text>

								<Text style={styles.noFeed}>Lets begin posting on your feed by clicking </Text>
								<Text style={styles.noFeed}>the Share Button on the top right</Text>
							</View>
						) : (
							<FlatList
								data={this.state.data}
								extraData={this.state.selected}
								renderItem={({ item, index }) => (
									<FeedItem
										ref={ref => {
											this[`FeedItem_${index}`] = ref;
										}}
										data={item}
										index={index}
										autoplay={false}
										myPost={this.user_id == item.user_id ? 1 : 0}
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
								refreshing={this.state.refreshing}
								keyExtractor={(item, index) => index}
								refreshControl={
									<RefreshControl
										refreshing={this.state.pullRefreshing}
										onRefresh={this.onRefresh}
										tintColor="#57BBC7"
										colors={["#57BBC7", "#57BBC7", "#57BBC7"]}
									/>
								}
								onEndReached={this.handleLoad}
								removeClippedSubviews={Platform.OS === "android" ? true : false}
								initialNumToRender={3}
								onEndReachedThreshold={5}
								onViewableItemsChanged={this.handleScroll}
								viewabilityConfig={this.viewabilityConfig}
							/>
						)}
					</View>
				) : null}
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
	noFeedContainer: {
		marginTop: 50,
		justifyContent: "center",
		alignItems: "center"
	},
	lockedEye: {
		height: 100,
		width: 100,
		resizeMode: "contain"
	},
	noFeedHeader: {
		fontSize: 22,
		fontWeight: "bold",
		textAlign: "center",
		color: "#777980",
		marginTop: 10,
		marginBottom: 10
	},
	noFeed: {
		fontSize: 14,
		textAlign: "center",
		color: "#777980"
	}
};

export { FeedAll };
