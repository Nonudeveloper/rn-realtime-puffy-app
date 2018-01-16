import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, TouchableHighlight, ListView, Alert, Dimensions } from "react-native";
import Images from "../config/images";
import PushNotification from "react-native-push-notification";
import HeaderSearch from "../components/HeaderSearch";
import { SwipeListView } from "react-native-swipe-list-view";

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class Support extends Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.filterByProperty = this.filterByProperty.bind(this);

    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.user_id = this.props.screenProps.user_id;
    this.selectRow = this.selectRow.bind(this);
    this.blockFriend = this.blockFriend.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.emitRemove = this.emitRemove.bind(this);
    this.msgsListener = this.msgsListener.bind(this);
    this.emitBlock = this.emitBlock.bind(this);

    this.items = [];

    this.state = {
      dataSource: ds.cloneWithRows([])
    };
  }

  msgsListener(data) {
    if (data["result"] == 1 && data["result_action"] == "list_support_result") {
      this.items = data["result_data"];

      this.setState({
        dataSource: ds.cloneWithRows(this.items)
      });

      PushNotification.setApplicationIconBadgeNumber(0);
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.msgsListener);
  }

  componentDidMount() {
    let dataString = {
      user_action: "list_support_msgs",
      user_data: {}
    };

    this.handleEmit(dataString);
    this.puffyChannel.on("data_channel", this.msgsListener);
  }

  blockFriend(rowData, secdId, rowID, rowMap) {
    Alert.alert(`Block ${rowData.user_name}?`, "", [
      { text: "No", onPress: () => console.log("No Pressed!") },
      { text: "Yes", onPress: () => this.emitBlock(rowData, secdId, rowID, rowMap) }
    ]);
  }

  removeFriend(rowData, secdId, rowID, rowMap) {
    Alert.alert("Delete Message", `Delete message from ${rowData.user_name}?`, [
      { text: "Cancel", onPress: () => console.log("No Pressed!"), style: "cancel" },
      { text: "Delete", onPress: () => this.emitRemove(rowData, secdId, rowID, rowMap) }
    ]);
  }

  emitBlock(rowData, secdId, rowID, rowMap) {
    let dataString = {
      user_action: "block_user",
      user_data: {
        user_id: rowData.user_id
      }
    };

    this.handleEmit(dataString);

    this.removeRow(rowID, secdId, rowMap);
  }

  emitRemove(rowData, secdId, rowID, rowMap) {
    let dataString = {
      user_action: "delete_msg",
      user_data: {
        user_id: rowData.user_id
      }
    };

    this.handleEmit(dataString);

    this.removeRow(rowID, secdId, rowMap);
  }

  removeRow(rowID, secdId, rowMap) {
    this.items.splice(rowID, 1);

    this.setState({
      dataSource: ds.cloneWithRows(this.items)
    });

    if (rowMap[`${secdId}${rowID}`]) {
      rowMap[`${secdId}${rowID}`].closeRow();
    }
  }

  selectRow(rowData) {
    this.props.navigation.navigate("SupportMsg", { name: rowData.user_name, report_id: rowData.fk_puffy_report_id, user_id: rowData.user_id });
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
        dataSource: ds.cloneWithRows(this.items)
      });
      return false;
    }

    let string = obj.text;

    var results = this.filterByProperty(this.items, "user_name", string.toLowerCase());

    this.setState({
      dataSource: ds.cloneWithRows(results)
    });
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
        onPress={() => {
          this.selectRow(rowData);
        }}
      >
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Image style={styles.avatarImg} source={{ uri: rowData.profileImage }} />
          </View>
          <View style={styles.body}>
            <Text style={styles.username}>{rowData.user_name}</Text>

            {rowData.user_check != this.user_id && rowData.puffy_messages_read_date == null ? (
              <Text style={styles.previewBold}>{rowData.puffy_messages_text}</Text>
            ) : (
              <Text style={styles.preview}>Ticket #{rowData.fk_puffy_report_id}</Text>
            )}
          </View>
          <View style={styles.date}>
            <Text style={styles.dateText}>{rowData.timeago}</Text>
          </View>
        </View>
      </TouchableHighlight>
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
          <Text style={styles.boldHeader}>Support Tickets</Text>
        </View>

        <SwipeListView
          enableEmptySections={true}
          removeClippedSubviews={false}
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          maxSwipeDistance={205}
          renderRow={this.renderRow}
          swipeToOpenPercent={5}
          renderHiddenRow={(data, secdId, rowId, rowMap) => (
            <View style={styles.actionsContainer}>
              <TouchableHighlight
                style={styles.btnBlock}
                onPress={() => {
                  this.blockFriend(data, secdId, rowId, rowMap);
                }}
              >
                <Text style={styles.center}>Block</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.btnDelete}
                onPress={() => {
                  this.removeFriend(data, secdId, rowId, rowMap);
                }}
              >
                <Text style={styles.center}>Delete</Text>
              </TouchableHighlight>
            </View>
          )}
          disableRightSwipe={true}
          rightOpenValue={-205}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  list: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5
  },
  row: {
    backgroundColor: "#FEFEFE",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
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
    resizeMode: "contain"
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
    color: "#A3A6A6",
    width: Dimensions.get("window").width - 150,
    height: 20
  },
  previewBold: {
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 12,
    color: "#000000",
    width: Dimensions.get("window").width - 150,
    height: 20
  },
  date: {
    position: "absolute",
    top: 25,
    right: 15
  },
  dateText: {},
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "stretch"
  },
  btnBlock: {
    backgroundColor: "#AEB2B6",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15
  },
  btnDelete: {
    backgroundColor: "#FB0001",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15
  },
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
    textAlign: "center",
    color: "#181818"
  }
};

export { Support };
