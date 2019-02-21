import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ViroARSceneNavigator } from 'react-viro';
import { orientation, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

import { VIRO_API_KEY } from 'react-native-dotenv';
import { localStyles } from './localStyles';
import ModalFilterPicker from './js/components/ModalFilterPicker.component';
import ScanButton from './js/components/ScanButton.component';
import DestinationButton from './js/components/DestinationButton.component';
import DistanceText from './js/components/DistanceText.component';
import Indicator from './js/components/Indicator.component';
import DebugCamera from './js/components/DebugCamera.component';
import TestComponent from './js/components/TestComponent.component';
import StartingScreen from './js/components/StartingScreen.component';
import LoginFailedScreen from './js/components/LoginFailedScreen.component';
import LoginForm from './js/components/LoginForm.component';
import * as FirebaseTools from './js/components/FirebaseTools';
import strings from './i18n/strings';

// import MapScene from './js/MapScene';

var sharedProps = {
  apiKey: VIRO_API_KEY,
};

const USEMAP = false;
const InitialARScene = require('./js/Navigation');

const defaultDestination = 'none';
const defaultPauseUpdates = false;

export default class ViroSample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firebaseApp: FirebaseTools.initializeDatabase(),
      distance: 0,
      isSignedIn: null,
      locations: null,
      modalVisible: false,
      options: null,
      sharedProps,
      userData: null,
      headingAccuracy: null,
      startAR: null,
      viroAppProps: {
        //featuresmap: config.viro.featuresMap,
        cameraPosition: [0, 0, 0],
        currentMarkerCoordinates: null,
        destination: defaultDestination,
        destinationLocation: null,
        heading: null,
        indicator: null,
        items: null,
        markerCoordinates: null,
        markerID: 0, //actual marker ID
        markerPosition: [0, 0, 0],
        markers: null,
        pauseUpdates: defaultPauseUpdates,
        picked: null,
        position: [0, 0, 0], //actual relativ position regarding marker
        showPointCloud: true,
        _getListData: this._getListData,
        _onCameraUpdate: this._onCameraUpdate,
        _setMarkerID: this._setMarkerID,
        _getCameraPosition: this._getCameraPosition,
        _getMarkerPosition: this._getMarkerPosition,
        _getPosition: this._getPosition
      }
    };
  }

  testrender() {
    return (
      <TestComponent viroAppProps={this.state.viroAppProps}></TestComponent>
    );
  }

  createHeadingListener = () => {
    console.log('Creating HeadingListener');
    let orientationUpdateInterval = 400;

    setUpdateIntervalForType(SensorTypes.orientation, orientationUpdateInterval);

    this.headingListener = orientation.subscribe(update => {
      this.onHeadingUpdated({
        trueHeading: update.azimuth,
        headingAccuracy: update.accuracy
      });

      this.setState({
        headingIsSupported: true
      });
    }, error => {
      console.error(error);
      this.setState({
        headingIsSupported: false
      });
    });
  }

  onHeadingUpdated = heading => {
    if (this.state.headingAccuracy !== heading.headingAccuracy) {
      /* Heading accuracy changed  */
      this.setState(
        {
          headingAccuracy: heading.headingAccuracy
        },
        () => {
          console.log('headingAccuracy set to ' + this.state.headingAccuracy);
        }
      );
    }

    /* set Heading when user wants to start OR if Accuracy is good*/
    if (this.state.startAR || heading.headingAccuracy <= 20) {
      console.log('Stopping HeadingListener');
      this.stopHeadingListener();
      /* Accurate Heading found */
      this.setState(
        {
          viroAppProps: {
            ...this.state.viroAppProps,
            heading: heading.trueHeading
          }
        },
        () => {
          console.log('Heading set to ' + this.state.viroAppProps.heading);
        }
      );
    }
  }

  componentDidMount = () => {
    /* Device Heading Listener */
    this.createHeadingListener();

    /* Logout at start */
    // firebase
    //   .auth()
    //   .signOut()
    //   .then(() => {
    //     console.log('Logged out');
    //   })
    //   .catch(error => console.log('error'));

    /* Firebase get Data after login */
    this.state.firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        console.info('User Logged in');

        this.setState({
          isSignedIn: true,
          modalVisible: true
        });

        /* Get Data */
        let itemsRef = FirebaseTools.getItemsRef(this.state.firebaseApp);

        itemsRef.on('value', snapshot => {
          let data = snapshot.val();
          let items = Object.values(data);
          this.setState(
            {
              viroAppProps: {
                ...this.state.viroAppProps,
                items: items
              }
            },
            () => {
              this.getMarkers();
            }
          );
        });
      }
    });
  }

  componentWillUnmount = () => {
    console.log('ComponentWillunmount');
    this.stopHeadingListener();
  }

  stopHeadingListener = () => {
    this.headingListener.unsubscribe();
  }

  getMarkers = () => {
    const items = this.state.viroAppProps.items;
    let markers = [];

    console.warn(items);

    /*
     * Saves coordinates of all markers by marker name + index.
     * Example: a marker named 'someMarker' at index 3 would lead
     * to the key 'someMarker3'
     */
    let coordsObj = {};

    items.forEach(item => {
      if (item.markers) {
        item.markers.forEach((marker, index) => {
          //TODO: change nr to number / index
          /* Save every marker together with it's location and number (nr) */
          markers.push({
            ...marker,
            location: item.name,
            nr: index
          });

          // Add marker coordinates to coordsObj
          if (marker.coordinator) {
            coordsObj[item.name + index] = marker.coordinator;
          }
        });
      }
    });

    this.setState({
      viroAppProps: {
        ...this.state.viroAppProps,
        markers: markers,
        markerCoordinates: coordsObj
      }
    });
  }

  setViroAppProps = (newProps) => {
    this.setState({
      viroAppProps: {
        ...this.state.viroAppProps,
        ...newProps
      }
    });
  }

  render() {
    const { isSignedIn, startAR } = this.state;
    
    return (
      <React.Fragment>
        {/* MiniMap and ViroScene */}
        {/* Only Render if the User is signed in
        && this.state.viroAppProps.heading !== null
        */}
        {(isSignedIn && this.state.viroAppProps.heading !== null) ||
        (isSignedIn && startAR) ? (
          <View style={localStyles.outer}>

            {this.state.modalVisible ? (
              <ModalFilterPicker
                onCancel={this.onModalClose }
                onDestinationUpdate={this.onDestinationUpdate}
                locations={this.state.locations}
                options={this.state.options}
              />
            ) : null}

            <ViroARSceneNavigator
              style={localStyles.arView}
              {...this.state.sharedProps}
              initialScene={{ scene: InitialARScene }}
              viroAppProps={this.state.viroAppProps}
            />

            <ScanButton
              onPress={() => this.setViroAppProps({pauseUpdates: false})}
            />

            <DestinationButton
              viroAppProps={this.state.viroAppProps}
              onPress={() => this.setState({ modalVisible: true })}
            />

            <DistanceText
              destination={this.state.viroAppProps.destination}
              distance={this.state.distance}
            />

            {/* {USEMAP && this.state.viroAppProps.currentMarkerCoordinates ? (
              <MapScene
                style={localStyles.map}
                viroAppProps={this.state.viroAppProps}
              />
            ) : null} */}

            {/* Indicators */}
            <Indicator directions={this.state.indicator} />

            {/* Debug Camera, not shown by default */}
            <DebugCamera />
          </View>
        ) : (
          // Login and info / start screen after login
          <View style={localStyles.loginContainer}>
            {isSignedIn === false ?
              <LoginFailedScreen /> :
              (<View>
                {isSignedIn === true ?
                  <StartingScreen
                    headingAccuracy={this.state.headingAccuracy}
                    onForceStart={() => this.setState({ startAR: true })}
                  /> :
                  <LoginForm firebaseApp={this.state.firebaseApp} />
                }
              </View>)}
          </View>
        )}
      </React.Fragment>
    );
  }

  onDestinationUpdate = (destination, destinationLocation) => {
    this.setViroAppProps({ destination, destinationLocation });
    this.setState({ modalVisible: false });
  }

  onModalClose = () => {
    this.setState({
      modalVisible: false
    });
  }

  _getListData = locationName => {
    /*  get locaiton list Data after scanned Marker (known location)  */
    const items = this.state.viroAppProps.items;
    const locations = items.filter(item => item.name === locationName);
    let options = [];
    //TODO: replace with locations.length > 0
    if (locations) {
      /* push each poi name into options */
      locations[0].pois.forEach(poi => {
        options.push({
          key: poi.title,
          label: poi.title,
          searchKey: poi.title
        });
      });
      this.setState({
        locations: locations[0],
        options: options
      });
    }
  }

  _toggleDetection = () => {
    this.setState({
      viroAppProps: {
        ...this.state.viroAppProps,
        pauseUpdates: false
      }
    });
  }

  _onCameraUpdate = (distance, indicator) => {
    if (
      (!this.state.modalVisible && distance < this.state.distance - 0.1) ||
      distance > this.state.distance + 0.1
    ) {
      this.setState({
        distance: distance,
        indicator: indicator
      });
    }
  }

  _getCameraPosition = position => {
    /* set new Position if there is a significant difference */
    const newpos = position.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    const oldpos = this.state.viroAppProps.cameraPosition.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    const diff = newpos - oldpos;
    if (diff < -0.1 || diff > 0.1) {
      console.log('Set new cameraPosition');
      this.setState({
        viroAppProps: {
          ...this.state.viroAppProps,
          cameraPosition: position,
          position: this._getPosition()
        }
      });
    }
  }

  _getMarkerPosition = position => {
    this.setState({
      viroAppProps: {
        ...this.state.viroAppProps,
        markerPosition: position
      }
    });
  }

  _getPosition = () => {
    if (
      this.state.viroAppProps.markerPosition &&
      this.state.viroAppProps.cameraPosition
    ) {
      let position = [
        this.state.viroAppProps.cameraPosition[0] -
          this.state.viroAppProps.markerPosition[0],

        this.state.viroAppProps.cameraPosition[1] -
          this.state.viroAppProps.markerPosition[1],

        this.state.viroAppProps.cameraPosition[2] -
          this.state.viroAppProps.markerPosition[2]
      ];
      return position;
    }
  }

  _setMarkerID = id => {
    /* Marker Found */
    /* Check if new Marker is found */
    if (id !== this.state.viroAppProps.markerID) {
      console.log('Set MarkerID & pauseUpdates true');
      console.warn(
        'This ID is: ',
        id,
        'and coords: ',
        this.state.viroAppProps.markerCoordinates[id]
      );
      this.setState({
        modalVisible: true,
        viroAppProps: {
          ...this.state.viroAppProps,
          currentMarkerCoordinates: this.state.viroAppProps.markerCoordinates[
            id
          ],
          markerID: id,
          pauseUpdates: true,
          showPointCloud: false
        }
      });
    } else if (!this.state.viroAppProps.pauseUpdates) {
      console.log('Same marker. Set pauseUpdates true');
      this.setState({
        viroAppProps: {
          ...this.state.viroAppProps,
          pauseUpdates: true
        }
      });
    }
  }
}

module.exports = ViroSample;
