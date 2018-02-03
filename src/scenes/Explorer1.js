import React, { Component } from "react";
import { View, Text, Image, ScrollView, AsyncStorage, FlatList, Dimensions, RefreshControl, TouchableOpacity, TouchableWithoutFeedback, Platform } from "react-native";
import FilterInput from "../components/FilterInput";
import { NavigationActions } from "react-navigation";
import { CachedImage } from "react-native-img-cache";
import Images from "../config/images";

class Explorer extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.navigation = this.props.navigation;
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.ExplorerListener = this.ExplorerListener.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.renderTop = this.renderTop.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.gotoFeed = this.gotoFeed.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.renderHeader = this.renderHeader.bind(this);

		this.state = {
			isLoaded: 0,
			last_id: 0,
			refreshing: false,
			pullRefreshing: false,
			selected: false,
			dataTop: [],
			data: [],
			malePufferMonth: {
				user_id: 0,
				name: "",
				thumb: "",
				age: "",
				location: ""
			},
			femalePufferMonth: {
				user_id: 0,
				name: "",
				thumb: "",
				age: "",
				location: ""
			}
		};

		//console.log(Dimensions.get("window").width * 0.305);
	}

	ExplorerListener(data) {
		if (data["result"] == 0 && data["result_action"] == "get_explorer_data_result") {
			this.setState({
				refreshing: false,
				pullRefreshing: false
			});
		}

		//append feed images
		if (data["result"] == 1 && data["result_action"] == "get_explorer_data_result") {
			let file_count = data["result_data"].length;
			let last_id = 0;

			if (file_count > 0) {
				last_id = data["result_data"][file_count - 1]["id"];
			}

			this.setState({
				data: [...this.state.data, ...data.result_data],
				selected: !this.state.selected,
				last_id: last_id,
				pullRefreshing: false,
				refreshing: false
			});
		}

		if (data["result"] == 1 && data["result_action"] == "get_top_puffer_result") {
			this.setState({
				dataTop: data["result_data"]
			});

			let localData = JSON.stringify(data.result_data);

			if (localData) {
				AsyncStorage.setItem("dataTop", localData);
			}
		}

		if (data["result"] == 1 && data["result_action"] == "get_male_puffer_result") {
			this.setState({
				malePufferMonth: data["result_data"]
			});

			let localData = JSON.stringify(data.result_data);

			if (localData) {
				AsyncStorage.setItem("malePufferMonth", localData);
			}
		}

		if (data["result"] == 1 && data["result_action"] == "get_female_puffer_result") {
			this.setState({
				femalePufferMonth: data["result_data"]
			});
			let localData = JSON.stringify(data.result_data);

			if (localData) {
				AsyncStorage.setItem("femalePufferMonth", localData);
			}
		}

		if (data["result"] == 1 && data["result_action"] == "get_explorer_result") {
			let file_count = data["result_data"].length;
			let last_id = 0;

			if (file_count > 0) {
				last_id = data["result_data"][file_count - 1]["id"];
			}

			this.setState({
				isLoaded: 1,
				refreshing: false,
				pullRefreshing: false,
				last_id: last_id,
				selected: !this.state.selected,
				data: data["result_data"]
			});

			let localData = JSON.stringify(data.result_data);

			if (localData) {
				AsyncStorage.setItem("ExplorerRows", localData);
			}
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.ExplorerListener);
	}

	componentDidMount() {
		//this.setState({ last_id: 0 });

		AsyncStorage.getItem("ExplorerRows", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);

				this.setState({
					data: items,
					selected: !this.state.selected,
					isLoaded: 1
				});
			}
		});

		AsyncStorage.getItem("malePufferMonth", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);

				this.setState({
					malePufferMonth: items
				});
			}
		});

		AsyncStorage.getItem("femalePufferMonth", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);

				this.setState({
					femalePufferMonth: items
				});
			}
		});

		AsyncStorage.getItem("dataTop", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);

				this.setState({
					dataTop: items
				});
			}
		});

		let dataString = {
			user_action: "get_explorer",
			user_data: {}
		};

		this.handleEmit(dataString);
		this.puffyChannel.on("data_channel", this.ExplorerListener);
	}

	gotoProfile(user) {
		//user['user_id']
		//console.log(user);
		this.props.navigation.navigate("Profile", { user: user });
	}

	gotoFeed() {
		this.props.navigation.navigate("Feed");
	}

	onRefresh() {
		//console.log("refresh");
		this.setState({ last_id: 0, refreshing: true, pullRefreshing: true });

		let dataString = {
			user_action: "get_explorer_users",
			user_data: {}
		};

		this.handleEmit(dataString);
	}

	handleLoad() {
		//dont load if we are already loading or not loaded yet.
		if (this.state.last_id == 0 || this.state.refreshing == true) {
			return;
		}

		this.setState({ refreshing: true });

		setTimeout(() => {
			let dataString = {
				user_action: "get_explorer_more",
				user_data: {
					last_id: this.state.last_id
				}
			};

			this.handleEmit(dataString);
		}, 500);
	}

	renderTop(row) {
		return (
			<View style={styles.rowTop}>
				<Text style={styles.textTop}>{row.item.name}</Text>
				<TouchableWithoutFeedback onPress={() => this.gotoProfile(row.item)}>
					<CachedImage style={styles.thumb} source={{ uri: row.item.thumb, cache: "force-cache" }} />
				</TouchableWithoutFeedback>
			</View>
		);
	}

	renderRow(row) {
		return (
			<View style={styles.imageBtn}>
				<TouchableWithoutFeedback onPress={() => this.gotoProfile(row.item)}>
					<CachedImage key={1} style={styles.image} resizeMode="cover" representation={"thumbnail"} source={{ uri: row.item.thumb, cache: "force-cache" }} />
				</TouchableWithoutFeedback>
			</View>
		);
	}

	renderHeader() {
		return (
			<View style={styles.content}>
				<View style={styles.containerMonth}>
					{this.state.malePufferMonth.user_id == 0 ? null : (
						<View style={styles.containerMonthLeft}>
							<Text style={styles.textMonth}>Male Puffer of the Month</Text>
							<TouchableWithoutFeedback onPress={() => this.gotoProfile(this.state.malePufferMonth)}>
								<View style={styles.monthItem}>
									<CachedImage
										style={styles.monthImage}
										source={{
											uri: this.state.malePufferMonth.thumb,
											cache: "force-cache"
										}}
									/>
									<Image style={styles.medalMonth} source={Images.medal_gold} />
									<View style={styles.monthText}>
										<Text style={styles.textDetailHeader}>
											{this.state.malePufferMonth.name}, {this.state.malePufferMonth.age}
										</Text>
										<Text style={styles.textDetail}>{this.state.malePufferMonth.loc}</Text>
									</View>
								</View>
							</TouchableWithoutFeedback>
						</View>
					)}
					{this.state.femalePufferMonth.user_id == 0 ? null : (
						<View style={styles.containerMonthRight}>
							<Text style={styles.textMonth}>Female Puffer of the Month</Text>
							<TouchableWithoutFeedback onPress={() => this.gotoProfile(this.state.femalePufferMonth)}>
								<View style={styles.monthItem}>
									<CachedImage
										style={styles.monthImage}
										source={{
											uri: this.state.femalePufferMonth.thumb,
											cache: "force-cache"
										}}
									/>
									<Image style={styles.medalMonth} source={Images.medal_gold} />
									<View style={styles.monthText}>
										<Text style={styles.textDetailHeader}>
											{this.state.femalePufferMonth.name}, {this.state.femalePufferMonth.age}
										</Text>
										<Text style={styles.textDetail}>{this.state.femalePufferMonth.loc}</Text>
									</View>
								</View>
							</TouchableWithoutFeedback>
						</View>
					)}
				</View>
			</View>
		);
	}
	render() {
		if (this.state.isLoaded === 0) {
			return <View style={styles.container} />;
		}

		return (
			<FlatList
				contentContainerStyle={{ alignItems: "flex-start" }}
				ListHeaderComponent={this.renderHeader}
				data={this.state.data}
				extraData={this.state.selected}
				renderItem={this.renderRow}
				enableEmptySections={false}
				removeClippedSubviews={Platform.OS === "android" ? true : false}
				initialNumToRender={15}
				columnWrapperStyle={styles.flatList}
				horizontal={false}
				numColumns={3}
				keyExtractor={item => item.id}
				refreshControl={
					<RefreshControl
						refreshing={this.state.pullRefreshing}
						onRefresh={this.onRefresh}
						tintColor="#57BBC7"
						titleColor="#000"
						colors={["#57BBC7", "#57BBC7", "#57BBC7"]}
					/>
				}
				onEndReached={this.handleLoad}
				onEndReachedThreshold={2}
			/>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	content: {
		width: Dimensions.get("window").width,
		marginTop: 5,
		marginLeft: 2,
		marginRight: 2
	},
	containerTop: {
		paddingBottom: 4,
		marginLeft: 3,
		marginRight: 3,
		borderBottomColor: "#DEDEDE",
		borderBottomWidth: 1,
		flexDirection: "row"
	},
	rowTopMedal: {
		alignItems: "center",
		borderRightColor: "#DEDEDE",
		borderRightWidth: 1,
		paddingRight: 5
	},
	rowTop: {
		alignItems: "center",
		marginLeft: 5,
		marginRight: 5
	},
	textTop: {
		color: "#181818",
		fontSize: 11,
		fontFamily: "Helvetica",
		textAlign: "center"
	},
	medalTop: {
		marginTop: 5,
		height: 30,
		width: 30,
		resizeMode: "contain"
	},
	thumb: {
		borderRadius: 25,
		height: 50,
		width: 50,
		resizeMode: "cover"
	},
	containerMonth: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 5,
		paddingBottom: 2,
		minHeight: 145,
		marginRight: 4,
		borderBottomColor: "#DEDEDE",
		borderBottomWidth: 1
	},
	containerMonthRight: {
		flex: 1,
		marginLeft: 3
	},
	containerMonthLeft: {
		flex: 1
	},
	textMonth: {
		color: "#181818",
		fontSize: 12,
		fontFamily: "Helvetica",
		textAlign: "center",
		marginBottom: 5
	},
	medalMonth: {
		position: "absolute",
		top: 5,
		right: 5,
		height: 30,
		width: 30
	},
	monthImage: {
		resizeMode: "cover",
		borderRadius: 5,
		height: 145,
		width: null
	},
	monthText: {
		position: "absolute",
		left: 5,
		bottom: 5,
		backgroundColor: "transparent"
	},
	textDetailHeader: {
		color: "#FFF",
		fontSize: 14,
		fontFamily: "Helvetica",
		fontWeight: "bold",
		textShadowColor: "#000",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 5
	},
	textDetail: {
		color: "#FFF",
		fontSize: 14,
		fontFamily: "Helvetica",
		textShadowColor: "#000",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 5
	},
	flatList: {
		marginTop: 2,
		justifyContent: "space-between"
	},
	imageBtn: {
		width: Dimensions.get("window").width * 0.322,
		minWidth: 80,
		maxWidth: 300,
		marginLeft: 2,
		marginRight: 2
	},
	image: {
		resizeMode: "cover",
		borderRadius: 5,
		width: null,
		height: 120
	}
};

export { Explorer };
