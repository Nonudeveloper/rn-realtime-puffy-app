import React, { Component } from "react";
import {
  AsyncStorage,
  Text,
  ScrollView,
  View,
  Button,
  Image,
  Picker,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Modal
} from "react-native";
import DatePicker from "react-native-datepicker";
import {
  ImgInput,
  ImgInputMultiline,
  GenderInput,
  BtnSaveTxt
} from "../components";
import Images from "../config/images";
import Header from "../components/Header";
import FilterInput from "../components/FilterInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NavigationActions } from "react-navigation";
import moment from "moment";
import HeaderLocation from "../components/HeaderLocation";
import InputTextIcon from "../components/InputTextIcon";
import InputBtnIcon2 from "../components/InputBtnIcon2";
import InputBtnIconMulti from "../components/InputBtnIconMulti";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

class BusinessAccount extends Component {
  constructor(props) {
    super(props);

    this.deviceTheme = this.props.screenProps.deviceTheme;
    this.puffyChannel = this.props.screenProps.puffyChannel;
    this.handleEmit = this.props.screenProps.handleEmit.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.setName = this.setName.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.setWebsite = this.setWebsite.bind(this);
    this.setPhone = this.setPhone.bind(this);

    this.goBack = this.goBack.bind(this);
    this.businessListener = this.businessListener.bind(this);

    this.setModalVisibleLocation = this.setModalVisibleLocation.bind(this);
    this.setLocationName = this.setLocationName.bind(this);

    this.state = {
      business_name: "",
      business_address: "Add Address",
      business_address2: "",
      business_address_full: "",
      business_website: "",
      business_phone: "",
      modalVisibleLocation: false
    };
  }

  businessListener(data) {
    if (
      data["result"] == 1 &&
      data["result_action"] == "update_business_profile_result"
    ) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "index" })]
      });
      this.props.navigation.dispatch(resetAction);
    }
  }

  componentWillUnmount() {
    this.puffyChannel.removeListener("data_channel", this.businessListener);
  }

  componentDidMount() {
    this.puffyChannel.on("data_channel", this.businessListener);
  }

  setName(value) {
    this.setState({ business_name: value });
  }

  setAddress(value) {
    this.setState({ business_address: value });
  }

  setWebsite(value) {
    this.setState({ business_website: value });
  }

  setPhone(value) {
    this.setState({ business_phone: value });
  }

  goBack() {
    this.props.navigation.goBack();
  }

  setModalVisibleLocation(visible) {
    if (visible == null) visible = false;
    this.setState({ modalVisibleLocation: visible });
  }

  setLocationName(location) {
    console.log(location);

    const pos = location.indexOf( ',' );
    const add1 = location.substring( 0, pos ).trim()
    const add2 = location.substring( pos + 1 ).trim();

    console.log(add1);
    console.log(add2);
    console.log(pos);

    this.setState({
      business_address: add1,
      business_address2: add2,
      business_address_full: location,
      modalVisibleLocation: false
    });
  }

  updateProfile() {
    if (this.state.business_name == "") {
      // It has any kind of whitespace
      Alert.alert("Error", "Please enter your business name");
      return false;
    }

    if (this.state.business_address == "Add Address") {
      // It has any kind of whitespace
      Alert.alert("Error", "Please enter your business address");
      return false;
    }

    if (this.state.business_website == "") {
      // It has any kind of whitespace
      Alert.alert("Error", "Please enter your business website");
      return false;
    }

    if (this.state.business_phone == "") {
      // It has any kind of whitespace
      Alert.alert("Error", "Please enter your business phone");
      return false;
    }

    let dataString = {
      user_action: "update_business_profile",
      user_data: {
        business_name: this.state.business_name,
        business_address: this.state.business_address,
        business_website: this.state.business_website,
        business_phone: this.state.business_phone
      }
    };

    this.handleEmit(dataString);
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
          title="Business Settings"
          global={this.props.screenProps.global}
        />

        <KeyboardAwareScrollView overScrollMode="never" scrollEnabled={true}>
          <View
            style={
              this.deviceTheme == "IphoneX" ? styles.contentX : styles.content
            }
          >
            <InputTextIcon
              inputRef={node => (this.business_name = node)}
              icon="profile_icon"
              value={this.state.user_name}
              placeholder="Business Name"
              returnKeyType="done"
              keyboardType="default"
              maxLength={30}
              onChangeText={business_name => this.setState({ business_name })}
            />
            <InputBtnIconMulti
              text={this.state.business_address}
              text2={this.state.business_address2}
              icon="location_icon"
              onPress={() =>
                this.setModalVisibleLocation(!this.state.modalVisibleLocation)}
            />
            <InputTextIcon
              inputRef={node => (this.business_website = node)}
              icon="about_icon"
              value={this.state.user_name}
              placeholder="Business Website"
              returnKeyType="done"
              keyboardType="default"
              maxLength={50}
              onChangeText={business_website =>
                this.setState({ business_website })}
            />
            <InputTextIcon
              inputRef={node => (this.business_phone = node)}
              icon="email_icon"
              value={this.state.user_name}
              placeholder="Business Phone"
              returnKeyType="done"
              keyboardType="default"
              maxLength={30}
              onChangeText={business_phone => this.setState({ business_phone })}
            />
          </View>
        </KeyboardAwareScrollView>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisibleLocation}
          onRequestClose={() => {
            this.setModalVisibleLocation(false);
          }}
        >
          <View style={styles.locationContainer}>
            <Header
              deviceTheme={this.props.screenProps.deviceTheme}
              LeftIcon="back_arrow"
              LeftCallback={this.setModalVisibleLocation}
              global={this.props.screenProps.global}
            />
            <GooglePlacesAutocomplete
              placeholder="Enter address"
              minLength={1} // minimum length of text to search
              enablePoweredByContainer={false}
              autoFocus={true}
              returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              listViewDisplayed="auto" // true/false/undefined
              fetchDetails={true}
              renderDescription={row => row.description} // custom description render
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                this.setLocationName(details.formatted_address);
              }}
              getDefaultValue={() => ""}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: "AIzaSyCsnViQCXeS1x0W-TxZ3vslGVo2l9CpCqY",
                language: "en", // language of the results
                types: "establishment" // default: 'geocode'
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
              filterReverseGeocodingByTypes={[
                "locality",
                "administrative_area_level_3"
              ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
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
  locationContainer: {
    flex: 1,
    backgroundColor: "#FEFEFE"
  },
  genderRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 10
  }
};

export { BusinessAccount };
