import React, { Component } from "react";
import { AsyncStorage, Text, ScrollView, View, Button, Image, Picker, TouchableOpacity, FlatList, Dimensions, Alert, Modal } from "react-native";
import DatePicker from "react-native-datepicker";
import { ImgInput, ImgInputMultiline, GenderInput, BtnSaveTxt } from "../components";
import Images from "../config/images";
import Header from "../components/Header";
import EthnicityModal from "../components/EthnicityModal";
import FilterInput from "../components/FilterInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions } from "react-navigation";
import moment from "moment";
import HeaderLocation from "../components/HeaderLocation";
import InputTextIcon from "../components/InputTextIcon";
import InputBtnIcon2 from "../components/InputBtnIcon2";
import BtnOutlineIcon from "../components/BtnOutlineIconSmall";
import InputDateIcon from "../components/InputDateIcon";
import InputTextMultiIcon from "../components/InputTextMultiIcon";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const homePlace1 = { formatted_address: "Los Angeles, CA, USA", description: "Los Angeles, CA", geometry: { location: { lat: 34.0522, lng: -118.2437 } } };
const homePlace2 = { formatted_address: "Las Vegas, NV, USA", description: "Las Vegas, NV", geometry: { location: { lat: 36.1699, lng: -115.1398 } } };
const homePlace3 = { formatted_address: "San Francisco, CA, USA", description: "San Francisco, CA", geometry: { location: { lat: 37.7749, lng: -122.4194 } } };
const homePlace4 = { formatted_address: "Portland, OR, USA", description: "Portland, OR", geometry: { location: { lat: 45.5231, lng: -122.6765 } } };
const homePlace5 = { formatted_address: "Phoenix, AZ, USA", description: "Phoenix, AZ", geometry: { location: { lat: 33.4484, lng: -112.074 } } };
const homePlace6 = { formatted_address: "Denver, CO, USA", description: "Denver, CO", geometry: { location: { lat: 39.7392, lng: -104.9903 } } };

class ProfileEdit extends Component {
  constructor(props) {
    super(props);

    this.deviceTheme = this.props.screenProps.deviceTheme;
    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.setGender = this.setGender.bind(this);
    this.setAboutme = this.setAboutme.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.setEthnicityModalVisible = this.setEthnicityModalVisible.bind(this);
    this.setEthnicity = this.setEthnicity.bind(this);

    this.goBack = this.goBack.bind(this);
    this.editListener = this.editListener.bind(this);
    this.locations = [];

    let locations = this.props.screenProps.global.locations;
    let locations_count = locations.length;

    let autoPlace1 = {
      formatted_address: this.props.screenProps.global.cityStateCountry,
      description: "Current Location",
      geometry: { location: { lat: this.props.screenProps.global.lat, lng: this.props.screenProps.global.lng } }
    };

    if (locations_count == 0) {
      this.locations = [homePlace1, homePlace2, homePlace3, homePlace4, homePlace5, homePlace6];
    } else {
      for (var i in locations) {
        let location = locations[i];
        let cityState = location.user_location_city + ", " + location.user_location_state;
        let cityStateFull = location.user_location_city + ", " + location.user_location_state + ", " + location.user_location_country;
        let place = { formatted_address: cityStateFull, description: cityState, geometry: { location: { lat: location.user_location_lat, lng: location.user_location_lng } } };
        this.locations.push(place);
      }
    }

    this.locations.unshift(autoPlace1);

    //calcualte mminimum dob required
    let age_limit = 18;
    let required_date = new Date();
    required_date.setFullYear(required_date.getFullYear() - age_limit);

    //this.bug(this.props.screenProps.UserIDUserToken);

    this.state = {
      required_age: age_limit,
      required_date: required_date,
      user_name: "",
      user_firstlast: "",
      user_email: "",
      user_aboutme: "",
      user_dob: "",
      user_gender: "",
      location: "",
      location_full: "",
      lat: "",
      lng: "",
      ethnicity: "No Preference",
      behavior: "padding",
      genderModal: false,
      locationModal: false,
      characterCount: 30,
      modalVisible: false,
      ethnicityModalVisible: false
    };
  }

  editListener(data) {
    if (data["result"] == 1 && data["result_action"] == "update_my_profile_result") {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "index" })]
      });
      this.props.navigation.dispatch(resetAction);
    } else if (data["result"] == 0 && data["result_action"] == "update_user_profile_result") {
      Alert.alert("Incorrect", data["result_text"]);
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.editListener);
  }

  componentDidMount() {
    this.puffyChannel.on("data_channel", this.editListener);
  }

  componentWillMount() {
    //if userid exists then lets validate it
    AsyncStorage.getItem("UserProfile", (err, result) => {
      //this.bug(result);

      if (result) {
        //convert to json array and applie to state
        let user_profile = JSON.parse(result);

        if (user_profile["user_name"] == "undefined") {
          user_profile["user_name"] = "";
        }

        if (user_profile["user_name"] == "user_dob_format" || user_profile["user_dob_format"] == null) {
          user_profile["user_dob_format"] = "";
        }

        if (user_profile["user_gender"] == "undefined" || user_profile["user_gender"] == null) {
          user_profile["user_gender"] = "";
        }

        if (user_profile["user_ethnicity"] == "undefined" || user_profile["user_ethnicity"] == null) {
          user_profile["user_ethnicity"] = "No Preference";
        }

        if (user_profile["user_aboutme"] == "undefined") {
          user_profile["user_aboutme"] = "";
        }

        if (user_profile["user_location"] == "undefined" || user_profile["user_location"] == null) {
          user_profile["user_location"] = "";
        }
        if (user_profile["user_location_full"] == "undefined" || user_profile["user_location_full"] == null) {
          user_profile["user_location_full"] = "";
        }

        this.setAboutme(user_profile["user_aboutme"]);

        this.setState({
          user_name: user_profile["user_name"],
          user_firstlast: user_profile["user_firstlast"],
          user_email: user_profile["user_email"],
          location: user_profile["user_location"],
          location_full: user_profile["user_location_full"],
          lat: user_profile["user_position_lat"],
          lng: user_profile["user_position_lng"],
          user_gender: user_profile["user_gender"],
          user_dob: user_profile["user_dob_format"],
          ethnicity: user_profile["user_ethnicity"]
        });
      }
    });
  }

  updateProfile() {
    if (this.state.user_name == "") {
      // It has any kind of whitespace
      Alert.alert("Error", "Please enter your username");
      return false;
    }

    if (this.state.user_name.length <= 3) {
      Alert.alert("Error", "Username must have a minimum of 4 characters");
      return false;
    }

    if (this.state.user_name.length > 12) {
      Alert.alert("Error", "Username can not be greater then 12 characters");
      return false;
    }

    if (/\s/.test(this.state.user_name)) {
      // It has any kind of whitespace
      Alert.alert("Error", "Username cannot have spaces");
      return false;
    }
    if (/[^a-zA-Z0-9]/.test(this.state.user_name)) {
      // It has any kind of whitespace
      Alert.alert("Error", "Username must be alphanumeric");
      return false;
    }

    if (!isNaN(this.state.user_name.charAt(0))) {
      Alert.alert("Error", "Username cannot begin with a number");
      return false;
    }

    if (this.state.user_gender == "") {
      // It has any kind of whitespace
      Alert.alert("Error", "Please select your gender");
      return false;
    }

    if (this.state.location_full == "" || this.state.lat == "") {
      // It has any kind of whitespace
      Alert.alert("Error", "Please enter your location");
      return false;
    }

    if (this.state.user_dob === "") {
      Alert.alert("Error", "Please enter your birthday");
      return false;
    } else {
      let user_birthday = new Date(this.state.user_dob);

      if (user_birthday > this.state.required_date) {
        Alert.alert("Error", "You have to be at least " + this.state.required_age + " to register ");
        return false;
      }
    }

    let dataString = {
      user_action: "update_my_profile",
      user_data: {
        user_name: this.state.user_name,
        user_firstlast: this.state.user_firstlast,
        user_aboutme: this.state.user_aboutme,
        user_gender: this.state.user_gender,
        user_location: this.state.location_full,
        lat: this.state.lat,
        lng: this.state.lng,
        user_dob: this.state.user_dob,
        ethnicity: this.state.ethnicity
      }
    };

    //console.log(dataString);

    this.handleEmit(dataString);
  }

  setEthnicity(value) {
    this.setState({ ethnicity: value, ethnicityModalVisible: false });
  }

  setEthnicityModalVisible(value) {
    this.setState({ ethnicityModalVisible: value });
  }

  setModalVisible(value) {
    this.setState({ modalVisible: value });
  }

  setLocation(details) {
    console.log(details);

    let location_full = details.formatted_address;
    let location = location_full;
    location = location.replace(/, United States$/, "");
    location = location.replace(/, USA$/, "");
    location = location.replace(/, Canada$/, "");

    this.setState({ location: location, location_full: location_full, lat: details.geometry.location.lat, lng: details.geometry.location.lng, modalVisible: false });
  }

  setGender(value) {
    this.setState({ user_gender: value });
  }

  setAboutme(text) {
    var count = text.length;
    var characterCount = 30 - count;

    this.setState({ user_aboutme: text, characterCount: characterCount });
  }

  goBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftIcon="back_arrow"
          LeftCallback={this.goBack}
          RightIcon="checkmark_button"
          RightCallback={this.updateProfile}
          title="Edit My Profile"
          global={this.props.screenProps.global}
        />

        <KeyboardAwareScrollView overScrollMode="never" scrollEnabled={true}>
          <View style={this.deviceTheme == "IphoneX" ? styles.contentX : styles.content}>
            <InputTextIcon
              inputRef={node => (this.name = node)}
              icon="profile_icon"
              value={this.state.user_name}
              placeholder="Username"
              returnKeyType="done"
              keyboardType="default"
              maxLength={12}
              onChangeText={user_name => this.setState({ user_name })}
            />
            <InputTextIcon
              inputRef={node => (this.email = node)}
              icon="email_icon"
              value={this.state.user_email}
              placeholder="Email"
              returnKeyType="done"
              keyboardType="default"
              editable={false}
              maxLength={50}
            />
            <Text style={styles.headerText}>My Gender</Text>
            <View style={styles.genderRow}>
              <BtnOutlineIcon
                label="Woman"
                icon="woman_off"
                icon_active="woman_on"
                theme_active="Pink"
                active={this.state.user_gender === "Female"}
                onPress={() => this.setGender("Female")}
              />
              <BtnOutlineIcon
                label="Man"
                icon="man_off"
                icon_active="man_on"
                theme_active="Green"
                active={this.state.user_gender === "Male"}
                onPress={() => this.setGender("Male")}
              />
            </View>
            <InputBtnIcon2 icon="location_icon" text={this.state.location} onPress={() => this.setModalVisible(true)} />
            <InputBtnIcon2 icon="group_icon" text={this.state.ethnicity} onPress={() => this.setEthnicityModalVisible(true)} />
            <InputDateIcon icon="birthday_icon" value={this.state.user_dob} onDateChange={user_dob => this.setState({ user_dob })} />
            <InputTextMultiIcon
              inputRef={node => (this.about = node)}
              value={this.state.user_aboutme}
              icon="about_icon"
              label="About Me"
              placeholder="Say something fun about you..."
              returnKeyType="done"
              keyboardType="default"
              maxLength={30}
              multiline={false}
              characterCount={this.state.characterCount}
              onChangeText={about => this.setAboutme(about)}
            />
          </View>
        </KeyboardAwareScrollView>
        <EthnicityModal
          visible={this.state.ethnicityModalVisible}
          setEthnicityModalVisible={this.setEthnicityModalVisible}
          setEthnicity={this.setEthnicity}
          screenProps={this.props.screenProps}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          <View style={styles.container}>
            <Header
              deviceTheme={this.props.screenProps.deviceTheme}
              LeftIcon="back_arrow"
              LeftCallback={() => this.setModalVisible(false)}
              global={this.props.screenProps.global}
            />

            <GooglePlacesAutocomplete
              placeholder="Enter City, State"
              minLength={1} // minimum length of text to search
              enablePoweredByContainer={false}
              autoFocus={true}
              returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed="auto" // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description.replace(/, United States$/, "").replace(/, Canada$/, "")} // custom description render
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                this.setLocation(details);
              }}
              getDefaultValue={() => ""}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: "AIzaSyCsnViQCXeS1x0W-TxZ3vslGVo2l9CpCqY",
                language: "en", // language of the results
                types: "(cities)", // default: 'geocode'
                components: "country:us|country:ca"
              }}
              nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={{
                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              }}
              GooglePlacesSearchQuery={{
                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                rankby: "distance",
                types: "food"
              }}
              styles={{
                description: {
                  height: 20
                }
              }}
              predefinedPlaces={this.locations}
              filterReverseGeocodingByTypes={["locality", "administrative_area_level_3"]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  contentX: {
    marginTop: 37,
    marginLeft: 30,
    marginRight: 30
  },
  content: {
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30
  },
  headerText: {
    fontSize: 13,
    fontFamily: "Helvetica",
    textAlign: "center",
    color: "#181818"
  },
  genderRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 10
  }
};

export { ProfileEdit };
