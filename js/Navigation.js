import React from 'react';
import { StyleSheet } from 'react-native';

import {
  ViroARScene,
  ViroImage,
  ViroQuad,
  ViroNode,
  ViroMaterials,
  ViroOmniLight,
  ViroARTrackingTargets,
  ViroARImageMarker,
  ViroAnimations,
  Viro3DObject,
  ViroSpotLight,
  ViroAmbientLight,
  ViroSphere,
  ViroText
} from 'react-viro';
import PropTypes from 'prop-types';

var createReactClass = require('create-react-class');
var markerID = 0;
var markerPosSet = false;
var DestinationObj;
var Camera;
var markers = null;
var TargetObjects = null;

var styles = StyleSheet.create({
  hud_text: {
    fontSize: 20,
    fontFamily: 'Roboto, Helvetica',
    fontWeight: '700',
    color: '#0275d8',
    flex: 1
  }
});

var Navigation = createReactClass({
  propTypes: () => ({
    arSceneNavigator: {
      viroAppProps: {
        markers: PropTypes.array,
        showPointCloud: PropTypes.bool,
        pauseUpdates: PropTypes.bool,
        destination: PropTypes.any,
        destinationLocation: PropTypes.any,
        _getListData: PropTypes.func,
        onMarkerDetected: PropTypes.func,
        setNewCameraPosition: PropTypes.func,
        setDistanceAndIndicatorDirections: PropTypes.func,
        setNewMarkerPosition: PropTypes.func,
        changeHitPos: PropTypes.func
      }
    }
  }),

  getInitialState: function() {
    return {
      detection: 0,
      loadMarker: false
    };
  },

  componentDidMount() {},

  componentDidUpdate() {
    if (
      !this.state.loadMarker &&
      this.props.arSceneNavigator.viroAppProps.markers !== null
    ) {
      markers = this.props.arSceneNavigator.viroAppProps.markers;
      console.log("Creating Targets");
      createTargets()
        .then(this.setState({ loadMarker: true }))
        .catch(err => console.log(err));
    }
  },

  createLightsAndGround: () => (
    <ViroNode>
      <ViroOmniLight
        intensity={300}
        position={[-10, 10, 1]}
        color={'#FFFFFF'}
        attenuationStartDistance={20}
        attenuationEndDistance={30}
      />

      <ViroOmniLight
        intensity={300}
        position={[10, 10, 1]}
        color={'#FFFFFF'}
        attenuationStartDistance={20}
        attenuationEndDistance={30}
      />

      <ViroOmniLight
        intensity={300}
        position={[-10, -10, 1]}
        color={'#FFFFFF'}
        attenuationStartDistance={20}
        attenuationEndDistance={30}
      />

      <ViroOmniLight
        intensity={300}
        position={[10, -10, 1]}
        color={'#FFFFFF'}
        attenuationStartDistance={20}
        attenuationEndDistance={30}
      />

      <ViroSpotLight
        position={[0, 8, -2]}
        color='#ffffff'
        direction={[0, -1, 0]}
        intensity={50}
        attenuationStartDistance={5}
        attenuationEndDistance={10}
        innerAngle={5}
        outerAngle={20}
        castsShadow={true}
      />

      <ViroQuad
        rotation={[-90, 0, 0]}
        position={[0, -1.6, 0]}
        width={5}
        height={5}
        arShadowReceiver={true}
      />
    </ViroNode>
  ),

  render() {
    return (
      <ViroARScene
        ref='arscene'
        numberOfTrackedImages={0}
        onCameraTransformUpdate={this._getCamera}
        onTrackingUpdated={this._trackingUpdated}
        displayPointCloud={
          this.props.arSceneNavigator.viroAppProps.showPointCloud || this.refs["positionDebugger"]
        }
      >
        <ViroAmbientLight color='#ffffff' intensity={200} />
        {/* Start ImageMarker */}
        {/* Generate ImageMarker based on Firebase Data */}
        {this.state.loadMarker && TargetObjects !== null ? (
          <ViroNode>{this._createARImageMarker()}</ViroNode>
        ) : null}
        {/* End ImageMarker */}

        {this.createLightsAndGround()}
      </ViroARScene>
    );
  },

  // ────────────────────────────────────────────────────────────────────────────────

  _createARImageMarker() {
    return markers.map(marker => {
      let markerRotation = [marker.offset.rotation.x, marker.offset.rotation.y, marker.offset.rotation.z];

      return (
        <ViroARImageMarker
          target={marker.id}
          onAnchorFound={this._onAnchorFound.bind(this, marker.id, marker.location)}
          onAnchorUpdated={this._onAnchorUpdated.bind(this, marker.id, marker.location)}
          pauseUpdates={this.props.arSceneNavigator.viroAppProps.pauseUpdates}
          key={marker.id}
        >
          {/* Get position and scale from DB */}
          {this._createNavigationOriginAndDestination(
            marker.id,
            [marker.offset.position.x, marker.offset.position.y, marker.offset.position.z],
            markerRotation
          )}
        </ViroARImageMarker>
      );
    });
  },

  _createNavigationOriginAndDestination(id, position, rotation) {
    let { destinationName, destinationLocation } = this.props.arSceneNavigator.viroAppProps;

    if (id === markerID && destinationName !== 'none') {
      return (
        <ViroNode ref='poi' visible={id === markerID}>
          <ViroImage
            height={0.3}
            width={0.3}
            position={[0, 0, 0.15]}
            rotation={[-90, 0, 0]}
            source={require('./res/adesso_logo.png')}
          />
          {/* <ViroNode position={position} rotation={rotation} scale={[1, 1, 1]}> */}
          <ViroNode scale={[1, 1, 1]} rotation={rotation}>
            {/* Picture on Marker to check accuracy */}
            {/* Set POI from viroAppProps */}
            <ViroNode position={this._subtract([0, 0, 0], position)} scale={[1, 1, 1]}>
              {this._set3DPOI(destinationName, destinationLocation.position, destinationLocation.scale)}
            </ViroNode>
          </ViroNode>
        </ViroNode>
      );
    } else {
      return null;
    }
  },

  _set3DPOI(name, position, scale) {
    return (
      <ViroNode
        position={Object.values(position)}
        scale={Object.values(scale)}
      >
        <ViroText
          style={styles.hud_text}
          transformBehaviors={'billboardY'}
          text={name}
          textAlign={'center'}
          rotation={[-90, 0, 0]}
          width={1.25}
          position={[0, 0, 0]}
        />

        {/* Arrow points to -x by default */}
        <Viro3DObject
          onLoadEnd={this._onModelLoad}
          source={require('./res/arrow/model.obj')}
          resources={[require('./res/arrow/materials.mtl')]}
          rotation={[0, 90, 90]}
          type='OBJ'
          onDrag={this.refs["positionDebugger"] ? () => {
            /* Make Debugger Model Moveable and Update its Position */
            this.refs["positionDebugger"].getTransformAsync().then(transform => {
              this.props.arSceneNavigator.viroAppProps.changeHitPos(transform.position);
            })
          }: undefined}
          ref={name}
        />
      </ViroNode>
    );
  },

  //
  // ─── ARIMAGEMARKER ONFOUND AND ONUPDATE FUNCTIONS ───────────────────────────────
  //
  /* On Anchor Found */
  _onAnchorFound(name, location) {
    markerID = name;
    this.props.arSceneNavigator.viroAppProps._getListData(location);
    this.props.arSceneNavigator.viroAppProps.onMarkerDetected(name);
  },

  /* On Anchor Updated */
  _onAnchorUpdated(name) {
    markerID = name;
    this._getDestinationObject();
    this.props.arSceneNavigator.viroAppProps.onMarkerDetected(name);
    markerPosSet = false;
  },

  // ────────────────────────────────────────────────────────────────────────────────

  _getCamera() {
    //console.log('Getting Camera');
    this._getDestinationObject(
      this.props.arSceneNavigator.viroAppProps.destinationName
    );
    /* Get Camera Object */
    this.refs['arscene'].getCameraOrientationAsync().then(orientation => {
      Camera = orientation;
    });
    /*Get Camera Position and update relative position to marker*/
    if (Camera) {
      this.props.arSceneNavigator.viroAppProps.setNewCameraPosition(
        Camera.position
      );
      if (markerID !== 0 && !markerPosSet && Camera.position) {
        markerPosSet = true;
        this.props.arSceneNavigator.viroAppProps.setNewMarkerPosition(
          Camera.position
        );
      }
    }

    /* Send Distance to RN App */
    if (Camera && DestinationObj) {
      this.props.arSceneNavigator.viroAppProps.setDistanceAndIndicatorDirections(
        Math.round(
          this._distance(Camera.position, DestinationObj.position) * 100
        ) / 100,
        this._indicator()
      );
    }
  },

  _getDestinationObject(ref) {
    if (this.refs[ref]) {
      this.refs[ref].getTransformAsync().then(transform => {
        DestinationObj = transform;
      });
    }
  },

  _onModelLoad() {
    setTimeout(() => {
      console.log("On Model load");
      this.setState({});
    }, 3000);
  },

  // Calculate distance between two vectors
  _distance(vectorOne, vectorTwo) {
    var distance = Math.sqrt(
      (vectorTwo[0] - vectorOne[0]) * (vectorTwo[0] - vectorOne[0]) +
        (vectorTwo[1] - vectorOne[1]) * (vectorTwo[1] - vectorOne[1]) +
        (vectorTwo[2] - vectorOne[2]) * (vectorTwo[2] - vectorOne[2])
    );
    return distance;
  },

  _normalize(vec) {
    const length = Math.sqrt(
      Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2)
    );
    let [x, y, z] = vec;
    const normalized = [x / length, y / length, z / length];
    return normalized;
  },

  _subtract(v1, v2) {
    const [x1, y1, z1] = v1;
    const [x2, y2, z2] = v2;
    let vec = [x1 - x2, y1 - y2, z1 - z2];
    // Same result with mathJS
    return vec;
  },

  /* Returns an array of which indicator should be shown  */
  /* //FIXME: Position mitbeachten */
  _indicator() {
    const xVec =
      (DestinationObj.position[0] - Camera.position[0]) / Camera.forward[0];
    const zVec =
      (DestinationObj.position[2] - Camera.position[2]) / Camera.forward[2];
    const isVisible = Math.abs(xVec - zVec) > 1.25;
    /* Camera Forward - Obj Position */
    const vec = this._subtract(
      Camera.forward,
      this._normalize(DestinationObj.position)
    );
    /* Camera Position - Obj Position */
    const posvec = this._subtract(
      this._normalize(Camera.position),
      this._normalize(DestinationObj.position)
    );
    let result = [];
    if (isVisible) {
      /* Left or Right */
      if (vec[0] < -0.3) {
        result.push('right');

        if (posvec[0] > 0) {
          result.pop();
          result.push('left');
        }
      } else if (vec[0] > 0.3) {
        result.push('left');

        if (posvec[0] < 0) {
          result.pop();
          result.push('right');
        }
      }

      /* Top or Bottom */
      if (vec[1] < -0.3) {
        result.push('top');
      } else if (vec[1] > 0.3) {
        result.push('bottom');
      }
    }

    return result;
  }
});

//
// ─── CREATE TARGETS ─────────────────────────────────────────────────────────────
//

async function createTargets() {
  let targetObject = {};

  markers.forEach(marker => {
    let targetname = marker.location + '' + marker.nr;
    targetObject[targetname] = {
      source: {
        uri: marker.url
      },
      physicalWidth: marker.width,
      orientation: 'Up'
    };

    if(marker.url[0] === "_"){
      console.log("Using offline marker");
      targetObject[targetname].source = require(`./res/marker_small.png`);
    }
  });

  /* Create Targets from object */
  ViroARTrackingTargets.createTargets(targetObject);
  TargetObjects = targetObject;

  if (Object.keys(targetObject).length === markers.length) {
    return;
  } else {
    throw new Error('Error while creating Targets');
  }
}

ViroAnimations.registerAnimations({
  scaleModel: {
    properties: { scaleX: 1, scaleY: 1, scaleZ: 1 },
    duration: 3000
  }
});

ViroMaterials.createMaterials({
  grid: {
    diffuseTexture: require('./res/grid_bg.jpg')
  }
});

module.exports = Navigation;
