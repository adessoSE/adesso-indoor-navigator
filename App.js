import React, { Component } from 'react';
import { View } from 'react-native';
import { ViroARSceneNavigator } from 'react-viro';

import { VIRO_API_KEY, VIRO_FEATURES_MAP } from 'react-native-dotenv';
import { localStyles } from './localStyles';
import ModalFilterPicker from './js/components/ModalFilterPicker.component';
import ScanButton from './js/components/ScanButton.component';
import DestinationButton from './js/components/DestinationButton.component';
import DistanceText from './js/components/DistanceText.component';
import Indicator from './js/components/Indicator.component';
import DebugCamera from './js/components/DebugCamera.component';
import LoginFailedScreen from './js/components/LoginFailedScreen.component';
import LoginForm from './js/components/LoginForm.component';
import MapScene from './js/MapScene';
import * as FirebaseTools from './js/components/FirebaseTools';

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
      markersById: null,
      currentMarker: null,

      // viroAppProps are used partially to pass information along to Viro React, but the object is also passed along
      // from Viro to other components, such as Navigation.js. In other words, this object is also used to pass
      // data to components, other than those from Viro React.
      viroAppProps: {
        featuresmap: VIRO_FEATURES_MAP,
        cameraPosition: [0, 0, 0],
        destinationName: defaultDestinationName,
        destinationLocation: null,
        indicator: null,
        items: null,
        markerID: 0, //actual marker ID
        markerPosition: [0, 0, 0],
        markers: null,
        pauseUpdates: defaultPauseUpdates,
        picked: null,
        position: [0, 0, 0], //actual relativ position regarding marker
        showPointCloud: true,
        _getListData: this._getListDataForLocation,
        setDistanceAndIndicatorDirections: this.setDistanceAndIndicatorDirections,
        onMarkerDetected: this.onMarkerDetected,
        setNewCameraPosition: this.setNewCameraPosition,
        setNewMarkerPosition: this.setNewMarkerPosition,
      }
    };
  }

  componentDidMount = () => {
    /* Logout at start */
    // FirebaseTools.logOutOf(this.state.firebaseApp);

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
          this.setViroAppProps({ items: items }, this.getMarkers);
        });
      }
    });
  }

  componentWillUnmount = () => {
    console.log('Component will unmount');
  }

  getMarkers = () => {
    const locations = this.state.viroAppProps.items;
    let markers = [];

    /*
     * Saves coordinates of all markers by marker name + index.
     * Example: a marker named 'someMarker' at index 3 would lead
     * to the key 'someMarker3'
     */
    let markersById = {};

    locations.forEach(location => {
      if (location.markers) {
        location.markers.forEach((marker, index) => {
          //TODO: change nr to number / index
          /* Save every marker together with it's location and number (nr) */
          const markerId = location.name + index;

          markers.push({
            ...marker,
            location: location.name,
            nr: index,
            id: markerId
          });
          

          markersById[markerId] = {
            ...marker,
            location: location.name
          };
        });
      }
    });

    this.setState({ markersById });
    this.setViroAppProps({ markers });
  }

  /**
   * Sets attributes of state.viroAppProps.
   * @param [object] newProps - Object containing the properties to be set
   * @param [function] callback
   */
  setViroAppProps = (newProps, callback = () => {}) => {
    this.setState({
      viroAppProps: {
        ...this.state.viroAppProps,
        ...newProps
      }
    }, callback);
  }

  render() {
    const { isSignedIn } = this.state;
    
    return (
      <React.Fragment>
        {/* MiniMap and ViroScene */}
        {/* Only Render if the User is signed in*/}
        {isSignedIn ? (
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

            {USEMAP && this.state.currentMarker ? (
              <MapScene
                featuresMap={this.state.viroAppProps.featuresmap}
                currentMarker={this.state.currentMarker}
                position={this.state.viroAppProps.position}
              />
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
                <LoginForm firebaseApp={this.state.firebaseApp} />
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

  setDistanceAndIndicatorDirections = (newDistance, newIndicatorDirections) => {
    const distanceDifference = Math.abs(newDistance - this.state.distance);

    if (!this.state.modalVisible && distanceDifference > 0.1) {
      this.setState({
        distance: newDistance,
        indicator: newIndicatorDirections
      });
    }
  }

  setNewCameraPosition = newCameraPosition => {
    const addValues = (a, b) => a + b;

    // TODO this calculates the sum of all differences on all the axes
    // instead of the distance between the to positions. This might
    // be intentional, but it might also be a bug.
    const newpos = newCameraPosition.reduce(addValues);
    const oldpos = this.state.viroAppProps.cameraPosition.reduce(addValues);
    const diff = newpos - oldpos;
        
    /* set new Position if there is a significant difference */
    if (Math.abs(diff) < 0.1) {
      this.setViroAppProps({
        cameraPosition: newCameraPosition,
        position: this.getCameraPositionRelativeToMarker()
      });
    }
  }

  setNewMarkerPosition = newMarkerPosition => {
    this.setViroAppProps({
      markerPosition: newMarkerPosition
    });
  }

  getCameraPositionRelativeToMarker = () => {
    const markerPosition = this.state.viroAppProps.markerPosition;
    const cameraPosition = this.state.viroAppProps.cameraPosition;

    if (markerPosition && cameraPosition) {
      return [
        cameraPosition[0] - markerPosition[0],
        cameraPosition[1] - markerPosition[1],
        cameraPosition[2] - markerPosition[2]
      ];
    }
  }

  onMarkerDetected = markerID => {
    /* Check if the marker is the same one as before */
    if (markerID !== this.state.viroAppProps.markerID) {
      console.log('Marker with ID ' + markerID + ' detected.');

      // Show dialog to pick destination
      this.setState({
        modalVisible: true,
        currentMarker: this.state.markersById[markerID]
      });
      this.setViroAppProps({
        markerID: markerID,
        pauseUpdates: true,
        showPointCloud: false
      });
    } else if (!this.state.viroAppProps.pauseUpdates) {
      console.log('Same marker found as before, will stop looking for markers');
      this.setViroAppProps({ pauseUpdates: true });
    }
  }
}

module.exports = ViroSample;
