import React, { Component } from "react";
import { View, Text, Alert, Image, FlatList, RefreshControl, TouchableOpacity, TouchableWithoutFeedback, Dimensions, AsyncStorage, ScrollView, Platform } from "react-native";
import ActionSheet from "react-native-actionsheet";
import { CachedImage } from "react-native-img-cache";
import Images from "../config/images";
import CirclePrefSmall from "../components/CirclePrefSmall";
import Header from "../components/Header";
import BtnGreen from "../components/BtnGreen";
import ImagePreview from "react-native-image-preview";
import BtnGradient from "../components/BtnGradient";

import LinearGradient from "react-native-linear-gradient";
import MyText from "react-native-letter-spacing";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Unpuff"];

const DESTRUCTIVE_INDEX = 2;

const options2 = ["Cancel", "Block", "Report"];
const options3 = ["Cancel", "No Profile Image", "Inappropriate", "Spam"];

class Profile extends Component {
  constructor(props) {
    super(props);
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.gotoSettings = this.gotoSettings.bind(this);
    this.gotoPhoto = this.gotoPhoto.bind(this);
    this.gotoGallery = this.gotoGallery.bind(this);
    this.gotoFeed = this.gotoFeed.bind(this);
    this.gotoMessage = this.gotoMessage.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.showMenu2 = this.showMenu2.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.handlePress2 = this.handlePress2.bind(this);

    this.showBlockUser = this.showBlockUser.bind(this);
    this.showReportUser = this.showReportUser.bind(this);
    this.reportUser = this.reportUser.bind(this);
    this.blockUser = this.blockUser.bind(this);

    this.handleLoad = this.handleLoad.bind(this);
    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.msgListenerProfile = this.msgListenerProfile.bind(this);
    this.setVisibleToFalse = this.setVisibleToFalse.bind(this);
    this.setVisibleToTrue = this.setVisibleToTrue.bind(this);
    this.gotoFile = this.gotoFile.bind(this);
    this.passPuffRow = this.passPuffRow.bind(this);
    this.addPuffer = this.addPuffer.bind(this);
    this.removePuffer = this.removePuffer.bind(this);
    this.removePending = this.removePending.bind(this);
    this.removePendingRow = this.removePendingRow.bind(this);
    this.setTab = this.setTab.bind(this);
    this.onRefresh = this.onRefresh.bind(this);

    this.ActionSheet = null;
    this.profile = null;
    this.UserID = this.props.screenProps.global.user_id;
    this.user = this.props.navigation.state.params.user;
    this.user_id = this.props.navigation.state.params.user.id;

    let myProfile = 0;

    if (this.UserID == this.user_id) {
      myProfile = 1;
    }

    this.myProfile = myProfile;

    this.state = {
      user_id: this.props.navigation.state.params.user.id,
      user_name: this.props.navigation.state.params.user.name,
      user_age: this.props.navigation.state.params.user.age,
      user_location: this.props.navigation.state.params.user.loc,
      user_aboutme: this.props.navigation.state.params.user.about,
      user_photo: "",
      user_photo_thumb: this.props.navigation.state.params.user.thumb,
      user_interest_name1: this.props.navigation.state.params.user.i1,
      user_interest_name2: this.props.navigation.state.params.user.i2,
      user_interest_name3: this.props.navigation.state.params.user.i3,
      user_interest_name4: this.props.navigation.state.params.user.i4,
      user_interest_name5: this.props.navigation.state.params.user.i5,
      puffy_likes_id: 0,
      friend_check: 0,
      pending_check: 0,
      file_count: 0,
      refreshing: true,
      pullRefreshing: false,
      visible: false,
      data: 0,
      last_id: 0,
      block_id: 0,
      find_user: 0,
      action_title: "Unpuff",
      reportTitle: "",
      isLoaded: 0,
      activeTab: "Photo"
    };
  }

  msgListenerProfile(data) {
    const $this = this;

    //no more images
    if (data["result"] == 0 && (data["result_action"] == "get_profile_feed_result" || data["result_action"] == "get_profile_feed_likes_result")) {
      if (this.state.last_id == 0) {
        this.setState({
          refreshing: false,
          pullRefreshing: false,
          file_count: 0,
          data: []
        });
      } else {
        this.setState({
          refreshing: false,
          pullRefreshing: false
        });
      }
    }

    //append feed images

    if (data["result"] == 1 && data["result_action"] == "get_profile_feed_likes_result") {
      if (this.state.activeTab == "Photo") {
        return false;
      }

      let user_id = parseInt(data["result_data"]["user_id"]);
      let file_count = data["result_data"]["rows"].length;
      let last_id = 0;

      if (user_id != this.user_id) {
        return false;
      }

      if (file_count > 0) {
        last_id = data["result_data"]["rows"][file_count - 1]["file_id"];
      }

      if (data["result_data"]["last_id"] == 0) {
        this.setState({
          data: data.result_data.rows,
          last_id: last_id,
          refreshing: false,
          pullRefreshing: false,
          file_count: file_count
        });
      } else {
        this.setState({
          data: [...this.state.data, ...data.result_data.rows],
          last_id: last_id,
          refreshing: false,
          pullRefreshing: false,
          file_count: file_count
        });
      }
    }

    if (data["result"] == 1 && data["result_action"] == "get_profile_feed_result") {
      if (this.state.activeTab == "Heart") {
        return false;
      }

      let user_id = parseInt(data["result_data"]["user_id"]);
      let file_count = data["result_data"]["rows"].length;
      let last_id = 0;

      if (user_id != this.user_id) {
        return false;
      }

      if (file_count > 0) {
        last_id = data["result_data"]["rows"][file_count - 1]["file_id"];
      }

      if (data["result_data"]["last_id"] == 0) {
        this.setState({
          data: data.result_data.rows,
          last_id: last_id,
          refreshing: false,
          pullRefreshing: false,
          file_count: file_count
        });
      } else {
        this.setState({
          data: [...this.state.data, ...data.result_data.rows],
          last_id: last_id,
          refreshing: false,
          pullRefreshing: false,
          file_count: file_count
        });
      }
    }

    if (data["result"] == 1 && data["result_action"] == "block_user_result") {
      if (data["result_data"].user_id == this.state.user_id) {
        this.setState({ block_id: 1, data: [], file_count: 0 });
      }
    }

    if (data["result"] == 1 && data["result_action"] == "remove_blocklist_result") {
      if (data["result_data"].user_id == this.state.user_id) {
        let dataString = {
          user_action: "get_user",
          user_data: {
            user_id: this.state.user_id
          }
        };

        this.handleEmit(dataString);
      }
    }

    if (data["result"] == 1 && data["result_action"] == "like_user_result") {
      if (data["result_data"].user_id == this.state.user_id) {
        let dataString = {
          user_action: "get_user",
          user_data: {
            user_id: this.state.user_id
          }
        };

        this.handleEmit(dataString);
        this.setState({ find_user: 0 });
      }
    }

    if (data["result"] == 1 && data["result_action"] == "remove_pending_user_like_result") {
      let dataString = {
        user_action: "get_user",
        user_data: {
          user_id: this.state.user_id
        }
      };

      this.handleEmit(dataString);
    }
    if (data["result"] == 1 && data["result_action"] == "approve_deny_pending_user_like_result") {
      if (data["result_data"].user_id == this.state.user_id) {
        let dataString = {
          user_action: "get_user",
          user_data: {
            user_id: this.state.user_id
          }
        };

        this.handleEmit(dataString);

        let dataString2 = {
          user_action: "list_user_likes_needing_approval",
          user_data: {}
        };

        this.handleEmit(dataString2);
      }
    }

    //load my profile
    if (data["result_action"] == "get_user_result") {
      const user_profile = data["result_data"];
      //console.log(user_profile);

      if (user_profile["user_name"] == "undefined" || user_profile["user_name"] == null) {
        user_profile["user_name"] = "";
      }
      if (user_profile["user_aboutme"] == "undefined" || (user_profile["user_aboutme"] == "undefined") == null) {
        user_profile["user_aboutme"] = "";
      }
      if (user_profile["file_thumbnail_url"] == "undefined" || user_profile["file_thumbnail_url"] == null) {
        user_profile["file_thumbnail_url"] = "https://media2.wnyc.org/i/1200/627/l/80/1/blackbox.jpeg";
      }
      if (user_profile["file_large_url"] == "undefined" || user_profile["file_large_url"] == null) {
        user_profile["file_large_url"] = "https://media2.wnyc.org/i/1200/627/l/80/1/blackbox.jpeg";
      }

      if (user_profile["files"] == null) {
        user_profile["files"] = [];
      }

      let puffy_likes_id = 0;
      let friend_check = 0;
      let pending_check = 0;
      let user_id = parseInt(user_profile["user_id"]);
      let friend_check1 = parseInt(user_profile["friend_check1"]);
      let friend_check2 = parseInt(user_profile["friend_check2"]);
      let pending_check1 = parseInt(user_profile["pending_check1"]);
      let pending_check2 = parseInt(user_profile["pending_check2"]);
      let block_id = parseInt(user_profile["user_block_id"]);

      if (block_id > 0) {
        user_profile["files"] = [];
      }

      //other user profile.
      if (user_id != this.user_id) {
        return false;
      }

      if (friend_check1 > 0) {
        friend_check = friend_check1;
        puffy_likes_id = friend_check1;
      } else if (friend_check2 > 0) {
        friend_check = friend_check2;
        puffy_likes_id = friend_check2;
      }

      //sent
      if (pending_check1 > 0) {
        pending_check = 1;
        puffy_likes_id = pending_check1;
      } else if (pending_check2 > 0) {
        //request,
        pending_check = 2;
        puffy_likes_id = pending_check2;
      }

      let file_count = user_profile["files"].length;
      let last_id = 0;

      if (file_count > 0) {
        last_id = user_profile["files"][file_count - 1]["file_id"];
      }

      //console.log("file_count", file_count);

      this.setState({
        isLoaded: 1,
        last_id: last_id,
        refreshing: false,
        user_name: user_profile["user_name"],
        action_title: "Unpuff " + user_profile["user_name"],
        reportTitle: "Report " + user_profile["user_name"] + "?",
        user_age: user_profile["user_age"],
        user_location: user_profile["loc"],
        user_aboutme: user_profile["user_aboutme"],
        user_photo: user_profile["file_large_url"],
        user_photo_thumb: user_profile["file_thumbnail_url"],
        user_interest_name1: user_profile["user_interest_name1"],
        user_interest_name2: user_profile["user_interest_name2"],
        user_interest_name3: user_profile["user_interest_name3"],
        user_interest_name4: user_profile["user_interest_name4"],
        user_interest_name5: user_profile["user_interest_name5"],
        block_id: block_id,
        file_count: file_count,
        friend_check: friend_check,
        pending_check: pending_check,
        puffy_likes_id: puffy_likes_id,
        data: user_profile["files"]
      });

      let localData = JSON.stringify(user_profile);

      if (localData) {
        AsyncStorage.setItem("Profile" + user_id, localData);
      }
    }
  }

  showMenu() {
    if (this.ActionSheet) {
      this.ActionSheet.show();
    }
  }

  showMenu2() {
    this.ActionSheet2.show();
  }

  gotoFile(data) {
    this.props.navigation.navigate("File", { data: data });
  }

  gotoMessage() {
    this.props.navigation.navigate("Message", {
      name: this.state.user_name,
      user_id: this.state.user_id
    });
  }

  gotoSettings() {
    this.props.navigation.navigate("ProfileSettings");
  }

  gotoPhoto() {
    this.props.navigation.navigate("Photo", { profile: 1 });
  }

  gotoGallery() {
    this.props.navigation.navigate("Gallery", { profile: 1 });
  }

  gotoFeed() {
    this.props.navigation.navigate("Feed");
  }

  onRefresh() {
    console.log("refresh");

    this.setState({ refreshing: true, pullRefreshing: true });

    if (this.state.activeTab == "Photo") {
      dataString = {
        user_action: "get_profile_feed",
        user_data: {
          last_id: 0,
          user_id: this.state.user_id
        }
      };
    } else {
      dataString = {
        user_action: "get_profile_feed_likes",
        user_data: {
          last_id: 0,
          user_id: this.state.user_id
        }
      };
    }

    this.handleEmit(dataString);
  }

  setTab(tabName) {
    if (this.state.activeTab == tabName) {
      return false;
    }

    this.setState({ activeTab: tabName, data: [], last_id: 0, file_count: 0, file_count: 1 });

    let dataString = "";

    if (tabName == "Photo") {
      dataString = {
        user_action: "get_profile_feed",
        user_data: {
          last_id: 0,
          user_id: this.state.user_id
        }
      };
    } else {
      dataString = {
        user_action: "get_profile_feed_likes",
        user_data: {
          last_id: 0,
          user_id: this.state.user_id
        }
      };
    }

    this.handleEmit(dataString);
  }

  //action menu buton click.
  handlePress(i) {
    if (i == 1) {
      this.removePuffer();
    }
  }

  handlePress2(i) {
    if (i == 1) {
      this.showBlockUser();
    } else if (i == 2) {
      this.showReportUser();
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.msgListenerProfile);
  }

  componentDidMount() {
    AsyncStorage.getItem("Profile" + this.state.user_id, (err, result) => {
      if (!err && result != null) {
        let user_profile = JSON.parse(result);
        //this.setItems(items);

        if (user_profile["user_name"] == "undefined" || user_profile["user_name"] == null) {
          user_profile["user_name"] = "";
        }
        if (user_profile["user_aboutme"] == "undefined" || (user_profile["user_aboutme"] == "undefined") == null) {
          user_profile["user_aboutme"] = "";
        }
        if (user_profile["file_thumbnail_url"] == "undefined" || user_profile["file_thumbnail_url"] == null) {
          user_profile["file_thumbnail_url"] = "https://media2.wnyc.org/i/1200/627/l/80/1/blackbox.jpeg";
        }
        if (user_profile["file_large_url"] == "undefined" || user_profile["file_large_url"] == null) {
          user_profile["file_large_url"] = "https://media2.wnyc.org/i/1200/627/l/80/1/blackbox.jpeg";
        }

        if (user_profile["files"] == null) {
          user_profile["files"] = [];
        }

        let puffy_likes_id = 0;
        let friend_check = 0;
        let pending_check = 0;
        let user_id = parseInt(user_profile["user_id"]);
        let friend_check1 = parseInt(user_profile["friend_check1"]);
        let friend_check2 = parseInt(user_profile["friend_check2"]);
        let pending_check1 = parseInt(user_profile["pending_check1"]);
        let pending_check2 = parseInt(user_profile["pending_check2"]);

        //other user profile.
        if (user_id != this.user_id) {
          return false;
        }

        if (friend_check1 > 0) {
          friend_check = friend_check1;
          puffy_likes_id = friend_check1;
        } else if (friend_check2 > 0) {
          friend_check = friend_check2;
          puffy_likes_id = friend_check2;
        }

        //sent
        if (pending_check1 > 0) {
          pending_check = 1;
          puffy_likes_id = pending_check1;
        } else if (pending_check2 > 0) {
          //request,
          pending_check = 2;
          puffy_likes_id = pending_check2;
        }

        let file_count = user_profile["files"].length;
        let last_id = 0;

        if (file_count > 0) {
          last_id = user_profile["files"][file_count - 1]["file_id"];
        }

        console.log("file_count", file_count);

        this.setState({
          isLoaded: 1,
          user_name: user_profile["user_name"],
          action_title: "Unpuff " + user_profile["user_name"],
          reportTitle: "Report " + user_profile["user_name"] + "?",
          user_age: user_profile["user_age"],
          user_location: user_profile["loc"],
          user_aboutme: user_profile["user_aboutme"],
          user_photo: user_profile["file_large_url"],
          user_photo_thumb: user_profile["file_thumbnail_url"],
          user_interest_name1: user_profile["user_interest_name1"],
          user_interest_name2: user_profile["user_interest_name2"],
          user_interest_name3: user_profile["user_interest_name3"],
          user_interest_name4: user_profile["user_interest_name4"],
          user_interest_name5: user_profile["user_interest_name5"],
          file_count: file_count,
          friend_check: friend_check,
          pending_check: pending_check,
          puffy_likes_id: puffy_likes_id,
          data: user_profile["files"]
        });
      }
    });

    let dataString = {
      user_action: "get_user",
      user_data: {
        user_id: this.state.user_id
      }
    };

    this.handleEmit(dataString);
    this.puffyChannel.on("data_channel", this.msgListenerProfile);
  }

  //load more data for flatlist
  handleLoad() {
    //dont load if we are already loading or not loaded yet.
    if (this.state.last_id == 0 || this.state.refreshing == true) {
      return;
    }
    if (this.state.file_count < 11) {
      return;
    }

    console.log("end reached");

    if (this.state.activeTab == "Photo") {
      setTimeout(() => {
        let dataString = {
          user_action: "get_profile_feed",
          user_data: {
            last_id: this.state.last_id,
            user_id: this.state.user_id
          }
        };

        this.handleEmit(dataString);
      }, 100);
      this.setState({ refreshing: true });
    } else {
      setTimeout(() => {
        let dataString = {
          user_action: "get_profile_feed_likes",
          user_data: {
            last_id: this.state.last_id,
            user_id: this.state.user_id
          }
        };

        this.handleEmit(dataString);
      }, 100);
      this.setState({ refreshing: true });
    }
  }

  setVisibleToTrue() {
    this.setState({ visible: true });
  }

  setVisibleToFalse() {
    this.setState({ visible: false });
  }

  addPuffer() {
    let dataString = {
      user_action: "like_user",
      user_data: {
        user_id: this.user_id,
        likedislike: 1
      }
    };

    this.handleEmit(dataString);
  }

  removePuffer() {
    let dataString = {
      user_action: "remove_friend",
      user_data: {
        row_id: 0,
        user_id: this.user_id,
        puffy_likes_id: this.state.friend_check
      }
    };

    this.handleEmit(dataString);
    this.setState({ friend_check: 0 });
  }

  passPuffRow() {
    //this.items.splice(rowID, 1);

    //emit remove pending
    let dataString = {
      user_action: "approve_deny_pending_user_like",
      user_data: {
        puffy_likes_id: this.state.puffy_likes_id,
        user_id: this.user_id,
        approvedeny: 1
      }
    };

    this.handleEmit(dataString);
    this.props.screenProps.setPufferModalVisible(true, this.state.user_photo_thumb, this.user_id, this.state.user_name);
  }

  showBlockUser() {
    if (this.state.block_id > 0) {
      Alert.alert("Incorrect", "This user is blocked");
      return false;
    }
    Alert.alert(`Block ${this.state.user_name}?`, "", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.blockUser() }]);
  }

  showReportUser() {
    this.ActionSheet3.show();
  }

  blockUser() {
    let dataString = {
      user_action: "block_user",
      user_data: {
        user_id: this.user_id
      }
    };

    this.handleEmit(dataString);
  }

  reportUser(i) {
    let subType = "";

    if (i == 1) {
      subType = "NO PROFILE IMAGE";
    } else if (i == 2) {
      subType = "INAPPROPRIATE PROFILE";
    } else if (i == 3) {
      subType = "SPAM";
    } else {
      return false;
    }

    let dataString = {
      user_action: "report_user",
      user_data: {
        user_id: this.user_id,
        type: "USER",
        subType: subType
      }
    };

    this.handleEmit(dataString);
  }

  removePending() {
    Alert.alert("Cancel Request", `for ${this.state.user_name}`, [
      { text: "No", onPress: () => console.log("No Pressed!") },
      { text: "Yes", onPress: () => this.removePendingRow() }
    ]);
  }

  removePendingRow() {
    //emit remove pending
    let dataString = {
      user_action: "remove_pending_user_like",
      user_data: {
        puffy_likes_id: this.state.puffy_likes_id,
        user_id: this.user_id,
        likedislike: 1
      }
    };

    this.handleEmit(dataString);
  }

  checkPref(pref_name) {
    if (this.props.screenProps.global.user_interest_name1 == pref_name) {
      return 1;
    } else if (this.props.screenProps.global.user_interest_name2 == pref_name) {
      return 1;
    } else if (this.props.screenProps.global.user_interest_name3 == pref_name) {
      return 1;
    } else if (this.props.screenProps.global.user_interest_name4 == pref_name) {
      return 1;
    } else if (this.props.screenProps.global.user_interest_name5 == pref_name) {
      return 1;
    }
    return 0;
  }

  renderRow(data) {
    return (
      <View style={styles.imageBtn}>
        <TouchableWithoutFeedback onPress={() => this.gotoFile(data.item)}>
          <CachedImage key={1} style={styles.image} resizeMode="cover" representation={"thumbnail"} source={{ uri: data.item.file_thumbnail_url, cache: "force-cache" }} />
        </TouchableWithoutFeedback>
        {data.item.file_type == "video/mp4" ? <Image style={styles.vidIcon} source={Images.vid} /> : null}
      </View>
    );
  }

  render() {
    let pref_name1_active = this.checkPref(this.state.user_interest_name1);
    let pref_name2_active = this.checkPref(this.state.user_interest_name2);
    let pref_name3_active = this.checkPref(this.state.user_interest_name3);
    let pref_name4_active = this.checkPref(this.state.user_interest_name4);
    let pref_name5_active = this.checkPref(this.state.user_interest_name5);

    let actionBtn = <View />;

    if (this.state.isLoaded == 0) {
      actionBtn = (
        <View style={styles.detailContainerAction}>
          {Platform.OS === "ios" ? (
            <BtnGradient value="LOADING" textStyle={{ fontSize: 13, fontWeight: "bold", letterSpacing: 10, marginLeft: 10 }} />
          ) : (
            <LinearGradient
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 0.0, y: 1.0 }}
              locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
              colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
              style={styles.btnContainer}
            >
              <TouchableOpacity style={styles.btn}>
                <MyText letterSpacing={1} textAlign="center" style={[styles.textStyleBtn, styles.btnText]}>
                  L O A D I N G
                </MyText>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      );
    } else if (this.myProfile == 1) {
      actionBtn = <View />;
    } else if (this.state.block_id > 0) {
      actionBtn = <View />;
    } else if (this.state.friend_check > 0) {
      actionBtn = (
        <View>
          <View style={styles.detailContainerAction}>
            {Platform.OS === "ios" ? (
              <BtnGradient value="Message" textStyle={{ fontSize: 13, fontWeight: "bold", letterSpacing: 5, marginLeft: 5 }} onPress={this.gotoMessage} />
            ) : (
              <LinearGradient
                start={{ x: 0.0, y: 0.25 }}
                end={{ x: 0.0, y: 1.0 }}
                locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
                colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
                style={styles.btnContainer}
              >
                <TouchableOpacity style={styles.btn} onPress={this.gotoMessage}>
                  <MyText letterSpacing={1} textAlign="center" style={[styles.textStyleBtn, styles.btnText]}>
                    M e s s a g e
                  </MyText>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              this.showMenu();
            }}
            style={styles.puffContainer}
          >
            <Image style={styles.puffIcon} source={Images.puff_person} />
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.pending_check == 2) {
      actionBtn = (
        <View style={styles.detailContainerAction}>
          {Platform.OS === "ios" ? (
            <BtnGradient value="PUFF" textStyle={{ fontSize: 13, fontWeight: "bold", letterSpacing: 10, marginLeft: 10 }} onPress={this.passPuffRow} />
          ) : (
            <LinearGradient
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 0.0, y: 1.0 }}
              locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
              colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
              style={styles.btnContainer}
            >
              <TouchableOpacity style={styles.btn} onPress={this.passPuffRow}>
                <MyText letterSpacing={2} textAlign="center" style={[styles.textStyleBtn, styles.btnText]}>
                  P U F F
                </MyText>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      );
    } else if (this.state.pending_check == 1) {
      actionBtn = (
        <View style={styles.detailContainerAction}>
          <TouchableOpacity
            onPress={() => {
              this.removePendingRow();
            }}
            style={styles.btnPending}
          >
            {Platform.OS === "ios" ? (
              <Text style={styles.btnPendingText}>Pending</Text>
            ) : (
              <MyText letterSpacing={1} textAlign="center" style={styles.btnPendingText}>
                P e n d i n g
              </MyText>
            )}
          </TouchableOpacity>
        </View>
      );
    } else {
      actionBtn = (
        <View style={styles.detailContainerAction}>
          {Platform.OS === "ios" ? (
            <BtnGradient value="PUFF" textStyle={{ fontSize: 13, fontWeight: "bold", letterSpacing: 10, marginLeft: 10 }} onPress={this.addPuffer} />
          ) : (
            <LinearGradient
              start={{ x: 0.0, y: 0.25 }}
              end={{ x: 0.0, y: 1.0 }}
              locations={[0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 1.0]}
              colors={["#23ACC0", "#339FBA", "#4395B7", "#4F8DB4", "#5C84B1", "#697CAE", "#7674AB", "#826DA8"]}
              style={styles.btnContainer}
            >
              <TouchableOpacity style={styles.btn} onPress={this.addPuffer}>
                <MyText letterSpacing={2} textAlign="center" style={[styles.textStyleBtn, styles.btnText]}>
                  P U F F
                </MyText>
              </TouchableOpacity>
            </LinearGradient>
          )}
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftIcon="back_arrow"
          LeftCallback={this.props.navigation.goBack}
          RightIcon={this.myProfile == 1 ? null : "circles_3"}
          RightCallback={this.showMenu2}
          RightIconStyle="menuIcon"
          global={this.props.screenProps.global}
        />
        <View style={styles.containerProfile}>
          <View style={styles.profileContainer}>
            <View style={styles.profileLeft}>
              <TouchableOpacity onPress={this.setVisibleToTrue}>
                <CachedImage style={styles.userPhoto} source={{ uri: this.state.user_photo_thumb, cache: "force-cache" }} />
              </TouchableOpacity> 
            </View>
            <View style={styles.profileRight}>
              <View style={styles.detailContainer}>
                <Text style={styles.detailName}>
                  {this.state.user_name}, {this.state.user_age}
                </Text>
                <Text style={styles.detailLocation}>{this.state.user_location}</Text>
              </View>
              <View style={styles.detailContainerAbout}>
                <Text style={styles.detailAbout}>{this.state.user_aboutme}</Text>
              </View>
              <View style={styles.detailContainerLast}>
                <View style={styles.interestContainer}>
                  <CirclePrefSmall name={this.state.user_interest_name1} active={pref_name1_active} />
                  <CirclePrefSmall name={this.state.user_interest_name2} active={pref_name2_active} />
                  <CirclePrefSmall name={this.state.user_interest_name3} active={pref_name3_active} />
                  <CirclePrefSmall name={this.state.user_interest_name4} active={pref_name4_active} />
                  <CirclePrefSmall name={this.state.user_interest_name5} active={pref_name5_active} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.detailContainerActionWrapper}>{actionBtn}</View>
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => this.setTab("Photo")}>
              <Image style={styles.tabIcon} source={this.state.activeTab == "Photo" ? Images.photo_on : Images.photo_off} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setTab("Heart")}>
              <Image style={styles.tabIcon} source={this.state.activeTab == "Heart" ? Images.love_on : Images.love} />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.file_count > 0 ? (
          <FlatList
            contentContainerStyle={{ alignItems: "flex-start" }}
            data={this.state.data}
            renderItem={this.renderRow}
            columnWrapperStyle={styles.flatList}
            horizontal={false}
            numColumns={3}
            refreshing={this.state.refreshing}
            keyExtractor={item => item.file_id}
            refreshControl={<RefreshControl refreshing={this.state.pullRefreshing} onRefresh={this.onRefresh} tintColor="#57BBC7" colors={["#57BBC7", "#57BBC7", "#57BBC7"]} />}
            onEndReached={this.handleLoad}
            onEndReachedThreshold={5}
            initialNumToRender={15}
            removeClippedSubviews={true}
          />
        ) : (
          <ScrollView>
            {this.state.data === 0 ? null : (
              <View style={styles.profileMessage}>
                <Image style={styles.lockedEye} source={Images.neutral_big} />
                {this.state.block_id > 0 ? (
                  <Text style={styles.profileMessageHeader}>You've blocked this user</Text>
                ) : (
                  <Text style={styles.profileMessageHeader}>{this.state.activeTab == "Heart" ? "Has no likes" : "No posts shared"}</Text>
                )}
              </View>
            )}
          </ScrollView>
        )}
        <ImagePreview visible={this.state.visible} source={{ uri: this.state.user_photo }} close={this.setVisibleToFalse} />
        <ActionSheet ref={o => (this.ActionSheet = o)} title={this.state.action_title} options={options} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress} />
        <ActionSheet
          ref={o => (this.ActionSheet2 = o)}
          options={options2}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          cancelButtonIndex={CANCEL_INDEX}
          onPress={this.handlePress2}
        />
        <ActionSheet ref={o => (this.ActionSheet3 = o)} title={this.state.reportTitle} options={options3} cancelButtonIndex={CANCEL_INDEX} onPress={this.reportUser} />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  containerMenu: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  profileContainer: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 1,
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1
  },
  profileLeft: {
    width: 110,
    height: 110,
    marginRight: 15,
    marginBottom: 4,
    marginTop: 2
  },
  profileRight: {
    flex: 1
  },
  userPhoto: {
    width: 110,
    height: 110,
    resizeMode: "cover",
    borderRadius: 55
  },
  editContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    alignItems: "center",
    bottom: 0,
    left: 0,
    right: 0
  },
  editPhoto: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  editPhotoText: {
    color: "#C7C9C4",
    marginLeft: 5
  },
  editPhotoBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000070",
    width: 32,
    height: 32,
    borderRadius: 16
  },
  headerContainer: {
    paddingBottom: 2
  },
  detailContainer: {
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    paddingBottom: 1
  },
  detailContainerAbout: {},
  detailContainerActionWrapper: {
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    height: 48
  },
  detailContainerAction: {
    marginLeft: 50,
    marginRight: 50
  },
  detailContainerLast: {
    paddingBottom: 8
  },
  detailLeft: {},
  detailRight: {
    position: "absolute",
    top: 16,
    right: 0
  },
  detailName: {
    fontFamily: "Helvetica",
    fontSize: 18,
    fontWeight: "bold"
  },
  detailLocation: {
    fontFamily: "Helvetica",
    fontSize: 14,
    marginTop: 1,
    marginBottom: 5,
    color: "#787E85"
  },
  detailAbout: {
    marginTop: 5,
    marginBottom: 5,
    fontFamily: "Helvetica",
    fontSize: 13,
    textAlign: "center",
    color: "#787E85",
    height: 22
  },
  boldText: {
    fontFamily: "Helvetica",
    fontSize: 12,
    fontWeight: "bold",
    color: "#787E85"
  },
  detailHeader: {
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: "bold",
    color: "#787E85",
    marginTop: 5
  },
  interestHeader: {
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#787E85",
    marginTop: 5,
    marginBottom: 4
  },
  interestContainer: {
    flexDirection: "row",
    marginTop: 1,
    paddingBottom: 1,
    marginLeft: 5,
    marginRight: 12,
    justifyContent: "space-between"
  },
  aboutContainer: {
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 2,
    height: 23
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    paddingBottom: 12,
    paddingLeft: 25,
    paddingRight: 25,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 12,
    marginBottom: 2
  },
  tabIcon: {
    height: 25,
    width: 25,
    resizeMode: "contain"
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
  },
  profileMessage: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center"
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
  },
  profileText: {
    fontSize: 14,
    textAlign: "center",
    color: "#777980"
  },
  puffContainer: {
    position: "absolute",
    top: 2,
    right: 10
  },
  puffIcon: {
    height: 28,
    width: 28,
    resizeMode: "contain"
  },
  pendingContainer: {
    flexDirection: "row"
  },
  btnPass: {
    height: 22,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 12,
    paddingRight: 12,
    marginRight: 7,
    justifyContent: "center"
  },
  btnPassText: {
    color: "#000000",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Helvetica"
  },
  btnPuff: {
    height: 25,
    borderWidth: 1,
    borderColor: "#00AABA",
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "center",
    width: 115,
    marginBottom: 4
  },
  btnPuffText: {
    color: "#00AABA",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Helvetica",
    letterSpacing: 5,
    marginLeft: 5
  },
  settingsIcon: {
    width: 20,
    height: 25,
    resizeMode: "contain"
  },
  row: {
    flexDirection: "row"
  },
  btnPending: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    backgroundColor: "#BFBFBF",
    justifyContent: "center"
  },
  btnPendingText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Helvetica",
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 5,
    marginLeft: 5
  },
  btnContainer: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5
  },
  btn: {
    backgroundColor: "transparent",
    justifyContent: "center"
  },
  btnText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Helvetica"
  },
  textStyleBtn: {
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 10
  },
  vidIcon: {
    position: "absolute",
    top: 2,
    right: 8,
    width: 20,
    height: 25,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  }
};

export { Profile };
