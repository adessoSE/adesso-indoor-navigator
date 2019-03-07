import React from 'react';
import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';
import { generalStyles } from '../../generalStyles';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  buttons: {
    height: 70,
    width: 250,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#68a0cf'
  }
});

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
          style={styles.buttons}
          onPress={onPress}
          underlayColor={'#68a0ff'}
        >
          <Text style={generalStyles.buttonText}>
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