import React, { Component } from "react";
import { Alert, View, Text, TouchableOpacity, TouchableWithoutFeedback, RefreshControl, FlatList, Image } from "react-native";
import FilterInput from "../components/FilterInput";
import { CachedImage } from "react-native-img-cache";
import { NavigationActions } from "react-navigation";
import Images from "../config/images";
import EventsView from "../scenes/EventsView";

class EventsHosting extends Component {
    constructor(props) {
        super(props);

        this.handleEmit = this.props.screenProps.handleEmit.bind(this);
        this.navigation = this.props.navigation;
        this.puffyChannel = this.props.screenProps.puffyChannel;
        this.setRefresh = this.props.setRefresh;

        this.renderRow = this.renderRow.bind(this);
        this.gotoEventsView = this.gotoEventsView.bind(this);
        this.goToRatings = this.goToRatings.bind(this);

        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        let dataString = {
            user_action: "get_host_events",
            user_data: {}
        };

        this.handleEmit(dataString);
    }

    gotoEventsView(events_id) {
        this.props.navigation.navigate("EventsView", { events_id: events_id, events_type: 3 });
    }

    goToRatings(item) {
        this.props.navigation.navigate("EventsRating", {
            user_id: item.user_id,
            user_name: item.user_name,
            user_image: item.file_user_thumbnail,
            star_value: item.starValue
        });
    }

    onRefresh() {
        console.log("refresh");
        this.setRefresh(true);

        let dataString = {
            user_action: "get_host_events",
            user_data: {}
        };

        this.handleEmit(dataString);
    }

    renderRow(rowData) {
        return (
            <View style={styles.row}>
                <View style={styles.upperEventView}>
                    <View style={styles.eventDateContainer}>
                        <Text style={styles.eventMonth}>{rowData.item.puffy_events_month}</Text>
                        <Text style={styles.eventDay}>
                            {rowData.item.puffy_events_day}
                            <Text style={styles.eventDaySuperScript}>{rowData.item.puffy_events_day_level}</Text>
                        </Text>
                    </View>
                    <View style={styles.eventTitleContainer}>
                        <TouchableOpacity onPress={() => this.gotoEventsView(rowData.item.key)}>
                            <Text numberOfLines={1} style={styles.eventTitle}>
                                {rowData.item.puffy_events_title}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.goToRatings(rowData.item)}>
                            <Text style={styles.eventHosted}>
                                Hosted by: <Text style={styles.eventHostedUser}>{rowData.item.user_name}</Text>
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.eventTime}>{rowData.item.puffy_events_time}</Text>
                    </View>
                    {rowData.item.puffy_events_featured == 1 ? (
                        <View style={styles.eventRightContainer}>
                            <Text style={styles.eventRightText}>Featured</Text>
                        </View>
                    ) : null}
                </View>
                <TouchableWithoutFeedback onPress={() => this.gotoEventsView(rowData.item.key)}>
                    <View style={styles.eventImageContainer}>
                        <CachedImage style={styles.eventImage} source={{ uri: rowData.item.events_picture, cache: "force-cache" }} />
                        <View style={styles.eventLocationView}>
                            <Text style={styles.eventLocation}>{rowData.item.puffy_events_location_name}</Text>
                            <Text style={styles.eventLocation}>{rowData.item.puffy_events_location_address}</Text>
                        </View>
                        <Text style={styles.eventAges}>{rowData.item.puffy_events_age_invited}</Text>
                        <Text style={styles.eventCost}>{rowData.item.puffy_events_cost}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.data.row_count == 0 ? (
                    <View style={styles.profileMessage}>
                        <Image style={styles.lockedEye} source={Images.neutral_big} />
                        <Text style={styles.profileMessageHeader}>You have no hosted events</Text>
                    </View>
                ) : (
                    <FlatList
                        data={this.props.data.dataSource}
                        refreshControl={
                            <RefreshControl refreshing={this.props.data.refreshing} onRefresh={this.onRefresh} tintColor="#57BBC7" colors={["#57BBC7", "#57BBC7", "#57BBC7"]} />
                        }
                        renderItem={this.renderRow}
                        horizontal={false}
                        numColumns={1}
                    />
                )}
            </View>
        );
    }
}

const styles = {
    container: {
        backgroundColor: "#e9ebf2",
        flex: 1
    },
    row: {
        backgroundColor: "#fff",
        borderRadius: 10,
        margin: 7,
        overflow: "hidden",
        paddingTop: 5
    },
    upperEventView: {
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        height: 60
    },
    eventDateContainer: {
        alignItems: "center",
        width: 50
    },
    eventMonth: {
        color: "#f6555d",
        fontSize: 18
    },
    eventDay: {
        color: "#8c8e9b",
        fontSize: 20,
        lineHeight: 20
    },
    eventDaySuperScript: {
        color: "#8c8e9b",
        fontSize: 10,
        lineHeight: 23
    },
    eventTitleContainer: {
        flex: 1,
        marginRight: 15
    },
    eventTitle: {
        color: "#181818",
        fontWeight: "500"
    },
    eventImageContainer: {
        position: "relative"
    },
    eventRightContainer: {
        position: "absolute",
        top: 5,
        right: 9
    },
    eventRightText: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Helvetica",
        color: "#00B1BB"
    },
    eventLocationView: {
        position: "absolute",
        top: 12,
        left: 10
    },
    eventLocation: {
        color: "#FFFFFF",
        backgroundColor: "transparent",
        fontFamily: "Helvetica",
        fontWeight: "bold",
        textShadowColor: "#000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5
    },
    eventAges: {
        position: "absolute",
        bottom: 10,
        left: 10,
        color: "#FFFFFF",
        backgroundColor: "transparent",
        fontFamily: "Helvetica",
        fontWeight: "bold",
        textShadowColor: "#000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5
    },
    eventCost: {
        position: "absolute",
        bottom: 10,
        right: 10,
        color: "#FFFFFF",
        backgroundColor: "transparent",
        fontFamily: "Helvetica",
        fontWeight: "bold",
        textShadowColor: "#000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5
    },
    hostedContainer: {
        marginRight: 10,
        flex: 1,
        alignItems: "flex-end"
    },
    eventHosted: {
        color: "#181818"
    },
    eventHostedUser: {
        color: "#0000ff"
    },
    eventTime: {
        color: "#505050"
    },
    eventHostName: {
        color: "#41aaca"
    },
    eventImage: {
        height: 300,
        marginTop: 5,
        resizeMode: "stretch"
    },
    eventEmptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#cccccc",
        height: 100
    },
    eventEmptyImage: {
        height: 50,
        width: 50
    },
    noEventsContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    noEventsText: {
        color: "#8c8e9b"
    },
    profileMessage: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    lockedEye: {
        height: 100,
        width: 100,
        resizeMode: "contain"
    },
    profileMessageHeader: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#777980",
        marginTop: 10,
        marginBottom: 10
    }
};

export { EventsHosting };
