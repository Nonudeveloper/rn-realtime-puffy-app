import React from "react";
import { View, TextInput, Image, Platform } from "react-native";
import DatePicker from "react-native-datepicker";
import Images from "../config/images";

const InputDateIcon = props => {
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={Images[props.icon]} />
      <DatePicker
        style={[styles.date]}
        date={props.value}
        mode="date"
        placeholder="Birthday"
        format="MMM DD YYYY"
        minDate="Jan 01 1952"
        maxDate="Dec 01 2000"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={true}
        iconSource={Images.arrow_down}
        customStyles={{
          dateInput: {
            alignItems: "flex-start",
            height: 40,
            borderWidth: 1,
            borderColor: "#18B5C3",
            borderRadius: 5,
            paddingTop: 10,
            paddingLeft: 40,
            paddingBottom: 10,
            paddingRight: 15
          },
          dateIcon: {
            position: "absolute",
            top: 10,
            right: 10,
            width: 22,
            height: 22,
            marginLeft: 25,
            resizeMode: "contain"
          },
          dateText: {
            fontSize: 15,
            fontFamily: "Helvetica",
            color: "#181818"
          },
          placeholderText: {
            fontSize: 15,
            fontFamily: "Helvetica",
            color: "#181818"
          }
        }}
        onDateChange={props.onDateChange}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    marginBottom: 13
  },
  icon: {
    position: "absolute",
    top: 12,
    left: 10,
    height: 16,
    width: 16,
    resizeMode: "contain",
    ...Platform.select({
      android: {
        top: 18
      }
    })
  },
  date: {
    width: null
  }
};

export default InputDateIcon;
