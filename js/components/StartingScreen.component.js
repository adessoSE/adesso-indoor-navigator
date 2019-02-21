import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import PropTypes from 'prop-types';

import { localStyles } from '../../localStyles';

const StartingScreen = ({ headingAccuracy, onForceStart }) => {
  return (
    <View>
      <Text>
        Heading accuracy is:
        {headingAccuracy > 20 ? (
          <Text style={{ color: 'red' }}>
            low: {headingAccuracy}
          </Text>
        ) : (
          <Text style={{ color: 'green' }}>{headingAccuracy}</Text>
          )}
      </Text>

      <View>
        <TouchableHighlight
          style={localStyles.startARButton}
          onPress={onForceStart}
          underlayColor={'#ff8888'}
          >
          <Text style={localStyles.buttonText}>Start App</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

StartingScreen.propTypes = {
  headingAccuracy: PropTypes.number,
  onForceStart: PropTypes.func
};

export default StartingScreen;