import React, { Component } from "react";
import {
  Alert,
  AppRegistry,
  Button,
  Dimensions,
  Image,
  NativeEventEmitter,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";

// Device Heading
import ReactNativeHeading from "@zsajjad/react-native-heading";

import config from './config';

//
// ─── LOGIN FORM ─────────────────────────────────────────────────────────────────
//

import t from "tcomb-form-native";
const Form = t.form.Form;
const User = t.struct({
  email: t.String,
  password: t.String
});

const options = {
  fields: {
    email: {
      error: "Please enter a valid @adesso Mail.",
      autoCorrect: false,
      autoCapitalize: "none",
      autoFocus: true,
      textContentType: "username"
    },
    password: {
      error: "Please enter your password.",
      password: true,
      secureTextEntry: true,
      textContentType: "password"
    }
  },
  stylesheet: formStyles
};
const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
    }
  },
  controlLabel: {
    normal: {
      color: "blue",
      fontSize: 18,
      marginBottom: 7,
      fontWeight: "600"
    },
    // the style applied when a validation error occours
    error: {
      color: "red",
      fontSize: 18,
      marginBottom: 7,
      fontWeight: "600"
    }
  }
};
// ────────────────────────────────────────────────────────────────────────────────

//
// ─── FIREBASE ───────────────────────────────────────────────────────────────────
//

import firebase from "firebase";
firebase.initializeApp(config.firebase);
const rootRef = firebase.database().ref();
const itemsRef = rootRef.child("branches");
// ────────────────────────────────────────────────────────────────────────────────

import ModalFilterPicker from "react-native-modal-filter-picker";

import { ViroSceneNavigator, ViroARSceneNavigator } from "react-viro";
import MapScene from "./js/MapScene";

var sharedProps = {
  apiKey: config.viro.apiKey
};
// Sets the default scene you want for AR and VR
var InitialARScene = require("./js/Navigation");

var USEMAP = true;
var UNSET = "UNSET";
var VR_NAVIGATOR_TYPE = "VR";
var AR_NAVIGATOR_TYPE = "AR";

var defaultDestination = "none";
var defaultPauseUpdates = false;
export default class ViroSample extends Component {
  constructor() {
    super();
    this._getListData = this._getListData.bind(this);
    this._onCameraUpdate = this._onCameraUpdate.bind(this);
    this._toggleDetection = this._toggleDetection.bind(this);
    this._setMarkerID = this._setMarkerID.bind(this);
    this._getCameraPosition = this._getCameraPosition.bind(this);
    this._getMarkerPosition = this._getMarkerPosition.bind(this);
    this._getPosition = this._getPosition.bind(this);

    this.state = {
      distance: 0,
      isSignedIn: null,
      locations: null,
      modalVisible: false,
      options: null,
      sharedProps: sharedProps,
      userData: null,
      headingAccuracy: null,
      startAR: null,
      viroAppProps: {
        featuresmap: config.viro.featuresMap,
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

  handleSubmit = () => {
    const value = this._form.getValue();
    /* Set email and password */
    if (value) {
      this.setState(
        prevState => {
          const newState = prevState;
          newState.userData = value;
          return newState;
        },
        () => this.login()
      );
    }
  };

  login() {
    /* Firebase Authentication */
    firebase
      .auth()
      .signInWithEmailAndPassword(
        this.state.userData.email,
        this.state.userData.password
      )
      .then(credential => {
        if (credential) {
          console.log("Signed In");
        }
      })
      /* Catch if login was invalid */
      .catch(error =>
        this.setState({
          isSignedIn: false
        })
      );
  }
  createHeadingListener() {
    console.log("Creating HeadingListener");
    let headings = [];
    this.listener = new NativeEventEmitter(ReactNativeHeading);
    ReactNativeHeading.start(1).then(didStart => {
      this.setState({
        headingIsSupported: didStart
      });
    });

    this.listener.addListener("headingUpdated", heading => {
      console.log(heading, heading.headingAccuracy, heading.trueHeading);
      /* rewrote npm package to get headingAccuracy and trueHeading value */
      /* /node_modules/@zsajjad/react-native-heading/ReactNativeHeading.m */
      /*
          _heading = @{
        @"trueHeading": @(newHeading.trueHeading),
        @"headingAccuracy": @(newHeading.headingAccuracy)
        };

        [self sendEventWithName:@"headingUpdated" body:(_heading)];
     */

      if (this.state.headingAccuracy !== heading.headingAccuracy) {
        /* Heading accuracy changed  */
        this.setState(
          {
            headingAccuracy: heading.headingAccuracy
          },
          () => {
            console.log("headingAccuracy set to " + this.state.headingAccuracy);
          }
        );
      }
      /* set Heading when user wants to start OR if Accuracy is good*/
      if (this.state.startAR || heading.headingAccuracy <= 20) {
        console.log("Stopping HeadingListener");
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
            console.log("Heading set to " + this.state.viroAppProps.heading);
          }
        );
      }
    });
  }
  componentDidMount() {
    /* Device Heading Listener */
    this.createHeadingListener();

    /* Logout at start */
    // firebase
    //   .auth()
    //   .signOut()
    //   .then(() => {
    //     console.log("Logged out");
    //   })
    //   .catch(error => console.log("error"));

    /* Firebase get Data after login */
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.info("User Logged in");
        /* Logged in */
        this.setState({
          isSignedIn: true,
          modalVisible: true
        });
        /* Get Data */
        itemsRef.on("value", snapshot => {
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

  componentWillUnmount() {
    console.log("ComponentWillunmount");
    //this.stopHeadingListener();
  }
  stopHeadingListener() {
    ReactNativeHeading.stop();
    this.listener.removeAllListeners("headingUpdated");
  }
  getMarkers() {
    const items = this.state.viroAppProps.items;
    let markers = [];
    let coordsObj = {};
    /* Get every marker and add location, nr */
    items.forEach(item => {
      if (item.markers) {
        item.markers.forEach((marker, index) => {
          //console.log("MARKERINDEXCOORDS:", marker.coordinator);
          markers.push({
            ...marker,
            location: item.name,
            nr: index
          });
          /* Add marker coordinates to coordsObj */
          if (marker.coordinator) {
            coordsObj = {
              ...coordsObj,
              [item.name + index]: marker.coordinator
            };
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
  // Replace this function with the contents of _getVRNavigator() or _getARNavigator()
  // if you are building a specific type of experience.
  render() {
    const { modalVisible, isSignedIn, headingAccuracy, startAR } = this.state;

    return (
      <React.Fragment>
        {/* MiniMap and ViroScene */}
        {/* Only Render if the User is signed in
        && this.state.viroAppProps.heading !== null
        */}
        {(isSignedIn && this.state.viroAppProps.heading !== null) ||
        (isSignedIn && startAR) ? (
          <View style={localStyles.outer}>
            {this.state.options !== null ? (
              <ModalFilterPicker
                title={"Select Destination"}
                visible={modalVisible}
                onSelect={this.onSelect}
                onCancel={this.onCancel}
                options={this.state.options}
                placeholderText={"Büro, Vorname, Nachname"}
              />
            ) : (
              <View />
            )}
            <ViroARSceneNavigator
              style={localStyles.arView}
              {...this.state.sharedProps}
              initialScene={{ scene: InitialARScene }}
              viroAppProps={this.state.viroAppProps}
            />
            {/* Scan Button */}
            <View
              style={{
                position: "absolute",
                left: 15,
                right: 0,
                top: 15,
                alignItems: "flex-start"
              }}
            >
              <TouchableHighlight onPress={this._toggleDetection}>
                <Image
                  style={localStyles.icon}
                  source={require("./js/res/barcode.png")}
                />
              </TouchableHighlight>
            </View>
            {/* Desitnation Button */}
            {this.state.viroAppProps.destinationLocation ? (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 25,
                  alignItems: "center"
                }}
              >
                <TouchableHighlight
                  style={localStyles.buttons}
                  onPress={this.onShow}
                  underlayColor={"#68a0ff"}
                >
                  <Text style={localStyles.buttonText}>
                    {this.state.viroAppProps.destination !== "none"
                      ? "Destination: " + this.state.viroAppProps.destination
                      : "Choose Destination"}
                  </Text>
                </TouchableHighlight>
              </View>
            ) : null}
            {/* Distance Text */}
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 10,
                alignItems: "center"
              }}
            >
              <Text style={localStyles.buttonText}>
                {this.state.viroAppProps.destination !== "none"
                  ? this.state.distance !== 0
                    ? "Distance: " + this.state.distance + " m"
                    : "Please scan a marker!"
                  : ""}
              </Text>
            </View>
            {USEMAP && this.state.viroAppProps.currentMarkerCoordinates ? (
              <MapScene
                style={localStyles.map}
                viroAppProps={this.state.viroAppProps}
              />
            ) : null}
            {/* Indicator */}
            {this._getIndicatorLR()}
            {this._getIndicatorTB()}
            {/* Debug Camera */}
            {
              // <View
              //   style={{
              //     position: "absolute",
              //     left: 0,
              //     right: 0,
              //     bottom: "50%",
              //     alignItems: "center"
              //   }}
              // >
              //   <Text style={localStyles.debugText}>
              //     {/* <Text>{this.state.viroAppProps.heading + ""}</Text> */}
              //     {/*   {"cameraPosition:" +
              //         JSON.stringify(this.state.viroAppProps.cameraPosition) +
              //         "\n"}
              //       {"markerPosition:" +
              //         JSON.stringify(this.state.viroAppProps.markerPosition) +
              //         "\n"}
              //       {"Position:" +
              //         JSON.stringify(this.state.viroAppProps.position) +
              //         "\n"} */}
              //   </Text>
              // </View>
            }
          </View>
        ) : (
          //
          // LOGIN FORM
          //
          /* Failed login message */
          <View style={localStyles.loginContainer}>
            {isSignedIn === false ? (
              <Text style={{ color: "red" }}>
                Login Failed. Make sure you are registered.
              </Text>
            ) : null}
            <View>
              {isSignedIn === true ? (
                <View>
                  <Text>
                    Heading accuracy is:
                    {headingAccuracy > 20 ? (
                      <Text style={{ color: "red" }}>
                        low: {headingAccuracy}
                      </Text>
                    ) : (
                      <Text style={{ color: "green" }}>{headingAccuracy}</Text>
                    )}
                  </Text>

                  <View>
                    <TouchableHighlight
                      style={localStyles.startARButton}
                      onPress={this.onStartAR}
                      underlayColor={"#ff8888"}
                    >
                      <Text style={localStyles.buttonText}>Start AR</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              ) : (
                <View>
                  <Form
                    ref={c => (this._form = c)} // assign a ref
                    type={User}
                    options={options}
                  />
                  <Button title="Sign in" onPress={this.handleSubmit} />
                </View>
              )}
            </View>
          </View>
          // /LOGIN• • • • •
        )}
        )}
      </React.Fragment>
    );
  }

  onShow = () => {
    this.setState({ modalVisible: true });
  };

  onStartAR = () => {
    this.setState({ startAR: true });
  };
  onSelect = picked => {
    /* Filter the current picked entry  */
    let destPos = this.state.locations.pois.filter(
      poi => poi.title === picked.key
    )[0];

    this.setState({
      modalVisible: false,
      viroAppProps: {
        ...this.state.viroAppProps,
        destination: picked.key,
        destinationLocation: destPos
      }
    });
  };

  onCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  //
  // ─── INDICATORS ─────────────────────────────────────────────────────────────────
  //

  _getIndicatorLR() {
    if (this.state.indicator) {
      return (
        /* Indicator Left */
        this.state.indicator[0] === "left" ? (
          <View
            style={{
              position: "absolute",
              left: 15,
              right: 0,
              top: "35%",
              alignItems: "flex-start"
            }}
          >
            <Image
              style={localStyles.arrowleft}
              source={require("./js/res/left.png")}
            />
          </View>
        ) : /* Indicator Right */
        this.state.indicator[0] === "right" ? (
          <View
            style={{
              position: "absolute",
              right: 15,
              top: "35%",
              alignItems: "flex-start"
            }}
          >
            <Image
              style={localStyles.arrowright}
              source={require("./js/res/left.png")}
            />
          </View>
        ) : (
          <View />
        )
      );
    }
  }

  _getIndicatorTB() {
    if (this.state.indicator) {
      return (
        /* Indicator Top */
        this.state.indicator[0] === "top" ||
          this.state.indicator[1] === "top" ? (
          <View
            style={{
              position: "absolute",
              left: "45%",
              right: 0,
              top: -15,
              alignItems: "flex-start"
            }}
          >
            <Image
              style={localStyles.arrowtop}
              source={require("./js/res/left.png")}
            />
          </View>
        ) : /* Indicator Bottom */
        this.state.indicator[0] === "bottom" ||
        this.state.indicator[1] === "bottom" ? (
          <View
            style={{
              position: "absolute",
              left: "45%",
              right: 0,
              bottom: 80,
              alignItems: "flex-start"
            }}
          >
            <Image
              style={localStyles.arrowbottom}
              source={require("./js/res/left.png")}
            />
          </View>
        ) : (
          <View />
        )
      );
    }
  }

  _getListData(location) {
    /*  get locaiton list Data after scanned Marker (known location)  */
    const items = this.state.viroAppProps.items;
    let opt = [];
    const locations = items.filter(item => item.name === location);
    if (locations) {
      /* push each poi name into options */
      locations[0].pois.forEach(poi => {
        opt.push({
          key: poi.title,
          label: poi.title,
          searchKey: poi.title
        });
      });
      this.setState({
        locations: locations[0],
        options: opt
      });
    }
  }

  _toggleDetection() {
    this.setState({
      viroAppProps: {
        ...this.state.viroAppProps,
        pauseUpdates: false
      }
    });
  }

  //
  // ─── CAMERAPOSITION ─────────────────────────────────────────────────────────────
  //

  _onCameraUpdate(distance, indicator) {
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
  _getCameraPosition(position) {
    /* set new Position if there is a significant difference */
    const newpos = position.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    const oldpos = this.state.viroAppProps.cameraPosition.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    const diff = newpos - oldpos;
    if (diff < -0.1 || diff > 0.1) {
      console.log("Set new cameraPosition");
      this.setState({
        viroAppProps: {
          ...this.state.viroAppProps,
          cameraPosition: position,
          position: this._getPosition()
        }
      });
    }
  }
  _getMarkerPosition(position) {
    this.setState({
      viroAppProps: {
        ...this.state.viroAppProps,
        markerPosition: position
      }
    });
  }
  _getPosition() {
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
  _setMarkerID(id) {
    /* Marker Found */
    /* Check if new Marker is found */
    if (id !== this.state.viroAppProps.markerID) {
      console.log("Set MarkerID & pauseUpdates true");
      console.log(
        "This ID is: ",
        id,
        "and coords: ",
        this.state.viroAppProps.markerCoordinates[id]
      );
      this.setState({
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
      console.log("Same marker. Set pauseUpdates true");
      this.setState({
        viroAppProps: {
          ...this.state.viroAppProps,
          pauseUpdates: true
        }
      });
    }
  }
}

var localStyles = StyleSheet.create({
  loginContainer: {
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
    backgroundColor: "#ffffff"
  },
  viroContainer: {
    flex: 1,
    backgroundColor: "black"
  },
  outer: {
    flex: 1,
    backgroundColor: "rgba(1,1,1,0.2)"
  },
  arView: {
    flex: 2,
    backgroundColor: "transparent"
  },
  map: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    position: "absolute",
    backgroundColor: "transparent"
  },
  inner: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black"
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color: "#fff",
    textAlign: "center",
    fontSize: 25
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20
  },
  debugText: {
    color: "#fff",
    textAlign: "left",
    fontSize: 16
  },
  buttons: {
    height: 70,
    width: 250,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  startARButton: {
    height: 70,
    width: 250,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#cc2222",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  exitButton: {
    height: 50,
    width: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  icon: {
    height: 64,
    width: 64
  },
  arrowleft: {
    width: 73,
    height: 147
  },
  arrowtop: {
    width: 73,
    height: 147,
    transform: [{ rotate: "90deg" }]
  },
  arrowright: {
    width: 73,
    height: 147,
    transform: [{ rotate: "180deg" }]
  },
  arrowbottom: {
    width: 73,
    height: 147,
    transform: [{ rotate: "-90deg" }]
  }
});

module.exports = ViroSample;
