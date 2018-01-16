import React, { Component } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image, Linking, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Images from "../config/images";
import { HeaderCamera, BtnSaveTxt } from "../components";
import { Gallery, Photo } from "../scenes";
import OpenSettings from 'react-native-open-settings';

class Gps extends Component {
  constructor(props) {
    super(props);

    this.openSettings = this.openSettings.bind(this);
  }

  openSettings() {
    if(Platform.OS === 'ios') {
      Linking.openURL("app-settings:"); 
    } else {
      OpenSettings.openSettings();
    }
  }

  render() {
    return (
          <LinearGradient
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 0.0, y: 1.0 }}
            locations={[0, 0.2, 0.3, 0.9]}
            colors={["#989EA1", "#8C98A0", "#88959F", "#8D759E"]}
            style={styles.container}
          >
          <ScrollView style={styles.content}>
            <Image style={styles.binocular} source={Images.binocular} />
            <Text style={styles.textHeader}>Can you see me now?</Text>
            <Text style={styles.textRow}>In order for us to find you some</Text>
            <Text style={styles.textRow}>beautiful Puffers around you,</Text>
            <Text style={styles.textRow}>Puffy needs to be able</Text>
            <Text style={styles.textRow}>to locate you.</Text>
            <View style={styles.break}/>
            <Text style={styles.textRow}>Please go to Settings > Privacy ></Text>
            <Text style={styles.textRow}>Location Services, and turn</Text>
            <Text style={styles.textRow}>Puffy to ON.</Text>
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Can you see me now?</Text>
              <Text style={styles.cardRow}>In order for us to find you some</Text>
              <Text style={styles.cardRow}>beautiful Puffers around you,</Text>
              <Text style={styles.cardRow}>Puffy needs to be able</Text>
              <Text style={styles.cardRow}>to locate you.</Text>
              <TouchableOpacity style={styles.btn} onPress={this.openSettings}>
                <Text style={styles.btnText}>Go to Settings</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
      </LinearGradient>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "transparent",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    ...Platform.select({
      android: {
        marginTop: 10
      }
    })
  },
  binocular: {
    width: null,
    height: 170,
    ...Platform.select({
      android: {
        height: 130
      }
    }),
    resizeMode: "contain"
  },
  textHeader: {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "Helvetica",
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#484C52'
  },
  textRow: {
    fontFamily: "Helvetica",
    fontSize: 20,
    textAlign: 'center',
    color: '#484C52',
    marginBottom: 2
  },
  break: {
    paddingBottom: 10
  },
  card: {
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  cardHeader: {
    marginTop: 15,
    marginBottom: 10,
    fontFamily: "Helvetica",
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#484C52'
  },
  cardRow: {
    fontFamily: "Helvetica",
    fontSize: 18,
    textAlign: 'center',
    color: '#484C52',
    marginBottom: 2
  },
  btn: {
    borderWidth: 1,
    borderColor: '#18B5C3',
    borderRadius: 5,
    backgroundColor: '#18B5C3',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10, 
  }
};

export { Gps };
