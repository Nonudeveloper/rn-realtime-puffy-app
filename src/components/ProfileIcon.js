import React, { Component } from "react";
import { Text, Image, View, Platform } from "react-native";
import { CachedImage } from "react-native-img-cache";
import navImages from "../config/navImages";

class ProfileIcon extends Component {
  constructor(props) {
    super(props);
    // anything you need in the constructor
  }

  render() {
    const { icon, focused } = this.props;

    if (icon == null) {
      return (
        <Image
          source={focused ? navImages.profile_on : navImages.profile_off}
          style={{
            width: 28,
            height: 28,
            resizeMode: "contain"
          }}
        />
      );
    }
    // below is an example notification icon absolutely positioned
    return (
      <View style={styles.container}>
        <View style={focused == true ? styles.viewActive : styles.view}>
          <CachedImage source={{ uri: icon }} style={styles.icon} />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    zIndex: 0,
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-around",
    alignItems: "center"
  },
  view: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderColor: "#F8F8F8",
    borderWidth: 2
  },
  viewActive: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderColor: "#00B1BB",
    borderWidth: 2
  },
  icon: {
    width: 31,
    height: 31,
    resizeMode: "cover",
    borderRadius: 15.5,
    borderColor: "transparent",
    borderWidth: 2
  }
};

export default ProfileIcon;
