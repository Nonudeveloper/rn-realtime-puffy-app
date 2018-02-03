import React, { Component } from "react";
import { View, Text, Image, AsyncStorage, FlatList, Dimensions, RefreshControl, TouchableWithoutFeedback, Platform } from "react-native";
import { CachedImage } from "react-native-img-cache";
import Images from "../config/images";
import Video from "react-native-video";

class Explorer extends Component {
  constructor(props) {
    super(props);

    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.ExplorerListener = this.ExplorerListener.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.gotoFile = this.gotoFile.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.routeName = "index2";

    this.state = {
      isLoaded: 0,
      last_id: 0,
      refreshing: false,
      pullRefreshing: false,
      selected: false,
      data: []
    };
  }

  ExplorerListener(data) {
    if (data["result"] == 0 && data["result_action"] == "get_explorer_feed_more_result") {
      this.setState({
        refreshing: false,
        pullRefreshing: false
      });
    }

    //append feed images
    if (data["result"] == 1 && data["result_action"] == "get_explorer_feed_more_result") {
      let file_count = data["result_data"].length;
      let last_id = 0;

      if (file_count > 0) {
        last_id = data["result_data"][file_count - 1]["file_id"];
      }

      this.setState({
        data: [...this.state.data, ...data.result_data],
        selected: !this.state.selected,
        last_id: last_id,
        pullRefreshing: false,
        refreshing: false
      });
    }

    if (data["result"] == 0 && data["result_action"] == "get_explorer_feed_result") {
      this.setState({
        refreshing: false,
        pullRefreshing: false
      });
      AsyncStorage.removeItem("ExplorerFeedRows");
    }

    if (data["result"] == 1 && data["result_action"] == "get_explorer_feed_result") {
      let file_count = data["result_data"].length;
      let last_id = 0;

      if (file_count > 0) {
        last_id = data["result_data"][file_count - 1]["file_id"];
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
        AsyncStorage.setItem("ExplorerFeedRows", localData);
      }
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.ExplorerListener);
  }

  componentDidMount() {
    AsyncStorage.getItem("ExplorerFeedRows", (err, result) => {
      if (!err && result != null) {
        let items = JSON.parse(result);

        this.setState({
          data: items,
          selected: !this.state.selected,
          isLoaded: 1
        });
      }
    });

    let dataString = {
      user_action: "get_explorer_feed",
      user_data: {}
    };

    console.log(dataString);

    this.handleEmit(dataString);

    this.puffyChannel.on("data_channel", this.ExplorerListener);
  }

  gotoFile(data) {
    console.log(data);

    this.props.navigation.navigate("File", { data: data });
  }

  onRefresh() {
    //console.log("refresh");
    this.setState({ last_id: 0, refreshing: true, pullRefreshing: true });

    let dataString = {
      user_action: "get_explorer_feed",
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
        user_action: "get_explorer_feed",
        user_data: {
          last_id: this.state.last_id
        }
      };

      console.log(dataString);

      this.handleEmit(dataString);
    }, 500);
  }

  renderHeader() {
    let paused = true;
    if (this.routeName == this.props.screenProps.global.routeName) {
      paused = false;
    }

    return (
      <View>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableWithoutFeedback>
              <Video
                source={{ uri: "https://puffy-vuploads.s3.amazonaws.com/uploads/2018/2/3/1-1517625319.mp4" }}
                ref={ref => {
                  this.player = ref;
                }}
                style={styles.headerImage}
                rate={1}
                paused={paused}
                volume={0}
                muted={true}
                ignoreSilentSwitch={"ignore"}
                playInBackground={false}
                resizeMode="cover"
                repeat={true}
                controls={false}
              />
            </TouchableWithoutFeedback>
            <Image style={styles.vidIcon} source={Images.vid} />
          </View>
          <View style={styles.headerRight}>
            <View style={styles.imageBtn}>
              <TouchableWithoutFeedback>
                <CachedImage
                  key={1}
                  style={styles.headerImageSmall}
                  resizeMode="cover"
                  representation={"thumbnail"}
                  source={{ uri: "https://puffy-uploadsresized.s3.amazonaws.com/resized-uploads/2018/2/3/75416-1517625427.jpg", cache: "force-cache" }}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.imageBtn}>
              <TouchableWithoutFeedback>
                <CachedImage
                  key={1}
                  style={styles.headerImageSmallBottom}
                  resizeMode="cover"
                  representation={"thumbnail"}
                  source={{ uri: "https://puffy-uploadsresized.s3.amazonaws.com/resized-uploads/2018/2/3/75416-1517625427.jpg", cache: "force-cache" }}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <View style={styles.headerBottom}>
          <View style={styles.headerBottomLeft}>
            <View style={styles.imageBtn}>
              <TouchableWithoutFeedback>
                <CachedImage
                  key={1}
                  style={styles.headerImageSmall}
                  resizeMode="cover"
                  representation={"thumbnail"}
                  source={{ uri: "https://puffy-uploadsresized.s3.amazonaws.com/resized-uploads/2018/2/3/75416-1517625427.jpg", cache: "force-cache" }}
                />
              </TouchableWithoutFeedback>
              <Image style={styles.vidIcon} source={Images.vid} />
            </View>
            <View style={styles.imageBtn}>
              <TouchableWithoutFeedback>
                <CachedImage
                  key={1}
                  style={styles.headerImageSmallBottom}
                  resizeMode="cover"
                  representation={"thumbnail"}
                  source={{ uri: "https://puffy-uploadsresized.s3.amazonaws.com/resized-uploads/2018/2/3/75416-1517625427.jpg", cache: "force-cache" }}
                />
              </TouchableWithoutFeedback>
              <Image style={styles.vidIcon} source={Images.vid} />
            </View>
          </View>
          <View style={styles.headerBottomRight}>
            <TouchableWithoutFeedback>
              <CachedImage
                key={1}
                style={styles.headerImage}
                resizeMode="cover"
                source={{ uri: "https://puffy-uploads.s3.amazonaws.com/uploads/2018/2/3/75444-1517626989.jpg", cache: "force-cache" }}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }

  renderRow(row) {
    return (
      <View style={styles.imageBtn}>
        <TouchableWithoutFeedback onPress={() => this.gotoFile(row.item)}>
          <CachedImage key={1} style={styles.image} resizeMode="cover" representation={"thumbnail"} source={{ uri: row.item.file_thumbnail_url, cache: "force-cache" }} />
        </TouchableWithoutFeedback>
        {row.item.file_type == "video/mp4" ? <Image style={styles.vidIcon} source={Images.vid} /> : null}
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
        data={this.state.data}
        extraData={this.state.selected}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderRow}
        enableEmptySections={false}
        removeClippedSubviews={Platform.OS === "android" ? true : false}
        initialNumToRender={15}
        columnWrapperStyle={styles.flatList}
        horizontal={false}
        numColumns={3}
        keyExtractor={item => item.file_id}
        refreshControl={
          <RefreshControl refreshing={this.state.pullRefreshing} onRefresh={this.onRefresh} tintColor="#57BBC7" titleColor="#000" colors={["#57BBC7", "#57BBC7", "#57BBC7"]} />
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
  header: {
    flexDirection: "row",
    marginLeft: 2
  },
  headerBottom: {
    flexDirection: "row",
    marginTop: 2
  },
  headerLeft: {
    width: Dimensions.get("window").width * 0.655,
    height: Dimensions.get("window").width * 0.655
  },
  headerRight: {
    width: Dimensions.get("window").width * 0.322,
    height: Dimensions.get("window").width * 0.322
  },
  headerBottomLeft: {
    width: Dimensions.get("window").width * 0.33,
    height: Dimensions.get("window").width * 0.33
  },
  headerBottomRight: {
    marginLeft: 2,
    marginRight: 2,
    width: Dimensions.get("window").width * 0.655,
    height: Dimensions.get("window").width * 0.655
  },
  headerImage: {
    marginRight: 2,
    width: Dimensions.get("window").width * 0.655,
    height: Dimensions.get("window").width * 0.655
  },
  headerImageSmall: {
    resizeMode: "cover",
    borderRadius: 5,
    width: Dimensions.get("window").width * 0.322,
    height: Dimensions.get("window").width * 0.322
  },
  headerImageSmallBottom: {
    resizeMode: "cover",
    borderRadius: 5,
    width: Dimensions.get("window").width * 0.322,
    height: Dimensions.get("window").width * 0.322,
    marginTop: 2
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
    width: Dimensions.get("window").width * 0.322,
    height: Dimensions.get("window").width * 0.322
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

export { Explorer };
