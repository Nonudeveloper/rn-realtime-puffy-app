import React, { Component } from "react";
import { Text, Image, View, Platform } from "react-native";
import navImages from "../config/navImages";

class NotificationIcon extends Component {
  constructor(props) {
    super(props);
    // anything you need in the constructor
  }

  render() {
    const { notifications, focused } = this.props;

    // below is an example notification icon absolutely positioned
    return (
      <View
        style={{
          zIndex: 0,
          flex: 1,
          alignSelf: "stretch",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <Image
          source={focused ? navImages.notification_on : navImages.notification_off}
          style={{
            width: 28,
            height: 28,
            resizeMode: "contain"
          }}
        />
        {notifications > 0 ? (
          <View style={Platform.OS === "ios" ? styles.notificationContainerIOS : styles.notificationContainerAndroid}>
            <Text style={{ textAlign: "center", color: "#FFFFFF", fontWeight: "bold", fontSize: 10 }}>{notifications}</Text>
          </View>
        ) : (
          undefined
        )}
      </View>
    );
  }
}

const styles = {
  notificationContainerIOS: {
    position: "absolute",
    top: 5,
    left: 0,
    width: 24,
    height: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#FF843E",
    backgroundColor: "#FF843E",
    justifyContent: "center",
    zIndex: 2
  },
  notificationContainerAndroid: {
    position: "absolute",
    top: 1,
    left: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF4500",
    backgroundColor: "#FF4500",
    justifyContent: "center",
    zIndex: 2
  }
};

export default NotificationIcon;
