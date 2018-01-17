import React from "react";
import { View, TextInput, Platform, Image } from "react-native";
import DatePicker from "react-native-datepicker";
import Images from "../config/images";

const InputDate = props => {
  return (
    <DatePicker
      style={[styles.container]}
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
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#18B5C3",
          borderRadius: 5,
          paddingTop: 10,
          paddingLeft: 15,
          paddingBottom: 10,
          paddingRight: 15,
          ...Platform.select({
            android: {
              marginTop: 15
            }
          })
        },
        dateIcon: {
          position: "absolute",
          top: 3,
          right: 10,
          width: 22,
          height: 22,
          marginLeft: 25,
          resizeMode: "contain",
          ...Platform.select({
            android: {
              top: 10
            }
          })
        },
        dateText: {
          fontSize: 15,
          fontFamily: "Helvetica",
          color: "#181818"
        },
        placeholderText: {
          fontSize: 15,
          fontFamily: "Helvetica",
          color: "#505050"
        }
      }}
      onDateChange={props.onDateChange}
    />
  );
};

const styles = {
  container: {
    width: null,
    marginTop: 10,
    marginBottom: 10,
    ...Platform.select({
      android: {
        marginTop: 0
      }
    })
  }
};

export default InputDate;
