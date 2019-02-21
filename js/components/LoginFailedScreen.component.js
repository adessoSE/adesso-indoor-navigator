import React from 'react';
import { Text } from 'react-native';

const LoginFailedScreen = () => {
  return (
    <Text style={{ color: 'red' }}>
      Login Failed. Make sure you are registered.
    </Text>
  );
};

export default LoginFailedScreen;