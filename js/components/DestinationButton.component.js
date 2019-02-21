import React from 'react';
import { TouchableHighlight, Text, View } from 'react-native';

import { localStyles } from '../../localStyles';
import PropTypes from 'prop-types';

const DestinationButton = ({ destinationLocation, destinationName, onPress }) => {
  if (destinationLocation) {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 25,
          alignItems: 'center'
        }}
      >
        <TouchableHighlight
          style={localStyles.buttons}
          onPress={onPress}
          underlayColor={'#68a0ff'}
        >
          <Text style={localStyles.buttonText}>
            {destinationName !== 'none'
              ? `Destination: ${destinationName}`
              : 'Choose Destination'}
          </Text>
        </TouchableHighlight>
      </View>        
    );
  } else {
    return null;
  }
};

DestinationButton.propTypes = {
  destinationLocation: PropTypes.any,
  destinationName: PropTypes.any,
  onPress: PropTypes.func
};

export default DestinationButton;