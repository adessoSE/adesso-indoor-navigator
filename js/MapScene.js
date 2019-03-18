/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from 'react';
import {} from '../';
import PropTypes from 'prop-types';
import user from './res/user.png';
import {
  View,
  StyleSheet,
  Text,
  Image
} from 'react-native';
import Coordinate from './Coordinate';

const adessoOffices = {
  dortmund: {
    mapDimensions: {
      width: 550,
      height: 387,
      resizeBy: 0.25
    },
    width: 58,
    height: 39
  }
};

export let types = ['Zimmer', 'Toilette', 'Aufzug', 'Treppe', 'Platz', 'Technikhause']; //predefined types of romms

export const geojson_template = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: []
      }
    }
  ]
};

const userImageSize = 20, mapOffset = {top: 30, right: 30};

export default class MapScene extends Component {
  constructor() {
    super();

    this.state = {
      featuresArray: []
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

  render() {
    const currOffice = adessoOffices.dortmund;

    let usersPositionInMinimap = this.calcPixelInMapFromPositionRelativeToMarker({
      x: this.props.position[0],
      y: -this.props.position[2]
    }, this.props.currentMarker);

    const positionOfTopLeftMinimapCorner = {
      top: mapOffset.top - (userImageSize / 2),
      right: mapOffset.right - (userImageSize / 2) + currOffice.mapDimensions.width * currOffice.mapDimensions.resizeBy,
    };

    const positionInMinimap = {
      top: usersPositionInMinimap.y * currOffice.mapDimensions.resizeBy,
      left: usersPositionInMinimap.x * currOffice.mapDimensions.resizeBy
    };

    // TODO remove file from gitignore when image is fetched from database
    const mapImage = require('./res/dortmund_4.png');

    return (
      <View style={styles.container}>
        <Image
            source={mapImage}
            style={styles.map}
        />
        <Image
          source={user}
          style={{
            ...styles.user,
            top: positionOfTopLeftMinimapCorner.top + positionInMinimap.top,
            right: positionOfTopLeftMinimapCorner.right - positionInMinimap.left
          }}
        />
        {/* <Text style={{color: '#FFF', backgroundColor: 'rgba(0, 0, 0, .7)'}}>
          {JSON.stringify({
            marker: this.props.currentMarker,
            position: this.state.position,
            positionInMinimap,
          })}
        </Text> */}
      </View>
    );
  }

  calcPixelInMapFromPositionRelativeToMarker(positionRelativeToMarker, marker) {
    const office = adessoOffices.dortmund;
    
    const widthInMeters = office.width; // officeCorners.topLeft.distanceTo(officeCorners.topRight);
    const scaleFromMetersToPixels = office.mapDimensions.width / widthInMeters;

    const coordinateAsPixel = new Coordinate(positionRelativeToMarker)
      .rotateCounterClockwiseAroundOriginBy(marker.offset.rotation.y * Math.PI / 180)
      .moveBy({
        x: marker.offset.position.x,
        y: marker.offset.position.z
      })
      .scaleBy(scaleFromMetersToPixels);
    
    return coordinateAsPixel;
  }

  /* Fetch Floorplan Features from json which is stored in viroAppProps */
  async getFeatures() {
    try {
      let response = await fetch(this.props.featuresMap);
      return response.json();
    } catch (error) {
      console.error(error);
    }
  }
}

MapScene.propTypes = {
  featuresMap: PropTypes.string.isRequired,
  currentMarker: PropTypes.object,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  style: PropTypes.any
};

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 0
  },
  map: {
    width: adessoOffices.dortmund.mapDimensions.width / 4,
    height: adessoOffices.dortmund.mapDimensions.height / 4,
    top: mapOffset.top,
    right: mapOffset.right
  },
  user: {
    position: 'absolute',
    width: userImageSize,
    height: userImageSize,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: 'stretch'
  },
  button: {
    width: 100,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent'
  },
  buttonText: {
    textAlign: 'center'
  },
  text: {
    paddingTop: 30,
    paddingBottom: 20,
    color: '#fff',
    textAlign: 'center',
    fontSize: 10
  }
});
module.exports = MapScene;
