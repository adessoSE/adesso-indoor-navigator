/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from "react";
import {} from "../";
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import MapView, {
  MAP_TYPES,
  ProviderPropType,
  Marker
} from "react-native-maps";
import PropTypes from 'prop-types';
import Geojson from "react-native-geojson";
import StandMarker from "./StandMarker";
import user from "./res/user.png";
import {
  WebView,
  Dimensions,
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
  Image
} from "react-native";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
export const LATITUDE = 51.50427;
export const LONGITUDE = 7.52738;
export const LATITUDE_DELTA = 0.0002;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var floorplan = require("./res/json/floorplan_adesso.json"); //geojson data
export let types = ["Zimmer", "Toilette", "Aufzug", "Treppe", "Platz", "Technikhause"]; //predefined types of romms
/* const LATITUDE_1 = 52.49662;
const LONGITUDE_1 = 13.454077;
 */
/* GS CLG
 const LATITUDE_1 = 50.92;
const LONGITUDE_1 = 6.9696;
 */

export const LATITUDE_1 = 51.05799077414861;
export const LONGITUDE_1 = 6.944936513900757;

var floorplan_1 = require("./res/json/Javascript2018_Arena.json"); //geojson data

export const geojson_template = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: []
      }
    }
  ]
};

export default class MapScene extends Component {
  constructor() {
    console.warn('MAP!!!');
    super();

    this.state = {
      region: {
        latitude: LATITUDE_1,
        longitude: LONGITUDE_1,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      featuresArray: [],
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE
      },
      geolocation: {
        //actual geolocation of user
        latitude: LATITUDE_1,
        longitude: LONGITUDE_1
      }
    };
  }

  componentDidMount() {
    let newFeaturesArray = [];

    if (this.state.featuresArray.length === 0) {
      this.getFeatures().then(res => {
        newFeaturesArray.push(res);
        this.setState({ featuresArray: newFeaturesArray });
      });
    }
  }

  componentDidUpdate() {
    const markerCoordinates = this.props.viroAppProps.currentMarkerCoordinates;
    this.map.animateToRegion({
      latitude: this.calcPostion(markerCoordinates, {
        x: this.props.viroAppProps.position[0],
        y: -this.props.viroAppProps.position[2]
      }).latitude,
      longitude: this.calcPostion(markerCoordinates, {
        x: this.props.viroAppProps.position[0],
        y: -this.props.viroAppProps.position[2]
      }).longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  }

  createMarkersFromFeatures = (features) => features.map((item) => 
    item.features.map((feature, i) => (
      <Marker
        key={feature.properties.name + i}
        coordinate={{
          ...this.state.coordinate,
          latitude: feature.geometry.coordinates[0][0][0][1],
          longitude: feature.geometry.coordinates[0][0][0][0]
        }}
      >
        <StandMarker name={feature.properties.name} />
      </Marker>
    ))
  );

  // Replace this function with the contents of _getVRNavigator() or _getARNavigator()
  // if you are building a specific type of experience.
  render() {
    const featuresArray = this.state.featuresArray;

    return (
      <View style={this.props.style}>
        <MapView
          ref={ref => {
            this.map = ref;
          }}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={this.state.region}
        >
          {this.createMarkersFromFeatures(featuresArray)}

          {/* Set Floorplan Polygons */
          /* TODO: replace floorplan with viroAppprop */}
          <Geojson
            geojson={floorplan}
            fillColor={"#6304c2"}
            strokeColor={"#555555"}
          />
          {/* Set User Marker */}
          {/* Get Marker Coordinates from viroAppProps */}
          <Marker
            coordinate={this.calcPostion(
              this.props.viroAppProps.currentMarkerCoordinates,
              {
                x: this.props.viroAppProps.position[0],
                y: -this.props.viroAppProps.position[2]
              }
            )}
            identifier="User"
            image={user}
            style={{ width: 25, height: 25 }}
          />
        </MapView>
      </View>
    );
  }

  typeFilter(type, data) {
    let features_new = data.features.filter(
      feature => feature.properties.type === type
    );
    let filtered = { ...floorplan, features: features_new };
    return filtered;
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  calcPostion(marker, position) {
    const ANGLE = -this.props.viroAppProps.heading / 180;
    //calculate postion regarding geographical north
    let x_geo = position.x * Math.cos(ANGLE) + position.y * Math.sin(ANGLE);
    let y_geo = position.y * Math.cos(ANGLE) - position.x * Math.sin(ANGLE);
    let delta_lat = (y_geo / 6) * 0.0001;
    let delta_long = (x_geo / 6) * 0.0001; //about 6 meter for 0.0001/ 0° 00′ 0.36″ longtitude
    return {
      latitude: marker.latitude + delta_lat,
      longitude: marker.longitude + delta_long
    };
    //return { latitude:LATITUDE_1+delta_lat, longitude:LONGITUDE_1+delta_long};
  }

  /* Fetch Floorplan Features from json which is stored in viroAppProps */
  async getFeatures() {
    try {
      let response = await fetch(this.props.viroAppProps.featuresmap);
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }
}

MapScene.propTypes = {
  provider: ProviderPropType,
  viroAppProps: {
    currentMarkerCoordinates: PropTypes.array,
    position: PropTypes.array,
    heading: PropTypes.any,
    featuresmap: PropTypes.any
  },
  style: PropTypes.any
};

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    width: 150,
    height: 150,
    borderRadius: 75
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  button: {
    width: 100,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent"
  },
  buttonText: {
    textAlign: "center"
  },
  text: {
    paddingTop: 30,
    paddingBottom: 20,
    color: "#fff",
    textAlign: "center",
    fontSize: 10
  }
});
module.exports = MapScene;
