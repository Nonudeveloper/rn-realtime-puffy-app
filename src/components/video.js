import React, { Component } from "react";
import { View, TouchableOpacity, Text, Image, Dimensions, Alert, Linking, Platform } from "react-native";
import Camera from "react-native-camera";
import Images from "../config/images";
import { HeaderCamera } from "../components";
import ImageResizer from "react-native-image-resizer";
import Permissions from "react-native-permissions";
import OpenSettings from "react-native-open-settings";

class Video extends Component {
  constructor(props) {
    super(props);

    this.openSettings = this.openSettings.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.key = this.props.navigation.state.key;

    this.camera = null;

    this.state = {
      cameraPermission: true,
      photoPermission: true,
      isLoaded: 0,
      takePhoto: 0,
      photoClick: 0,
      camera: {
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
    Permissions.checkMultiple(["camera", "photo"]).then(response => {
      this.setState({ cameraPermission: response.camera, photoPermission: response.photo, isLoaded: 1 });

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
    console.log("double click");
  }

  takePicture() {
    if (this.state.photoClick == 1) {
      console.log("taking photo");
      return false;
    }

    this.setState(
      {
        photoClick: 1
      },
      () => {
        //get current user profile and store it in Async
        if (this.camera) {
          this.camera
            .capture()
            .then(data => this.showConfirm(data))
            .catch(err => console.log(err));
        }
      }
    );
  }

  showConfirm(data) {
    const $this = this;

    ImageResizer.createResizedImage(data.path, 640, 640, "JPEG", 80)
      .then(resizedImageUri => {
        $this.props.navigation.navigate("PhotoConfirm", { photo: resizedImageUri, data: $this.props.navigation.state.params, key: this.key });
        $this.setState({ photoClick: 0 });
      })
      .catch(err => {
        console.log(err);
        $this.setState({ photoClick: 0 });
        return Alert.alert("Unable to resize the photo", "Check the console for full the error message");
      });
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

  noPhoto() {
    return (
      <View style={styles.container}>
        <HeaderCamera navigation={this.props.navigation} deviceTheme={this.props.screenProps.deviceTheme} cancel={true} next={false} nextText="Next">
          Video
        </HeaderCamera>

        <View style={styles.profileMessage}>
          <Image style={styles.lockedEye} source={Images.camera_icon} />
          <Text style={styles.profileMessageHeader}>Allow access to your photos use camera</Text>
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
          <Text style={styles.profileMessageHeader}>Allow access to your camera to start taking photos</Text>
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

    return (
      <View style={styles.container}>
        <HeaderCamera navigation={this.props.navigation} cancel={true} next={false} deviceTheme={this.props.screenProps.deviceTheme} nextText="Next">
          Video
        </HeaderCamera>
        <View style={styles.container}>
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

          <View style={[styles.overlay, styles.topOverlay]}>
            <TouchableOpacity style={styles.typeButton} onPress={this.switchType}>
              <Image style={styles.typeIcon} source={this.typeIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.flashButton} onPress={this.switchFlash}>
              <Image style={styles.flashIcon} source={this.flashIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.btnPhotoContainer}>
          {this.state.photoClick == 0 ? (
            <TouchableOpacity style={styles.btnPhoto} onPress={this.takePicture}>
              <Image style={styles.btnPhotoImage} source={Images.photoBtn} />
            </TouchableOpacity>
          ) : (
            <Image style={styles.btnPhotoImage} source={Images.photoBtn} />
          )}
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
  preview: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").height * 0.6,
    width: Dimensions.get("window").width
  },
  previewSmall: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").height * 0.5,
    width: Dimensions.get("window").width
  },
  btnPhotoContainer: {
    alignItems: "center",
    marginTop: 5
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
  overlay: {
    position: "absolute",
    padding: 16,
    right: 0,
    left: 0,
    alignItems: "center"
  },
  topOverlay: {
    bottom: 5,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
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
  }
};

export { Video };
