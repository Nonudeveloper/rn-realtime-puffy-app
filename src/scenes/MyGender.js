import React, { Component } from "react";
import { Alert, ScrollView, Text, Image, View, Modal } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Header from "../components/Header";
import EthnicityModal from "../components/EthnicityModal";
import BtnOutlineIcon from "../components/BtnOutlineIconSmall";
import BtnDefault from "../components/BtnDefault";
import InputBtnIcon from "../components/InputBtnIcon";
import InputBtnIcon2 from "../components/InputBtnIcon2";
import Images from "../config/images";

const homePlace1 = { formatted_address: "Los Angeles, CA, USA", description: "Los Angeles, CA", geometry: { location: { lat: 34.0522, lng: -118.2437 } } };
const homePlace2 = { formatted_address: "Las Vegas, NV, USA", description: "Las Vegas, NV", geometry: { location: { lat: 36.1699, lng: -115.1398 } } };
const homePlace3 = { formatted_address: "San Francisco, CA, USA", description: "San Francisco, CA", geometry: { location: { lat: 37.7749, lng: -122.4194 } } };
const homePlace4 = { formatted_address: "Portland, OR, USA", description: "Portland, OR", geometry: { location: { lat: 45.5231, lng: -122.6765 } } };
const homePlace5 = { formatted_address: "Phoenix, AZ, USA", description: "Phoenix, AZ", geometry: { location: { lat: 33.4484, lng: -112.074 } } };
const homePlace6 = { formatted_address: "Denver, CO, USA", description: "Denver, CO", geometry: { location: { lat: 39.7392, lng: -104.9903 } } };

class MyGender extends Component {
  constructor(props) {
    super(props);

    this.deviceTheme = this.props.screenProps.deviceTheme;
    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.getLocation = this.props.screenProps.getLocation.bind(this);
    this.submitData = this.submitData.bind(this);
    this.setGender = this.setGender.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.setEthnicityModalVisible = this.setEthnicityModalVisible.bind(this);
    this.setEthnicity = this.setEthnicity.bind(this);

    this.locations = [homePlace1, homePlace2, homePlace3, homePlace4, homePlace5, homePlace6];
    this.logout = this.props.screenProps.logout.bind(this);
    this.cancel = this.cancel.bind(this);

    let gender = this.props.screenProps.global.user_gender;
    let user_gender = "";

    if (gender == "Male") {
      user_gender = "Male";
    } else if (gender == "Female") {
      user_gender = "Female";
    }

    this.state = {
      gender: user_gender,
      location: "",
      location_full: "",
      lat: 0,
      lng: 0,
      ethnicity: "No Preference",
      modalVisible: false,
      ethnicityModalVisible: false
    };
  }

  componentDidMount() {
    const $this = this;

    this.getLocation(function(position) {
      console.log(position);

      let autoPlace1 = {
        formatted_address: $this.props.screenProps.global.cityStateCountry,
        description: "Current Location",
        geometry: { location: { lat: $this.props.screenProps.global.lat, lng: $this.props.screenProps.global.lng } }
      };
      $this.locations.unshift(autoPlace1);

      $this.setState({
        lat: $this.props.screenProps.global.lat,
        lng: $this.props.screenProps.global.lng,
        location: $this.props.screenProps.global.cityState,
        location_full: $this.props.screenProps.global.cityStateCountry
      });
    });
  }

  setGender(value) {
    this.setState({ gender: value });
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

  submitData() {
    if (this.state.gender == "" || this.state.location_full == "") {
      Alert.alert("Error", "Please select your gender and location");
      return false;
    }

    let dataString = {
      user_action: "update_location_gender",
      user_data: {
        gender: this.state.gender,
        location: this.state.location_full,
        ethnicity: this.state.ethnicity,
        lat: this.state.lat,
        lng: this.state.lng
      }
    };

    console.log(dataString);

    this.handleEmit(dataString);
  }

  setModalVisible(value) {
    this.setState({ modalVisible: value });
  }

  setEthnicity(value) {
    this.setState({ ethnicity: value, ethnicityModalVisible: false });
  }

  setEthnicityModalVisible(value) {
    this.setState({ ethnicityModalVisible: value });
  }

  cancel() {
    Alert.alert("Confirmation", "Are you sure you want to cancel?", [{ text: "No", onPress: () => console.log("No Pressed!") }, { text: "Yes", onPress: () => this.logout() }]);
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          deviceTheme={this.props.screenProps.deviceTheme}
          LeftText="cancel"
          LeftCallback={this.cancel}
          RightIcon="checkmark_button"
          RightCallback={this.submitData}
          title="You're almost ready!"
          global={this.props.screenProps.global}
        />
        <ScrollView style={this.deviceTheme == "IphoneSmall" ? styles.contentSmall : styles.content}>
          <Text style={styles.headerText}>Let us help you find the right Puffers</Text>
          <Text style={styles.headerTextGreen}>I am a</Text>
          <View style={styles.genderRow}>
            <BtnOutlineIcon
              label="Woman"
              icon="woman_off"
              icon_active="woman_on"
              theme_active="Pink"
              active={this.state.gender === "Female"}
              onPress={() => this.setGender("Female")}
            />
            <BtnOutlineIcon label="Man" icon="man_off" icon_active="man_on" theme_active="Green" active={this.state.gender === "Male"} onPress={() => this.setGender("Male")} />
          </View>
          <Text style={styles.headerTextGreen}>My Ethnicity</Text>
          <InputBtnIcon2 icon="group_icon" text={this.state.ethnicity} onPress={() => this.setEthnicityModalVisible(true)} />
          <Text style={styles.headerTextGreen}>My Location</Text>
          <View style={styles.locationRow}>
            <InputBtnIcon2 icon="location_icon" text={this.state.location} onPress={() => this.setModalVisible(true)} />
          </View>
        </ScrollView>
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
    backgroundColor: "#FFF"
  },
  contentSmall: {
    marginTop: 15,
    marginLeft: 5,
    marginRight: 5
  },
  content: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30
  },
  headerText: {
    textAlign: "center",
    fontSize: 16,
    color: "#505050",
    marginLeft: 15,
    marginRight: 15
  },
  headerTextGreen: {
    textAlign: "center",
    fontSize: 22,
    color: "#18B5C3",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15
  },
  genderRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
    marginLeft: 6,
    marginRight: 6
  },
  locationRow: {
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 6,
    marginRight: 6
  },
  headerIcon: {
    height: 25,
    width: 25,
    resizeMode: "contain"
  },
  newRow: {
    marginTop: 15
  }
};

export { MyGender };
