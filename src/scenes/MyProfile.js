import React, { Component } from "react";
import { View, Text, Image, FlatList, RefreshControl, TouchableOpacity, TouchableWithoutFeedback, Dimensions, AsyncStorage, ScrollView, Platform } from "react-native";
import ActionSheet from "react-native-actionsheet";
import { CachedImage } from "react-native-img-cache";
import Images from "../config/images";
import CirclePrefSmall from "../components/CirclePrefSmall";
import ImagePreview from "react-native-image-preview";
import Header from "../components/Header";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Take Photo", "Choose From Gallery"];
const title = "Change Profile Photo";
const options2 = ["Cancel", "Take Photo", "Take Video", "Choose From Gallery"];
const title2 = "Upload Feed Photo";

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.gotoSettings = this.gotoSettings.bind(this);
    this.gotoPhoto = this.gotoPhoto.bind(this);
    this.gotoGallery = this.gotoGallery.bind(this);
    this.gotoFeed = this.gotoFeed.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.showMenu2 = this.showMenu2.bind(this);
    this.gotoFeedPhoto = this.gotoFeedPhoto.bind(this);
    this.gotoFeedGallery = this.gotoFeedGallery.bind(this);
    this.gotoFeedVideo = this.gotoFeedVideo.bind(this);
    this.handlePress2 = this.handlePress2.bind(this);
    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.msgListenerMyProfile = this.msgListenerMyProfile.bind(this);
    this.setVisibleToFalse = this.setVisibleToFalse.bind(this);
    this.setVisibleToTrue = this.setVisibleToTrue.bind(this);
    this.gotoFile = this.gotoFile.bind(this);
    this.gotoGroup = this.gotoGroup.bind(this);
    this.setTab = this.setTab.bind(this);
    this.onRefresh = this.onRefresh.bind(this);

    this.state = {
      user_name: "",
      user_age: "",
      user_location: "",
      user_aboutme: "",
      user_photo: "",
      user_photo_thumb: "",
      user_interest_name1: "",
      user_interest_name2: "",
      user_interest_name3: "",
      user_interest_name4: "",
      user_interest_name5: "",
      friend_count: " ",
      request_count: " ",
      sent_count: " ",
      file_count: 0,
      refreshing: true,
      pullRefreshing: false,
      visible: false,
      data: 0,
      last_id: 0,
      activeTab: "Photo"
    };
  }

  msgListenerMyProfile(data) {
    const $this = this;

    //no more images
    if (data["result"] == 0 && data["result_action"] == "get_my_profile_feed_likes_result") {
      if (this.state.last_id == 0) {
        this.setState({
          refreshing: false,
          pullRefreshing: false,
          file_count: 0,
          data: []
        });
      } else {
        this.setState({
          pullRefreshing: false,
          refreshing: false
        });
      }
    }

    if (data["result"] == 0 && data["result_action"] == "get_my_profile_feed_result") {
      if (this.state.last_id == 0) {
        this.setState({
          refreshing: false,
          pullRefreshing: false,
          file_count: 0,
          data: []
        });
        AsyncStorage.removeItem("ProfileFeed");
      } else {
        this.setState({
          pullRefreshing: false,
          refreshing: false
        });
      }
    }

    if (data["result"] == 1 && data["result_action"] == "delete_feed_result") {
      if (this.state.activeTab == "Heart") {
        return false;
      }
      let dataString = {
        user_action: "get_my_feed",
        user_data: {
          last_id: 0
        }
      };

      $this.handleEmit(dataString);
    }

    if (data["result"] == 1 && data["result_action"] == "file_upload_result") {
      if (this.state.activeTab == "Heart") {
        return false;
      }
      setTimeout(function() {
        let dataString = {
          user_action: "get_my_feed",
          user_data: {
            last_id: 0
          }
        };

        $this.handleEmit(dataString);
      }, 3000);
    }

    if (data["result"] == 1 && data["result_action"] == "add_update_like_result") {
      if (this.state.activeTab == "Photo") {
        return false;
      }

      let dataString = {
        user_action: "get_my_feed_likes",
        user_data: {
          last_id: 0
        }
      };

      this.handleEmit(dataString);
    }

    //append feed images
    if (data["result"] == 1 && data["result_action"] == "get_my_profile_feed_likes_result") {
      if (this.state.activeTab == "Photo") {
        return false;
      }

      let file_count = data["result_data"]["rows"].length;
      let last_id = 0;

      if (file_count > 0) {
        last_id = data["result_data"]["rows"][file_count - 1]["file_id"];
      }

      if (data["result_data"]["last_id"] == 0 || data["result_data"]["last_id"] == null) {
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

    if (data["result"] == 1 && data["result_action"] == "get_my_profile_feed_result") {
      if (this.state.activeTab == "Heart") {
        return false;
      }

      let file_count = data["result_data"]["rows"].length;
      let last_id = 0;

      if (file_count > 0) {
        last_id = data["result_data"]["rows"][file_count - 1]["file_id"];
      }

      if (data["result_data"]["last_id"] == 0 || data["result_data"]["last_id"] == null) {
        this.setState({
          data: data.result_data.rows,
          last_id: last_id,
          refreshing: false,
          pullRefreshing: false,
          file_count: file_count
        });

        //console.log(data.result_data.rows);

        let localData = JSON.stringify(data.result_data.rows);

        if (localData) {
          AsyncStorage.setItem("ProfileFeed", localData);
        }
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

    if (data["result"] == 1 && data["result_action"] == "get_friend_count_result") {
      this.setState({
        friend_count: data["result_data"]["friend_count"],
        request_count: data["result_data"]["request_count"],
        sent_count: data["result_data"]["sent_count"]
      });

      let localData = JSON.stringify(data.result_data);

      if (localData) {
        AsyncStorage.setItem("FriendCount", localData);
      }
    }
  }

  showMenu() {
    if (this.props.screenProps.global.upload == true) {
      return false;
    }

    this.ActionSheet.show();
  }

  gotoSettings() {
    this.props.navigation.navigate("ProfileSettings");
  }

  gotoFile(data) {
    this.props.navigation.navigate("File", { data: data });
  }

  gotoPhoto() {
    this.props.navigation.navigate("Photo", { profile: 1, photo: 2 });
  }

  gotoGallery() {
    this.props.navigation.navigate("Gallery", { profile: 1, gallery: 2 });
  }

  gotoFeed() {
    this.props.navigation.navigate("Feed");
  }

  gotoGroup(tabName) {
    this.props.navigation.navigate("Group", { tab: tabName });
  }

  showMenu2() {
    if (this.props.screenProps.global.upload == true) {
      return false;
    }

    this.ActionSheet2.show();
  }

  gotoFeedGallery() {
    this.props.navigation.navigate("Gallery", { feed: 1, gallery: 2 });
  }

  gotoFeedPhoto() {
    this.props.navigation.navigate("Photo", { feed: 1 });
  }

  gotoFeedVideo() {
    this.props.navigation.navigate("Video", { feed: 1 });
  }

  onRefresh() {
    //console.log("refresh");

    this.setState({ refreshing: true, pullRefreshing: true });

    if (this.state.activeTab == "Photo") {
      dataString = {
        user_action: "get_my_feed",
        user_data: {
          last_id: 0
        }
      };
    } else {
      dataString = {
        user_action: "get_my_feed_likes",
        user_data: {
          last_id: 0
        }
      };
    }

    this.handleEmit(dataString);
  }

  setTab(tabName) {
    if (this.state.activeTab == tabName) {
      return false;
    }

    this.setState({ activeTab: tabName, data: [], last_id: 0, file_count: 1 });

    let dataString = "";

    if (tabName == "Photo") {
      dataString = {
        user_action: "get_my_feed",
        user_data: {
          last_id: 0
        }
      };
    } else {
      dataString = {
        user_action: "get_my_feed_likes",
        user_data: {
          last_id: 0
        }
      };
    }

    this.handleEmit(dataString);
  }

  //action menu buton click.
  handlePress(i) {
    if (i == 1) {
      this.gotoPhoto();
    } else if (i == 2) {
      this.gotoGallery();
    }
  }

  handlePress2(i) {
    if (i == 1) {
      this.gotoFeedPhoto();
    } else if (i == 2) {
      this.gotoFeedVideo();
    } else if (i == 3) {
      this.gotoFeedGallery();
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.msgListenerMyProfile);
  }

  componentDidMount() {
    AsyncStorage.getItem("ProfileFeed", (err, result) => {
      if (!err && result != null) {
        let items = JSON.parse(result);
        let file_count = items.length;
        this.setState({
          data: items,
          file_count: file_count
        });
      }
    });

    AsyncStorage.getItem("FriendCount", (err, result) => {
      if (!err && result != null) {
        let items = JSON.parse(result);
        this.setState({
          friend_count: items.friend_count,
          request_count: items.request_count,
          sent_count: items.sent_count
        });
      }
    });

    let dataString = {
      user_action: "get_my_feed",
      user_data: {}
    };

    this.handleEmit(dataString);

    let dataString2 = {
      user_action: "get_friend_count",
      user_data: {}
    };

    this.handleEmit(dataString2);

    this.puffyChannel.on("data_channel", this.msgListenerMyProfile);
  }

  //load more data for flatlist
  handleLoad() {
    //dont load if we are already loading or not loaded yet.
    if (this.state.last_id == 0 || this.state.refreshing == true) {
      return;
    }
    if (this.state.file_count < 17) {
      return;
    }

    if (this.state.activeTab == "Photo") {
      setTimeout(() => {
        let dataString = {
          user_action: "get_my_feed",
          user_data: {
            last_id: this.state.last_id
          }
        };

        this.handleEmit(dataString);
      }, 100);
      this.setState({ refreshing: true });
    } else {
      setTimeout(() => {
        let dataString = {
          user_action: "get_my_feed_likes",
          user_data: {
            last_id: this.state.last_id
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

  renderRow(data) {
    let { file_thumbnail_url } = data.item;
		if (file_thumbnail_url.includes('https://puffy-uploadsresized.s3.amazonaws.com/resized-uploads')){
			file_thumbnail_url = file_thumbnail_url.replace('https://puffy-uploadsresized.s3.amazonaws.com/resized-uploads', 'https://s3-us-west-2.amazonaws.com/puffy.assets/uploadsresized/resized-uploads');
		}
		if (file_thumbnail_url.includes('http://puffy.assets.s3.amazonaws.com/uploadsresized/resized-uploads')){
			file_thumbnail_url = file_thumbnail_url.replace('http://puffy.assets.s3.amazonaws.com/uploadsresized/resized-uploads', 'http://puffy.assets.s3.amazonaws.com/uploads/uploads');
		}
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
    let actionBtn = (
      <View style={styles.detailContainerAction}>
        <TouchableOpacity style={styles.statRow} onPress={() => this.gotoGroup("Puffers")}>
          <Text style={styles.statText}>{this.state.friend_count}</Text>
          <Text style={styles.statHeader}>Puffers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statRow} onPress={() => this.gotoGroup("Requests")}>
          <Text style={styles.statText}>{this.state.request_count}</Text>
          <Text style={styles.statHeader}>Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statRow} onPress={() => this.gotoGroup("Sent")}>
          <Text style={styles.statText}>{this.state.sent_count}</Text>
          <Text style={styles.statHeader}>Sent</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftIcon="photo_plus"
          LeftCallback={this.showMenu2}
          RightIcon="white_setting_button"
          RightCallback={this.gotoSettings}
          RightIconStyle="settingsIcon"
          global={this.props.screenProps.global}
        />
        <View style={styles.containerProfile}>
          <View style={styles.profileContainer}>
            <View style={styles.profileLeft}>
              <TouchableOpacity onPress={this.showMenu}>
                <CachedImage style={styles.userPhoto} source={{ uri: this.props.screenProps.global.user_thumb, cache: "force-cache" }} />
              </TouchableOpacity>
              <View style={styles.editContainer}>
                <TouchableOpacity style={styles.editPhotoBtn} onPress={this.showMenu}>
                  <Text style={styles.editPhotoText}>edit</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.profileRight}>
              <View style={styles.detailContainer}>
                <Text style={styles.detailName}>
                  {this.props.screenProps.global.user_name}, {this.props.screenProps.global.user_age}
                </Text>
                <Text style={styles.detailLocation}>{this.props.screenProps.global.user_location}</Text>
              </View>
              <View style={styles.detailContainerAbout}>
                <Text style={styles.detailAbout}>{this.props.screenProps.global.user_aboutme}</Text>
              </View>
              <View style={styles.detailContainerLast}>
                <View style={styles.interestContainer}>
                  <CirclePrefSmall name={this.props.screenProps.global.user_interest_name1} active={1} />
                  <CirclePrefSmall name={this.props.screenProps.global.user_interest_name2} active={1} />
                  <CirclePrefSmall name={this.props.screenProps.global.user_interest_name3} active={1} />
                  <CirclePrefSmall name={this.props.screenProps.global.user_interest_name4} active={1} />
                  <CirclePrefSmall name={this.props.screenProps.global.user_interest_name5} active={1} />
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
            removeClippedSubviews={Platform.OS === "android" ? true : false}
            initialNumToRender={15}
            horizontal={false}
            numColumns={3}
            refreshing={this.state.refreshing}
            keyExtractor={item => item.file_id}
            refreshControl={<RefreshControl refreshing={this.state.pullRefreshing} onRefresh={this.onRefresh} tintColor="#57BBC7" colors={["#57BBC7", "#57BBC7", "#57BBC7"]} />}
            onEndReached={this.handleLoad}
            onEndReachedThreshold={5}
          />
        ) : (
          <ScrollView>
            {this.state.data === 0 ? null : (
              <View style={styles.profileMessage}>
                <Image style={styles.lockedEye} source={Images.puff} />
                <Text style={styles.profileMessageHeader}>{this.state.activeTab == "Heart" ? "You have no likes!" : "You have no photos!"}</Text>
                <Text style={styles.profileText}>{this.state.activeTab == "Heart" ? "" : "Start sharing photos with your Puffers"}</Text>
                <Text style={styles.profileText}>{this.state.activeTab == "Heart" ? "" : "by clicking the Puffers Feed Button on the top left"}</Text>
              </View>
            )}
          </ScrollView>
        )}
        <ImagePreview visible={this.state.visible} source={{ uri: this.state.user_photo }} close={this.setVisibleToFalse} />
        <ActionSheet ref={o => (this.ActionSheet = o)} title={title} options={options} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress} />
        <ActionSheet ref={o => (this.ActionSheet2 = o)} title={title2} options={options2} cancelButtonIndex={CANCEL_INDEX} onPress={this.handlePress2} />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  containerProfile: {},
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
    color: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 16,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  editPhotoBtn: {
    paddingTop: 3,
    paddingBottom: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
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
    flexDirection: "row",
    justifyContent: "space-between",
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
  statRow: {},
  statHeader: {
    color: "#808080",
    fontFamily: "Helvetica",
    fontSize: 13
  },
  statText: {
    textAlign: "center",
    color: "#181818",
    fontWeight: "bold",
    fontFamily: "Helvetica",
    fontSize: 14
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

export { MyProfile };
