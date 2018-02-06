import React, { Component } from "react";
import { Alert, View, Text, Image, TouchableHighlight, TouchableOpacity, FlatList } from "react-native";
import Images from "../config/images";
import FilterInput from "../components/FilterInput";
import { NavigationActions } from "react-navigation";
import HeaderSearch from "../components/HeaderSearch";

class Likers extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.msgListener = this.msgListener.bind(this);
		this.renderRow = this.renderRow.bind(this);
		this.onChange = this.onChange.bind(this);
		this.filterByProperty = this.filterByProperty.bind(this);
		this.gotoProfile = this.gotoProfile.bind(this);
		this.navigation = this.props.navigation;
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.file_id = this.props.navigation.state.params.file_id;

		this.state = {
			data: [],
			items: []
		};
	}

	msgListener(data) {
		//append feed images
		if (data["result"] == 1 && data["result_action"] == "get_feed_likes_result") {
			this.setState({
				data: data.result_data,
				items: data.result_data
			});
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.msgListener);
	}

	componentDidMount() {
		let dataString = {
			user_action: "get_feed_likes",
			user_data: {
				file_id: this.file_id
			}
		};

		this.handleEmit(dataString);
		this.puffyChannel.on("data_channel", this.msgListener);
	}

	gotoProfile(props) {
		props["thumb"] = props.file_thumbnail_url;
		props["id"] = props.user_id;
		props["name"] = props.user_name;

		this.props.navigation.navigate("Profile", { user: props });
	}

	filterByProperty(obj, prop, val) {
		var results = [];

		for (var key in obj) {
			if (obj[key].hasOwnProperty(prop) && obj[key][prop].toLowerCase().indexOf(val) >= 0) {
				results.push(obj[key]);
			}
		}

		return results;
	}

	onChange(obj) {
		if (obj == "clear") {
			this.setState({
				data: this.state.items
			});
			return false;
		}

		let string = obj.text;

		var results = this.filterByProperty(this.state.items, "user_name", string.toLowerCase());

		this.setState({
			data: results
		});
	}

	renderRow(row) {
		let rowData = row.item;

		return (
			<TouchableOpacity
				key={1}
				onPress={() => {
					this.gotoProfile(rowData);
				}}
			>
				<View style={styles.row}>
					<TouchableOpacity onPress={() => this.gotoProfile(rowData)}>
						<View style={styles.avatar}>
							<Image style={styles.avatarImg} source={{ uri: rowData.file_thumbnail_url }} />
						</View>
					</TouchableOpacity>
					<View style={styles.body}>
						<Text style={styles.username}>{rowData.user_name}</Text>
						<Text style={styles.preview}>{rowData.user_location}</Text>
					</View>
					<View style={styles.date}>
						<Text style={styles.dateText}>{rowData.timeago}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<HeaderSearch
					LeftIcon="back_arrow"
					LeftCallback={this.props.navigation.goBack}
					placeholder="Search"
					deviceTheme={this.props.screenProps.deviceTheme}
					onChange={this.onChange}
					global={this.props.screenProps.global}
				/>
				<View style={styles.section}>
					<Text style={styles.boldHeader}>Likers</Text>
				</View>
				<FlatList data={this.state.data} renderItem={this.renderRow} keyExtractor={(item, index) => index} />
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
	mainStyle: {
		fontSize: 26,
		fontWeight: "bold",
		justifyContent: "center",
		textAlign: "center",
		color: "#B2B2B2",
		marginTop: 100
	},
	row: {
		backgroundColor: "#FEFEFE",
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		paddingRight: 10,
		paddingLeft: 10,
		paddingTop: 5,
		paddingBottom: 5,
		marginRight: 5,
		marginLeft: 5,
		marginTop: 5,
		flexDirection: "row"
	},
	center: {
		textAlign: "center",
		fontSize: 18,
		color: "#FEFEFE"
	},
	avatar: {},
	avatarImg: {
		borderRadius: 25,
		marginRight: 5,
		marginLeft: 2,
		height: 50,
		width: 50,
		resizeMode: "cover"
	},
	body: {
		paddingTop: 2,
		paddingLeft: 5
	},
	username: {
		fontSize: 16
	},
	preview: {
		marginTop: 5,
		fontSize: 12,
		color: "#000000",
		height: 20
	},
	previewBold: {
		fontWeight: "bold",
		marginTop: 5,
		fontSize: 12,
		color: "#000000",
		height: 20
	},
	date: {
		position: "absolute",
		top: 25,
		right: 15
	},
	dateText: {},
	section: {
		borderBottomColor: "#EEEEEE",
		borderBottomWidth: 1,
		marginLeft: 5,
		marginRight: 5,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 2
	},
	boldHeader: {
		fontSize: 16,
		fontFamily: "Helvetica",
		fontWeight: "bold",
		textAlign: "center",
		color: "#7A7D83"
	}
};

export { Likers };
