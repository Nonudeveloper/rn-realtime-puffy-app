import React from "react";
import { View, TouchableOpacity, Text, Picker, Image } from "react-native";
import { CachedImage } from "react-native-img-cache";
import Images from "../config/images";

const UserRow = props => {
  return (
    <TouchableOpacity onPress={() => props.callback(props.user)}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.row2} onPress={() => props.callback(props.user)}>
          <View style={styles.avatar}>{props.icon == null ? null : <CachedImage style={styles.avatarImg} source={{ uri: props.icon, cache: "force-cache" }} />}</View>
          <View style={styles.body}>
            <Text style={styles.username}>{props.name}</Text>
            <Text style={styles.location}>{props.location}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>{props.children}</View>
      </View>
      {props.new == 1 ? (
        <TouchableOpacity style={styles.btnNew}>
          <Text style={styles.btnNewText}>new</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = {
  row: {
    backgroundColor: "#FEFEFE",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    paddingRight: 5,
    paddingLeft: 10,
    flexDirection: "row"
  },
  row2: {
    flex: 1,
    backgroundColor: "#FEFEFE",
    borderBottomColor: "#EEEEEE",
    flexDirection: "row"
  },
  avatarImg: {
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    height: 50,
    width: 50,
    resizeMode: "cover"
  },
  body: {
    flex: 1,
    paddingTop: 10
  },
  username: {
    fontSize: 15
  },
  location: {
    fontSize: 11,
    paddingTop: 5
  },
  btnNew: {
    position: "absolute",
    top: 2,
    left: 35,
    paddingBottom: 1,
    paddingTop: 1,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: "#fe0000",
    borderRadius: 5
  },
  btnNewText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center"
  },
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
    //alignItems: "center"
  }
};

export default UserRow;
