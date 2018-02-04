import React, { Component } from "react";
import { View, Text, Image, Dimensions, Platform, Animated, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import Images from "../config/images";
import { CachedImage } from "react-native-img-cache";
import ActionSheet from "react-native-actionsheet";
import { NavigationActions } from "react-navigation";
import Video from "react-native-video";

const CANCEL_INDEX = 0;
const options = ["Cancel", "Take Photo", "Choose From Gallery"];
const title = "Upload Feed Photo";

class FeedItem extends Component {
  constructor(props) {
    super(props);

    this.handleEmit = this.props.handleEmit.bind(this);
    this.navigation = this.props.navigation;
    this.file_id = this.props.data.file_id;
    this.index = this.props.index;
    this.showMenu = this.showMenu.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.reportPost = this.reportPost.bind(this);
    this.gotoLikers = this.gotoLikers.bind(this);
    this.togglePaused = this.togglePaused.bind(this);
    this.setPaused = this.setPaused.bind(this);
    this.triggerBufferAnimation = this.triggerBufferAnimation.bind(this);
    this.gotoFeedComment = this.gotoFeedComment.bind(this);

    this.onLoad = this.onLoad.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onBuffer = this.onBuffer.bind(this);
    this.routeName = this.props.global.routeName;

    let paused = true;

    if (this.index == 0) {
      paused = false;
    }

    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: "cover",
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: paused,
      skin: "custom",
      ignoreSilentSwitch: null,
      buffering: true,
      isVideo: false,
      animated: new Animated.Value(0)
    };
  }

  showMenu() {
    this.ActionSheet.show();
  }

  gotoLikers() {
    this.props.navigation.navigate("Likers", { file_id: this.file_id });
  }

  reportPost() {
    let dataString = {
      user_action: "report_post",
      user_data: {
        file_id: this.file_id
      }
    };

    this.handleEmit(dataString);
  }

  handlePress(i) {
    if (i == 0) {
      return false;
    }

    //my post
    if (this.props.myPost == 1) {
      this.props.deletePost(this.props.data, this.props.index);
    } else {
      //other post
      this.reportPost();
    }
  }

  onLoad(data) {
    const $this = this;
    $this.triggerBufferAnimation();
    this.setState({ duration: data.duration, isVideo: true });
  }

  onProgress(data) {
    this.setState({ currentTime: data.currentTime });
  }

  triggerBufferAnimation() {
    this.loopingAnimation && this.loopingAnimation.stopAnimation();
    this.loopingAnimation = Animated.loop(
      Animated.timing(this.state.animated, {
        toValue: 1,
        duration: 350
      })
    ).start();
  }

  onBuffer(meta) {
    meta.isBuffering && this.triggerBufferAnimation();

    if (this.loopingAnimation && !meta.isBuffering) {
      this.loopingAnimation.stopAnimation();
    }

    this.setState({
      buffering: meta.isBuffering
    });
  }

  togglePaused() {
    this.setState({ paused: !this.state.paused });
  }

  setPaused(value) {
    if (this.state.paused == value) {
      return false;
    }

    this.setState({ paused: value });
  }

  gotoFeedComment() {
    this.props.navigation.navigate("FeedComment", { file_id: this.file_id });
  }

  render() {
    let props = this.props;
    let like_count = parseInt(props.data.like_count);
    let paused = true;
    let interpolatedAnimation = null;
    let rotateStyle = null;

    if (this.state.isVideo == true) {
      if (this.state.paused == false && this.routeName == this.props.global.routeName) {
        paused = false;
      }
      interpolatedAnimation = this.state.animated.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
      });

      rotateStyle = {
        transform: [{ rotate: interpolatedAnimation }]
      };
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => props.gotoProfile(props.data)}>
            <CachedImage style={styles.avatar} source={{ uri: props.data.file_thumbnail_url }} />
          </TouchableOpacity>
          <View style={styles.nameContainer}>
            <TouchableOpacity onPress={() => props.gotoProfile(props.data)}>
              <Text style={styles.name}>{props.data.user_name}</Text>
            </TouchableOpacity>
            <Text style={styles.data}>{props.data.loc}</Text>
          </View>
          {props.myPost == 1 ? (
            <TouchableOpacity style={styles.dotsContainer} onPress={this.showMenu}>
              <Image style={styles.dotsImg} source={Images.dots3} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.dotsContainer} onPress={this.showMenu}>
              <Image style={styles.dotsImg} source={Images.dots3} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.feedImgContainer}>
          {props.data.file_type == "video/mp4" ? (
            <TouchableWithoutFeedback onPress={() => this.togglePaused()}>
              <View style={this.state.buffering ? styles.buffering : undefined}>
                <Video
                  source={{ uri: props.data.file_large_url }}
                  ref={ref => {
                    this.player = ref;
                  }}
                  style={styles.nativeVideoControls}
                  rate={this.state.rate}
                  paused={paused}
                  volume={this.state.volume}
                  muted={this.state.muted}
                  ignoreSilentSwitch={"ignore"}
                  playInBackground={false}
                  resizeMode={this.state.resizeMode}
                  onLoad={this.onLoad}
                  onBuffer={this.onBuffer}
                  onProgress={this.onProgress}
                  repeat={true}
                  controls={this.state.controls}
                />
                <Image style={styles.vidIcon} source={Images.vid} />
                <View style={styles.videoCover}>
                  {this.state.buffering && (
                    <Animated.View style={rotateStyle}>
                      <Image style={styles.bufferIcon} source={Images.buffering} />
                    </Animated.View>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback onPress={() => props.likePhoto(props.data)}>
              <CachedImage style={styles.itemUri} source={{ uri: props.data.file_large_url }} />
            </TouchableWithoutFeedback>
          )}
          {props.myPost == 1 ? (
            <View>
              {like_count > 0 ? (
                <View style={styles.loveImgContainer}>
                  <TouchableOpacity onPress={this.gotoLikers}>
                    <View>
                      <Image style={styles.loveImgLiker} source={Images.love_on} />
                      <Text style={styles.likerText}>Likers+</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this.gotoFeedComment}>
                    <View>
                      <Image style={styles.commenterImg} source={Images.message_friend} />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ) : (
            <View>
              {props.data.likes == null ? (
                <TouchableWithoutFeedback onPress={() => props.likePhoto(props.data)}>
                  <Image style={styles.loveImg} source={Images.love_off} />
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback onPress={() => props.unlikePhoto(props.data)}>
                  <Image style={styles.loveImg} source={Images.love_on} />
                </TouchableWithoutFeedback>
              )}
            </View>
          )}
          <Text style={styles.aboutText}>{props.data.file_caption}</Text>
        </View>
        <Text style={styles.timeAgo}>{props.data.timeago}</Text>
        {props.myPost == 1 ? (
          <ActionSheet ref={o => (this.ActionSheet = o)} options={["Cancel", "Delete Post"]} cancelButtonIndex={0} onPress={this.handlePress} />
        ) : (
          <ActionSheet ref={o => (this.ActionSheet = o)} options={["Cancel", "Report Post"]} cancelButtonIndex={0} onPress={this.handlePress} />
        )}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 5,
    marginBottom: 5,
    marginRight: 5
  },
  nameContainer: {
    justifyContent: "center",
    marginLeft: 5
  },
  avatar: {
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    height: 50,
    width: 50,
    resizeMode: "cover"
  },
  feedImgContainer: {
    position: "relative",
    height: Dimensions.get("window").width
  },
  itemUri: {
    width: null,
    height: Dimensions.get("window").width,
    resizeMode: "contain"
  },
  loveImgContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
    left: 10,
    backgroundColor: "transparent"
  },
  loveImgLiker: {
    width: 40,
    height: 40
  },
  commenterImg: {
    width: 50,
    height: 50,
    paddingBottom: 10
  },
  likerText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Helvetica"
  },
  loveImg: {
    width: 40,
    height: 42,
    resizeMode: "contain",
    position: "absolute",
    bottom: 30,
    left: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  aboutText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    color: "#FFFFFF",
    backgroundColor: "#60606050",
    fontFamily: "Helvetica",
    fontSize: 16,
    textAlign: "center",
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 4,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5
  },
  dotsContainer: {
    //marginLeft: "auto"
    position: "absolute",
    top: 5,
    right: 0
  },
  dotsImg: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginLeft: "auto"
  },
  timeAgo: {
    color: "#505050",
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 13,
    fontFamily: "Helvetica"
  },
  nativeVideoControls: {
    width: null,
    height: Dimensions.get("window").width
  },
  buffering: {
    backgroundColor: "#000"
  },
  bufferIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain"
  },
  videoCover: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent"
  },
  vidIcon: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 28,
    height: 33,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  }
};

export default FeedItem;
