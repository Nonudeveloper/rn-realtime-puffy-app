import React, { Component } from "react";
import { View, Text, AsyncStorage, TouchableOpacity, Dimensions, Image, TextInput } from "react-native";
import TopTabButton from "../components/TopTabButton";
import { Events } from "./Events";
import { EventsUpNext } from "./EventsUpNext";
import { EventsHosting } from "./EventsHosting";
import { EventsPast } from "./EventsPast";
import HeaderSearch from "../components/HeaderSearch";
import PushNotification from "react-native-push-notification";
import Images from "../config/images";

class EventsHome extends Component {
	constructor(props) {
		super(props);

		this.handleEmit = this.props.screenProps.handleEmit.bind(this);
		this.bug = this.props.screenProps.bug.bind(this);
		this.puffyChannel = this.props.screenProps.puffyChannel;
		this.EventHomeListener = this.EventHomeListener.bind(this);
		this.onChange = this.onChange.bind(this);
		this.createEvent = this.createEvent.bind(this);
		this.setRefresh = this.setRefresh.bind(this);

		if (this.props.navigation.state.params == null) {
			this.tab = null;
		} else {
			this.tab = this.props.navigation.state.params.tab;
		}

		this.state = {
			currentPage: 1,
			refreshing: true,
			searchTerm: "",
			items: [],
			dataSource: [],
			row_count: 0,
			isLoaded: 0
		};
	}

	EventHomeListener(data) {
		if (data["result"] == 1 && data["result_action"] == "get_events_result") {
			if (this.state.currentPage == 1) {
				if (data["result_data"] == null) {
					data["result_data"] = [];
				}
				let row_count = data["result_data"].length;
				this.setState({ dataSource: data["result_data"], isLoaded: 1, items: data["result_data"], row_count: row_count, refreshing: false });

				let localData = JSON.stringify(data["result_data"]);

				if (localData) {
					AsyncStorage.setItem("Events", localData);
				}
			}
		} else if (data["result"] == 0 && data["result_action"] == "get_events_result") {
			if (this.state.currentPage == 1) {
				this.setState({ dataSource: [], isLoaded: 1, items: [], row_count: 0, refreshing: false });
			}
		}
		if (data["result"] == 1 && data["result_action"] == "get_event_up_next_result") {
			if (this.state.currentPage == 2) {
				if (data["result_data"] == null) {
					data["result_data"] = [];
				}
				let row_count = data["result_data"].length;
				this.setState({ dataSource: data["result_data"], isLoaded: 1, items: data["result_data"], row_count: row_count, refreshing: false });
			}
		} else if (data["result"] == 0 && data["result_action"] == "get_event_up_next_result") {
			if (this.state.currentPage == 2) {
				this.setState({ dataSource: [], isLoaded: 1, items: [], row_count: 0, refreshing: false });
			}
		}
		if (data["result"] == 1 && data["result_action"] == "get_host_events_result") {
			if (this.state.currentPage == 3) {
				if (data["result_data"] == null) {
					data["result_data"] = [];
				}
				let row_count = data["result_data"].length;
				this.setState({ dataSource: data["result_data"], isLoaded: 1, items: data["result_data"], row_count: row_count, refreshing: false });
			}
		} else if (data["result"] == 0 && data["result_action"] == "get_host_events_result") {
			if (this.state.currentPage == 3) {
				this.setState({ dataSource: [], isLoaded: 1, items: [], row_count: 0, refreshing: false });
			}
		}
		if (data["result"] == 1 && data["result_action"] == "get_event_past_result") {
			if (this.state.currentPage == 4) {
				if (data["result_data"] == null) {
					data["result_data"] = [];
				}
				let row_count = data["result_data"].length;
				this.setState({ dataSource: data["result_data"], isLoaded: 1, items: data["result_data"], row_count: row_count, refreshing: false });
			}
		} else if (data["result"] == 0 && data["result_action"] == "get_event_past_result") {
			if (this.state.currentPage == 4) {
				this.setState({ dataSource: [], isLoaded: 1, items: [], row_count: 0, refreshing: false });
			}
		}

		if (data["result"] == 1 && data["result_action"] == "delete_rsvp_user_result") {
			if (this.state.currentPage == 2) {
				let dataString = {
					user_action: "get_event_up_next",
					user_data: {}
				};

				this.handleEmit(dataString);
			}
		}
	}

	componentWillUnmount() {
		this.puffyChannel.removeListener("data_channel", this.EventHomeListener);
	}

	componentDidMount() {
		AsyncStorage.getItem("Events", (err, result) => {
			if (!err && result != null) {
				let items = JSON.parse(result);
				let row_count = items.length;
				this.setState({ dataSource: items, items: items, row_count: row_count, refreshing: false });
			}
		});

		this.puffyChannel.on("data_channel", this.EventHomeListener);
	}

	filterByProperty(obj, prop1, prop2, prop3, prop4, val) {
		var results = [];

		for (var key in obj) {
			if (obj[key]) {
				if (
					(obj[key].hasOwnProperty(prop1) && obj[key][prop1].toLowerCase().indexOf(val) >= 0) ||
					(obj[key].hasOwnProperty(prop2) && obj[key][prop2].toLowerCase().indexOf(val) >= 0) ||
					(obj[key].hasOwnProperty(prop3) && obj[key][prop3].toLowerCase().indexOf(val) >= 0) ||
					(obj[key].hasOwnProperty(prop4) && obj[key][prop4].toLowerCase().indexOf(val) >= 0)
				) {
					results.push(obj[key]);
				}
			}
		}

		return results;
	}

	onChange(obj) {
		if (obj == "clear") {
			this.setState({
				dataSource: this.state.items
			});
			return false;
		}

		let string = obj.text;

		var results = this.filterByProperty(
			this.state.items,
			"puffy_events_title",
			"user_name",
			"puffy_events_location_name",
			"puffy_events_location_address",
			string.toLowerCase()
		);

		this.setState({
			dataSource: results
		});
	}

	createEvent() {
		this.props.navigation.navigate("EventDetail", {});
	}

	setRefresh(value) {
		this.setState({
			refreshing: value
		});
	}

	setPage(page_no) {
		if (this.state.currentPage == page_no) {
			return false;
		}

		this.setState({
			currentPage: page_no,
			items: [],
			dataSource: [],
			row_count: 0,
			searchTerm: "",
			refreshing: true,
			isLoaded: 0
		});
	}

	render() {
		//set the custom component based on state
		return (
			<View style={styles.container}>
				<HeaderSearch
					deviceTheme={this.props.screenProps.deviceTheme}
					placeholder="Search keyword"
					onChange={this.onChange}
					LeftIcon="event_calendar_on_plus_white"
					LeftCallback={this.createEvent}
					RightIcon="white_plane_button"
					RightCallback={() => this.props.navigation.navigate("Messages")}
					unread_count={this.props.screenProps.unread_count}
					global={this.props.screenProps.global}
				/>

				<View style={styles.tabNavContainer}>
					<View style={styles.viewContainerRow}>
						<TopTabButton selected={this.state.currentPage === 1} onPress={() => this.setPage(1)}>
							Home
						</TopTabButton>
						<TopTabButton selected={this.state.currentPage === 2} onPress={() => this.setPage(2)}>
							Attending
						</TopTabButton>
						<TopTabButton selected={this.state.currentPage === 3} onPress={() => this.setPage(3)}>
							Hosting
						</TopTabButton>
						<TopTabButton selected={this.state.currentPage === 4} onPress={() => this.setPage(4)}>
							Past
						</TopTabButton>
					</View>
				</View>
				<View style={styles.container}>
					{this.state.currentPage == 1 ? (
						<Events navigation={this.props.navigation} data={this.state} setRefresh={this.setRefresh} screenProps={this.props.screenProps} />
					) : null}
					{this.state.currentPage == 2 ? (
						<EventsUpNext navigation={this.props.navigation} data={this.state} setRefresh={this.setRefresh} screenProps={this.props.screenProps} />
					) : null}
					{this.state.currentPage == 3 ? (
						<EventsHosting navigation={this.props.navigation} data={this.state} setRefresh={this.setRefresh} screenProps={this.props.screenProps} />
					) : null}
					{this.state.currentPage == 4 ? (
						<EventsPast navigation={this.props.navigation} data={this.state} setRefresh={this.setRefresh} screenProps={this.props.screenProps} />
					) : null}
				</View>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE"
	},
	tabNavContainer: {
		backgroundColor: "#FAFAFA",
		borderBottomWidth: 2,
		borderColor: "#D3D3D3"
	},
	viewContainerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginLeft: 20,
		marginRight: 20,
		marginTop: 5
	}
};

export { EventsHome };
