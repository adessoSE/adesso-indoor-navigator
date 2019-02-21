import React from 'react';
import { Text } from 'react-native';

export let bla = true;

const TestComponent = ({ viroAppProps }) => {
  return (
    <Text>
      { viroAppProps.testProp }
    </Text>
  );
};

export const test = () => {
  bla = false;
};

export default TestComponent;