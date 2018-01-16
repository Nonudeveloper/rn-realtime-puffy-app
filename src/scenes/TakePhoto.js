import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert, Image } from "react-native";
import Images from "../config/images";
import { HeaderCamera, BtnSaveTxt } from "../components";
import { Gallery, Photo } from "../scenes";

class TakePhoto extends Component {
  constructor(props) {
    super(props);

    this.gotoGallery = this.gotoGallery.bind(this);
    this.gotoPhoto = this.gotoPhoto.bind(this);
    this.logout = this.props.screenProps.logout.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  gotoGallery() {
    this.props.navigation.navigate("Gallery", { cancel: true, profile: 1, newUser: 1, gallery: 1 });
  }

  gotoPhoto() {
    this.props.navigation.navigate("Photo", { cancel: true, profile: 1, newUser: 1, photo: 1 });
  }

  cancel() {
    Alert.alert("Confirmation", "Are you sure you want to cancel?", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.logout() }]);
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderCamera
          navigation={this.props.navigation}
          LeftText="cancel"
          LeftCallback={this.cancel}
          deviceTheme={this.props.screenProps.deviceTheme}
          cancel={false}
          next={false}
          nextText="Next"
        >
          Upload a photo
        </HeaderCamera>

        <Text style={styles.headerText}>Upload a profile picture to find Puffers</Text>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.containerPhotoStyle}>
              <TouchableOpacity onPress={this.gotoPhoto}>
                <Image style={styles.photoIconStyle} source={Images.photoBtn} />
                <Text style={styles.center}>Take a Photo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.containerGalleryStyle}>
              <TouchableOpacity onPress={this.gotoGallery}>
                <Image style={styles.photoIconStyle} source={Images.galleryBtn} />
                <Text style={styles.center}>Choose a photo from gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  center: {
    marginTop: 10,
    color: "#505050",
    textAlign: "center"
  },
  content: {
    alignItems: "center"
  },
  containerPhotoStyle: {
    paddingTop: 30
  },
  containerGalleryStyle: {
    paddingTop: 30
  },
  photoIconStyle: {
    height: 175,
    width: 175
  },
  headerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#505050",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20
  }
};

export { TakePhoto };
