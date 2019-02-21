import React from 'react';
import { View, TouchableHighlight, Image } from 'react-native';
import { localStyles } from '../../localStyles';
import PropTypes from 'prop-types';

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
          style={localStyles.icon}
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