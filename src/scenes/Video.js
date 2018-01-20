import React, { Component } from "react";
import { View, TouchableOpacity, Text, Image, Dimensions, Alert, Linking, Platform } from "react-native";
import Camera from "react-native-camera";
import Images from "../config/images";
import { HeaderCamera } from "../components";
import ImageResizer from "react-native-image-resizer";
import Permissions from "react-native-permissions";
import OpenSettings from "react-native-open-settings";
import { ProcessingManager } from "react-native-video-processing";

class Video extends Component {
  constructor(props) {
    super(props);

    this.openSettings = this.openSettings.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.trimVideo = this.trimVideo.bind(this);
    this.setTimePassed = this.setTimePassed.bind(this);
    this.compressVideo = this.compressVideo.bind(this);
    this.checkVideo = this.checkVideo.bind(this);
    this.getThumb = this.getThumb.bind(this);
    this.gotoVideoConfirm = this.gotoVideoConfirm.bind(this);
    this.key = this.props.navigation.state.key;

    this.camera = null;
    this.checkTime;

    this.state = {
      cameraPermission: true,
      photoPermission: true,
      microphonePermission: true,
      recording: false,
      isLoaded: 0,
      takePhoto: 0,
      photoClick: 0,
      timePassed: 0,
      timePassedB: 10,
      camera: {
        cropToPreview: true,
        mirrorImage: false,
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        captureQuality: "480p",
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.off
      }
    };
  }

  componentDidMount() {
    Permissions.checkMultiple(["camera", "photo", "microphone"]).then(response => {
      this.setState({ cameraPermission: response.camera, photoPermission: response.photo, microphonePermission: response.microphone, isLoaded: 1 });

      if (response.camera == "undetermined") {
        Permissions.request("camera").then(response => {
          this.setState({ cameraPermission: response });
        });
      }
      if (response.photo == "undetermined") {
        Permissions.request("photo").then(response => {
          this.setState({ photoPermission: response });
        });
      }
      if (response.microphone == "undetermined") {
        Permissions.request("microphone").then(response => {
          this.setState({ microphonePermission: response });
        });
      }
    });
  }

  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType
      }
    });
  };

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      icon = Images.flip_cam_white;
    } else if (this.state.camera.type === front) {
      icon = Images.flip_cam_white;
    }

    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = on;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode
      }
    });
  };

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = Images.flash_icon_white;
    } else if (this.state.camera.flashMode === on) {
      icon = Images.flash_icon_white;
    } else if (this.state.camera.flashMode === off) {
      icon = Images.no_flash_icon_white;
    }

    return icon;
  }

  doubleClick() {
    // console.log("double click");
  }

  startRecord() {
    //console.log("start recording");
    const $this = this;

    if (this.state.recording === true) {
      return false;
    }

    if (this.camera) {
      this.camera
        .capture({ audio: true, mode: Camera.constants.CaptureMode.video })
        .then(data => this.showConfirm(data))
        .catch(err => console.log(err));
    }

    this.setState({ recording: true, timePassed: 0, timePassedB: 10 });

    this.checkTime = setInterval(() => {
      $this.setTimePassed();
    }, 1000);
  }

  setTimePassed() {
    let timePassed = this.state.timePassed + 1;
    let timePassedB = 10 - timePassed;

    if (timePassed > 10) {
      this.stopRecord();
    } else {
      this.setState({ timePassed: timePassed, timePassedB: timePassedB });
    }
  }

  stopRecord() {
    // console.log("stop recording");

    if (this.state.recording === true) {
      clearInterval(this.checkTime);

      if (this.state.timePassed == 0 || this.state.timePassed == 1) {
        this.setState({ recording: false, timePassed: 0, timePassedB: 10 });
        return false;
      }

      this.camera.stopCapture();
    }
  }

  checkVideo(video) {
    ProcessingManager.getVideoInfo(video).then(({ duration, size }) => this.trimVideo(video, duration, size.width, size.height));
  }

  showConfirm(data) {
    const $this = this;

    if (this.state.recording === false) {
      return false;
    }

    if (data.width == null) {
      this.checkVideo(data.path);
    } else {
      this.trimVideo(data.path, data.duration, data.width, data.height);
    }
  }

  focusChange() {
    return true;
  }

  zoomChange() {
    return true;
  }

  openSettings() {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      OpenSettings.openSettings();
    }
  }

  trimVideo(video, duration, width, height) {
    const options = {
      startTime: 0,
      endTime: 10
    };

    console.log("video:" + video);
    console.log("width:" + width);
    console.log("height:" + height);
    console.log("duration:" + duration);

    if (duration > 10) {
      //console.log("trimming video");
      ProcessingManager.trim(video, options).then(data => this.compressVideo(data, duration, width, height));
    } else {
      // console.log("skip trimming");
      this.compressVideo(video, duration, width, height);
    }
  }

  compressVideo(video, duration, srcWidth, srcHeight) {
    const maxWidth = 720;
    const maxHeight = 1280;

    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    let newWidth = srcWidth;
    let newHeight = srcHeight;

    if (srcHeight > maxHeight || srcWidth > maxWidth) {
      newWidth = srcWidth * ratio;
      newHeight = srcHeight * ratio;
    }

    const options = {
      width: newWidth,
      height: newHeight
    };

    console.log("new");
    console.log(options);
    console.log(video);

    //data.source android
    ProcessingManager.compress(video, options).then(data => this.getThumb(data));

    /*
    let newWidth = 480;
    let newHeight = 480;

    if (srcHeight > 639 && srcWidth > 639) {
      newWidth = 640;
      newHeight = 640;
    }

    const options = {
      width: newWidth,
      height: newHeight
    };

    ProcessingManager.compress(video, options).then(data => this.getThumb(data));

    */
  }

  getThumb(video) {
    const maximumSize = { width: 150, height: 150 };
    console.log(video);

    ProcessingManager.getPreviewForSecond(video.source, 1, maximumSize, "JPEG")
      .then(data => this.gotoVideoConfirm(video.source, data.uri))
      .catch(console.warn);
  }

  gotoVideoConfirm(video, thumb) {
    this.setState({ recording: false, timePassed: 0 });

    console.log("video:" + video);
    console.log("thumb:" + thumb);

    this.props.navigation.navigate("VideoConfirm", { video: video, thumb: thumb, data: this.props.navigation.state.params, key: this.key });
  }

  noPhoto() {
    return (
      <View style={styles.container}>
        <HeaderCamera navigation={this.props.navigation} deviceTheme={this.props.screenProps.deviceTheme} cancel={true} next={false} nextText="Next">
          Video
        </HeaderCamera>

        <View style={styles.profileMessage}>
          <Image style={styles.lockedEye} source={Images.camera_icon} />
          <Text style={styles.profileMessageHeader}>Allow access to your photos to start taking videos</Text>
          <TouchableOpacity style={styles.btn} onPress={this.openSettings}>
            <Text style={styles.btnText}>Go to Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  noCamera() {
    return (
      <View style={styles.container}>
        <HeaderCamera navigation={this.props.navigation} deviceTheme={this.props.screenProps.deviceTheme} cancel={true} next={false} nextText="Next">
          Video
        </HeaderCamera>

        <View style={styles.profileMessage}>
          <Image style={styles.lockedEye} source={Images.camera_icon} />
          <Text style={styles.profileMessageHeader}>Allow access to your camera to start taking videos</Text>
          <TouchableOpacity style={styles.btn} onPress={this.openSettings}>
            <Text style={styles.btnText}>Go to Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  noMicrophone() {
    return (
      <View style={styles.container}>
        <HeaderCamera navigation={this.props.navigation} deviceTheme={this.props.screenProps.deviceTheme} cancel={true} next={false} nextText="Next">
          Video
        </HeaderCamera>

        <View style={styles.profileMessage}>
          <Image style={styles.lockedEye} source={Images.camera_icon} />
          <Text style={styles.profileMessageHeader}>Allow access to your microphone to start taking videos</Text>
          <TouchableOpacity style={styles.btn} onPress={this.openSettings}>
            <Text style={styles.btnText}>Go to Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  notLoaded() {
    return (
      <View style={styles.container}>
        <HeaderCamera navigation={this.props.navigation} deviceTheme={this.props.screenProps.deviceTheme} cancel={true} next={false} nextText="Next">
          Video
        </HeaderCamera>
      </View>
    );
  }

  render() {
    if (this.state.isLoaded == 0) {
      return this.notLoaded();
    }
    if (this.state.cameraPermission == "denied" || this.state.cameraPermission == "undetermined") {
      return this.noCamera();
    }
    if (this.state.photoPermission == "denied" || this.state.photoPermission == "undetermined") {
      return this.noPhoto();
    }

    /*
    if (this.state.microphonePermission == "denied" || this.state.microphonePermission == "undetermined") {
      return this.noMicrophone();
    }
*/

    let timeBarStyle = {
      width: Dimensions.get("window").width * 0.05
    };

    if (this.state.timePassed == 1) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.1
      };
    } else if (this.state.timePassed == 2) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.2
      };
    } else if (this.state.timePassed == 3) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.3
      };
    } else if (this.state.timePassed == 4) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.4
      };
    } else if (this.state.timePassed == 5) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.5
      };
    } else if (this.state.timePassed == 6) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.6
      };
    } else if (this.state.timePassed == 7) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.7
      };
    } else if (this.state.timePassed == 8) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.8
      };
    } else if (this.state.timePassed == 9) {
      timeBarStyle = {
        width: Dimensions.get("window").width * 0.9
      };
    } else if (this.state.timePassed == 10) {
      timeBarStyle = {
        width: Dimensions.get("window").width
      };
    }
    return (
      <View style={styles.container}>
        <HeaderCamera navigation={this.props.navigation} cancel={true} next={false} deviceTheme={this.props.screenProps.deviceTheme} nextText="Next">
          Video
        </HeaderCamera>
        <View style={styles.cameraContainer}>
          <Camera
            ref={cam => {
              this.camera = cam;
            }}
            style={this.props.screenProps.deviceTheme === "IphoneSmall" ? styles.previewSmall : styles.preview}
            aspect={this.state.camera.aspect}
            captureTarget={this.state.camera.captureTarget}
            captureQuality={this.state.camera.captureQuality}
            type={this.state.camera.type}
            flashMode={this.state.camera.flashMode}
            onFocusChanged={this.focusChange}
            zoomChanged={this.zoomChange}
            defaultTouchToFocus
            mirrorImage={false}
          />
          {this.state.recording == true ? null : (
            <View style={[styles.overlay, styles.topOverlay]}>
              <TouchableOpacity style={styles.typeButton} onPress={this.switchType}>
                <Image style={styles.typeIcon} source={this.typeIcon} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {this.state.recording == true ? (
          <View style={styles.overlayBar}>
            <View style={[styles.timebar, timeBarStyle]} />
          </View>
        ) : (
          <View style={styles.overlayBar} />
        )}

        <View style={styles.btnPhotoContainer}>
          {this.state.recording == true ? (
            <View style={styles.timePassed}>
              <Text style={styles.timePassedText}>{this.state.timePassedB}</Text>
            </View>
          ) : null}
          <View>
            {this.props.screenProps.deviceTheme === "IphoneSmall" ? (
              <TouchableOpacity style={styles.btnPhotoSmall} onPressIn={this.startRecord} onPressOut={this.stopRecord}>
                <Image style={styles.btnPhotoImageSmall} source={Images.photoBtn} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btnPhoto} onPressIn={this.startRecord} onPressOut={this.stopRecord}>
                <Image style={styles.btnPhotoImage} source={Images.photoBtn} />
              </TouchableOpacity>
            )}
          </View>
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
  cameraContainer: {
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").width
  },
  preview: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").width
  },
  previewSmall: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").width
  },
  btnPhotoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  btnPhoto: {
    width: 140,
    height: 140
  },
  btnPhotoImage: {
    width: 140,
    height: 140,
    resizeMode: "contain"
  },
  btnPhotoSmall: {
    width: 65,
    height: 65
  },
  btnPhotoImageSmall: {
    width: 65,
    height: 65,
    resizeMode: "contain"
  },
  overlay: {
    position: "absolute",
    padding: 5,
    right: 0,
    left: 0
  },
  overlayBar: {
    height: 10
  },
  topOverlay: {
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  timebar: {
    height: 5,
    backgroundColor: "red"
  },
  typeButton: {
    padding: 5
  },
  flashButton: {
    padding: 5
  },
  buttonsSpace: {
    width: 10
  },
  typeIcon: {
    height: 30,
    width: 30,
    marginLeft: 10,
    marginTop: 5,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  flashIcon: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2
  },
  center: {
    textAlign: "center",
    marginTop: 20
  },
  authStyle: {
    fontSize: 22,
    fontWeight: "bold",
    justifyContent: "center",
    textAlign: "center",
    color: "#B2B2B2",
    marginTop: 100,
    marginLeft: 25,
    marginRight: 25
  },
  profileMessage: {
    marginTop: 75,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  lockedEye: {
    height: 75,
    width: 75,
    resizeMode: "contain"
  },
  profileMessageHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#777980",
    marginTop: 15,
    marginBottom: 10
  },
  btn: {
    borderWidth: 1,
    borderColor: "#18B5C3",
    borderRadius: 5,
    backgroundColor: "#18B5C3",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    justifyContent: "center"
  },
  btnText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Helvetica",
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10
  },
  timePassed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  timePassedText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Helvetica"
  }
};

export { Video };
