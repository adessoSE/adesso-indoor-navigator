import React, { Component } from 'react';

import {
  ViroARScene,
  ViroAmbientLight,
  ViroARPlane,
  ViroMaterials,
  ViroNode,
  ViroUtils,
  ViroSurface,
  ViroSpotLight,
  Viro3DObject,
  ViroAnimations,
} from 'react-viro';

import TimerMixin from 'react-timer-mixin';
import PropTypes from 'prop-types';

var createReactClass = require('create-react-class');

var ARHitTestSample = createReactClass({
  mixins: [TimerMixin],

  getInitialState: () => ({
      objPosition: [0, 0, 0],
      scale:[0.2, 0.2, 0.2],
      rotation:[0, 0, 0],
      shouldBillboard : true,
  }),

  render: () => (
    <ViroARScene ref={(node) => { this.arScene = node; }} onTrackingInitialized={this._onTrackInit}>
        <ViroAmbientLight color="#ffffff" intensity={200}/>
        {this._getModel()}
    </ViroARScene>
  ),

  _createNode: (transformBehaviors) => (
    <ViroNode
      {...transformBehaviors}
      visible={this.props.arSceneNavigator.viroAppProps.displayObject}
      position={this.state.objPosition}
      onDrag={() => {}}
      ref={this._setARNodeRef}
      scale={this.state.scale}
      rotation={this.state.rotation}
      dragType="FixedToWorld" key={this.props.arSceneNavigator.viroAppProps.displayObjectName}
    >
      <ViroSpotLight
        innerAngle={5}
        outerAngle={20}
        direction={[0, -1, 0]}
        position={[0, 4, 0]}
        color="#ffffff"
        castsShadow={true}
        shadowNearZ={0.1}
        shadowFarZ={6}
        shadowOpacity={0.9}
        ref={this._setSpotLightRef}/>

      <Viro3DObject
        position={[0, this.props.arSceneNavigator.viroAppProps.yOffset, 0]}
        source={this.props.arSceneNavigator.viroAppProps.objectSource}
        type = "VRX" onLoadEnd={this._onLoadEnd} onLoadStart={this._onLoadStart}
        onRotate={this._onRotate}
        onPinch={this._onPinch} />

      <ViroSurface
        rotation={[-90, 0, 0]}
        position={[0, -0.001, 0]}
        width={2.5} height={2.5}
        arShadowReceiver={true}
        ignoreEventHandling={true} />
    </ViroNode>
  ),

  _getModel: () => {
    let modelArray;

    if (
      this.props.arSceneNavigator.viroAppProps.displayObject &&
      this.props.arSceneNavigator.viroAppProps.displayObjectName !== undefined
    ) {
      let transformBehaviors = {};

      if (this.state.shouldBillboard) {
        transformBehaviors.transformBehaviors = "billboardY";
      }

      modelArray = [this._createNode(transformBehaviors)];
    }

    return modelArray;
  },

  _setARNodeRef(component) {
    this.arNodeRef = component;
  },

  _setSpotLightRef(component) {
    this.spotLight = component;
  },

  _onTrackInit() {
    this.props.arSceneNavigator.viroAppProps._onTrackingInit();
  },


  /*
   Rotation should be relative to its current rotation *not* set to the absolute
   value of the given rotationFactor.
   */
  _onRotate(rotateState, rotationFactor) {
    if (rotateState == 3) {
      this.setState({
        rotation : [this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]
      });
    } else {
      this.arNodeRef.setNativeProps({
        rotation:[
          this.state.rotation[0],
          this.state.rotation[1] + rotationFactor,
          this.state.rotation[2]
        ]
      });
    }
  },

  /*
   Pinch scaling should be relative to its last value *not* the absolute value of the
   scale factor. So while the pinching is ongoing set scale through setNativeProps
   and multiply the state by that factor. At the end of a pinch event, set the state
   to the final value and store it in state.
   */
  _onPinch(pinchState, scaleFactor) {
    var newScale = this.state.scale.map(x => x * scaleFactor);

    if (pinchState == 3) {
      this.setState({
        scale : newScale
      });
    } else {
      this.arNodeRef.setNativeProps({ scale: newScale });
      this.spotLight.setNativeProps({ shadowFarZ: 6 * newScale[0] });
    }
  },

  _onLoadStart() {
    this.setState({
      shouldBillboard : true,
    });
    this.props.arSceneNavigator.viroAppProps._onLoadStart();
  },

  // Perform a hit test on load end to display object.
  _onLoadEnd() {
    this.arScene.getCameraOrientationAsync().then((orientation) => {
      this.arScene.performARHitTestWithRay(orientation.forward).then((results) => {
          this._onArHitTestResults(orientation.position, orientation.forward, results);
      });
    });
    this.props.arSceneNavigator.viroAppProps._onLoadEnd();
  },

  _onArHitTestResults(position, forward, results) {
    // Default position is just 1.5 meters in front of the user.
    let newPosition = [forward[0] * 1.5, forward[1]* 1.5, forward[2]* 1.5];
    let hitResultPosition = undefined;

    // Filter the hit test results based on the position.
    for (let i = 0, hitFound = false; i < results.length && !hitFound; i++) {
      let result = results[i];
      
      if (result.type == "ExistingPlaneUsingExtent") {
        const distanceToPosition = this._distance(position, result.transform.position);
        
        // If we found a plane more than .2 and less than 10 meters away then choose it!
        if(distanceToPosition > 0.2 && distanceToPosition < 10) {
          hitResultPosition = result.transform.position;
          hitFound = true;
        }
      } else if (result.type == "FeaturePoint" && !hitResultPosition) {
        // If we haven't found a plane and this feature point is within range, then we'll use it
        // as the initial display point.
        const distanceToPosition = this._distance(position, result.transform.position);
        if (distanceToPosition > 0.2  && distanceToPosition < 10) {
          hitResultPosition = result.transform.position;
        }
      }
    }

    //TODO: does this purposely cover falsey values other than its initial value (undefined)?
    if (hitResultPosition) {
      newPosition = hitResultPosition;
    }

    // Set the initial placement of the object using new position from the hit test.
    this._setInitialPlacement(newPosition);
  },

  _setInitialPlacement(position) {
    this.setState({
        objPosition: position,
    });
    this.setTimeout(this._updateInitialRotation, 200);
  },

  // Update the rotation of the object to face the user after it's positioned.
  _updateInitialRotation() {
    this.arNodeRef.getTransformAsync().then((retDict) => {
       const rotation = retDict.rotation;
       const absX = Math.abs(rotation[0]);
       const absZ = Math.abs(rotation[2]);

       let yRotation = rotation[1];

       //TODO: Should the not be 0 or should they not be 1?!?!?!
       // If the X and Z aren't 0, then adjust the y rotation.
       if (absX > 1 && absZ > 1) {
         yRotation = 180 - yRotation;
       }

       this.setState({
         rotation: [0, yRotation, 0],
         shouldBillboard: false,
       });
     });
  },

  // Calculate distance between two vectors
  _distance(vectorOne, vectorTwo) {
    if(!Array.isArray(vectorOne) || !Array.isArray(vectorTwo) || vectorOne.length !== 3 || vectorTwo.length !== 3) {
      console.error('Wrong input! Expected two number[3], instead got', vectorOne, 'and', vectorTwo);
    }

    //square root of the sum of the distances squared
    return Math.sqrt(vectorOne.reduce((sum, coord1, index) => sum + Math.pow(vectorTwo[index] - coord1, 2), 0));
  }
});

module.exports = ARHitTestSample;