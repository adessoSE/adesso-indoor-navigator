import { AppRegistry } from 'react-native';
import App from './App.js';

// These requires fix a weird build error. For more details,
// visit https://github.com/facebook/react-native/issues/20902#issuecomment-447593887
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

AppRegistry.registerComponent('ViroSample', () => App);

// The below line is necessary for use with the TestBed App
AppRegistry.registerComponent('ViroSample', () => App);
