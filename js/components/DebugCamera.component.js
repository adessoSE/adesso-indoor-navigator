import React from 'react';
import { View, Text } from 'react-native';
import { localStyles } from '../../localStyles';

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
        <Text style={localStyles.debugText}>
          {/* <Text>{this.state.viroAppProps.heading + ""}</Text> */}
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
