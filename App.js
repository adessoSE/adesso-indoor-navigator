import React, { Component } from 'react';
import { View } from 'react-native';
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
import StartingScreen from './js/components/StartingScreen.component';
import LoginFailedScreen from './js/components/LoginFailedScreen.component';
import LoginForm from './js/components/LoginForm.component';
import Minimap from './js/components/Minimap.component';
import * as FirebaseTools from './js/components/FirebaseTools';
import strings from './i18n/strings';

// import MapScene from './js/MapScene';

const USEMAP = true;
const InitialARScene = require('./js/Navigation');

const defaultDestinationName = 'none';
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
      userData: null,
      headingAccuracy: null,
      startAR: null,
      viroAppProps: {
        //featuresmap: config.viro.featuresMap,
        cameraPosition: [0, 0, 0],
        currentMarkerCoordinates: null,
        destinationName: defaultDestinationName,
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
        updateMarkerPositionInViroAppProps: this.updateMarkerPositionInViroAppProps,
        _getListData: this._getListDataForLocation,
        _onCameraUpdate: this._onCameraUpdate,
        _setMarkerID: this._onMarkerDetected,
        _getCameraPosition: this._getCameraPosition,
        _getMarkerPosition: this.updateMarkerPositionInViroAppProps,
        _getPosition: this._getPosition
      }
    };
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

  stopHeadingListener = () => {
    this.headingListener.unsubscribe();
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
    console.log('Component will unmount');
    this.stopHeadingListener();
  }

  getMarkers = () => {
    const items = this.state.viroAppProps.items;
    let markers = [];

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
              apiKey={VIRO_API_KEY}
              initialScene={{ scene: InitialARScene }}
              viroAppProps={this.state.viroAppProps}
            />

            <ScanButton
              onPress={() => this.setViroAppProps({pauseUpdates: false})}
            />

            <DestinationButton
              destinationLocation={this.state.viroAppProps.destinationLocation}
              destinationName={this.state.viroAppProps.destinationName}
              onPress={() => this.setState({ modalVisible: true })}
            />

            <DistanceText
              destinationName={this.state.viroAppProps.destinationName}
              distance={this.state.distance}
            />

            {/* TODO: Remove the "|| true" once the minimap feature is completed */}
            {USEMAP && (this.state.viroAppProps.currentMarkerCoordinates || true) ? (
              <Minimap />
            ) : null}

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

  onDestinationUpdate = (destinationName, destinationLocation) => {
    this.setViroAppProps({
      destinationName,
      destination: destinationName,
      destinationLocation
    });
    this.setState({ modalVisible: false });
  }

  onModalClose = () => {
    this.setState({
      modalVisible: false
    });
  }

  _getListDataForLocation = locationName => {
    /*  get locaiton list Data after scanned Marker (known location)  */
    const items = this.state.viroAppProps.items;
    const locationsWithMatchingName = items.filter(item => item.name === locationName);
    let options = [];
    //TODO: replace with locations.length > 0
    if (locationsWithMatchingName) {
      /* push each poi name into options */
      locationsWithMatchingName[0].pois.forEach(poi => {
        options.push({
          key: poi.title,
          label: poi.title,
          searchKey: poi.title
        });
      });
      this.setState({
        locations: locationsWithMatchingName[0],
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
      console.log(this.state.viroAppProps.cameraPosition);
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

  updateMarkerPositionInViroAppProps = newMarkerPosition => {
    this.setViroAppProps({
      markerPosition: newMarkerPosition
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

  _onMarkerDetected = markerID => {
    /* Marker Found */
    /* Check if the marker is the same one as before */
    if (markerID !== this.state.viroAppProps.markerID) {
      console.log('Set MarkerID & pauseUpdates true');
      this.setState({
        modalVisible: true,
        viroAppProps: {
          ...this.state.viroAppProps,
          currentMarkerCoordinates: this.state.viroAppProps.markerCoordinates[
            markerID
          ],
          markerID: markerID,
          pauseUpdates: true,
          showPointCloud: false
        }
      });
    } else if (!this.state.viroAppProps.pauseUpdates) {
      console.log('Same marker. Set pauseUpdates true');
      this.setViroAppProps({ pauseUpdates: true });
    }
  }
}

module.exports = ViroSample;
