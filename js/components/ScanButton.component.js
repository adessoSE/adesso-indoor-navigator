import React from 'react';
import { View, TouchableHighlight, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    height: 64,
    width: 64
  }
});

const ScanButton = ({ onPress }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 15,
        right: 0,
        top: 15,
        alignItems: 'flex-start'
      }}
    >
      <TouchableHighlight onPress={onPress}>
        <Image
          style={styles.icon}
          source={require('../res/barcode.png')}
        />
      </TouchableHighlight>
    </View>
  );
};

ScanButton.propTypes = {
  onPress: PropTypes.func
};

export default ScanButton;