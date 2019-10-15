import React from 'react';
import { View, TouchableHighlight, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  icon: {
    height: 64,
    width: 64
  }
});

const TogglePostionMode = ({ onPress, coord }) => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 80,
        right: 0,
        top: 15,
        alignItems: 'flex-start',
        zIndex: 3
      }}
    >
      <TouchableHighlight onPress={onPress}>
        <Text> Toogle Position Mode X:{coord[0]} Z:{coord[1]} Y:{coord[2]}</Text>
      </TouchableHighlight>

    </View>
  );
};

TogglePostionMode.propTypes = {
  onPress: PropTypes.func,
  coord: PropTypes.array
};

export default TogglePostionMode;