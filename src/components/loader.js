import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';

const Loader = props => {
    const {
        loading
    } = props;

    return (
        <Modal
            visible={loading} 
            transparent
            animationType={'none'}
            onRequestClose={() => console.log('hjk')}
        >
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator animating={loading} />
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
      backgroundColor: 'grey',
      height: 70,
      width: 70,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
    }
});
export default Loader;
