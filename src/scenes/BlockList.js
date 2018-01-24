import React, { Component } from "react";
import { Text, View, Alert, TouchableOpacity, Image, FlatList } from "react-native";
import Header from "../components/Header";
import { NavigationActions } from "react-navigation";
import Images from "../config/images";
import UserRow from "../components/UserRow";

class BlockList extends Component {
  constructor(props) {
    super(props);

    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.onListener = this.onListener.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.gotoProfile = this.gotoProfile.bind(this);
    this.removeItem = this.removeItem.bind(this);

    this.state = {
      dataSource: false,
      isLoaded: 0
    };
  }

  onListener(data) {
    if (data["result"] == 1 && data["result_action"] == "block_user_result") {
      let dataString = {
        user_action: "get_blocklist",
        user_data: {}
      };

      this.handleEmit(dataString);
    }

    if (data["result"] == 1 && data["result_action"] == "get_blocklist_result") {
      this.setState({
        dataSource: data["result_data"],
        isLoaded: 1
      });
    }
    if (data["result"] == 0 && data["result_action"] == "get_blocklist_result") {
      this.setState({
        dataSource: false,
        isLoaded: 1
      });
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.onListener);
  }

  componentDidMount() {
    let dataString = {
      user_action: "get_blocklist",
      user_data: {}
    };

    this.handleEmit(dataString);

    this.puffyChannel.on("data_channel", this.onListener);
  }

  gotoProfile(props) {
    props["thumb"] = props.profileImage;
    props["id"] = props.user_id;
    props["name"] = props.user_name;

    this.props.navigation.navigate("Profile", { user: props });
  }

  removeItem(rowData, rowID) {
    Alert.alert("Unblock", `${rowData.user_name}`, [
      { text: "No", onPress: () => console.log("No Pressed!") },
      { text: "Yes", onPress: () => this.removeRow(rowID, rowData.user_block_id, rowData.user_id) }
    ]);
  }

  removeRow(rowID, user_block_id, user_id) {
    //emit remove pending
    let dataString = {
      user_action: "remove_block",
      user_data: {
        user_id: user_id,
        user_block_id: user_block_id
      }
    };

    this.handleEmit(dataString);

    let items = this.state.dataSource;
    let count = items.length;

    if (count == 1) {
      items = [];
    } else {
      items.splice(rowID, 1);
    }

    this.setState({
      dataSource: items
    });
  }

  renderRow({ item, index }) {
    return (
      <UserRow id={item.user_id} name={item.user_name} icon={item.profileImage} location={item.loc} user={item} callback={this.gotoProfile}>
        <TouchableOpacity style={styles.xButtonContainer} onPress={() => this.removeItem(item, index)}>
          <Image style={styles.xButton} source={Images.close_out_x_icon} />
        </TouchableOpacity>
      </UserRow>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftIcon="back_arrow"
          LeftCallback={this.props.navigation.goBack}
          title="Block List"
          global={this.props.screenProps.global}
        />
        {this.state.dataSource === false ? (
          <View>
            {this.state.isLoaded == 0 ? null : (
              <View style={styles.noData}>
                <Image style={styles.noDataImg} source={Images.neutral_big} />
                <Text style={styles.noDataText}>Your blocklist is empty</Text>
              </View>
            )}
          </View>
        ) : (
          <FlatList
            enableEmptySections={true}
            removeClippedSubviews={true}
            initialNumToRender={18}
            contentContainerStyle={styles.list}
            keyExtractor={item => item.user_id}
            data={this.state.dataSource}
            renderItem={this.renderRow}
          />
        )}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  section: {
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  boldHeader: {
    fontSize: 16,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    textAlign: "center",
    color: "#7A7D83"
  },
  list: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5
  },
  xButtonContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 10
  },
  xButton: {
    width: 20,
    height: 20,
    marginTop: 5,
    marginLeft: 5,
    resizeMode: "contain"
  },
  noData: {
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  noDataImg: {
    height: 80,
    width: 80,
    resizeMode: "contain"
  },
  noDataText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#777980",
    marginTop: 20,
    marginBottom: 10
  }
};

export { BlockList };
