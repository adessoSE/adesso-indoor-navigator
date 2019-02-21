import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';

import { localStyles } from '../../localStyles';

const DistanceText = ({ destination, distance }) => {
  let text = '';

  if (destination !== 'none') {
    text = distance !== 0 ? `Distance: ${distance} m` : 'Please scan a marker!';
  }
  
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 10,
        alignItems: 'center'
      }}
    >
      <Text style={localStyles.buttonText}>
        {text}
      </Text>
    </View>
  );
};

DistanceText.propTypes = {
  viroAppProps: PropTypes.object,
  distance: PropTypes.number,
  destination: PropTypes.any
};

export default DistanceText;
