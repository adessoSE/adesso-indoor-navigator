import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  debugText: {
    color: "#fff",
    textAlign: "left",
    fontSize: 16
  }
});

const DebugCamera = (showCamera = false) => {
  if (showCamera) {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '50%',
          alignItems: 'center'
        }}
      >
        <Text style={styles.debugText}>
          {/*   {"cameraPosition:" +
              JSON.stringify(this.state.viroAppProps.cameraPosition) +
              "\n"}
            {"markerPosition:" +
              JSON.stringify(this.state.viroAppProps.markerPosition) +
              "\n"}
            {"Position:" +
              JSON.stringify(this.state.viroAppProps.position) +
              "\n"} */}
        </Text>
      </View>
    );
  }
};

export default DebugCamera;
