/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, FunctionComponent, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, StatusBar, Button, View, Text, ViewProps, StyleSheet } from 'react-native';

import { EngineView, useEngine } from '@babylonjs/react-native';
import * as BABYLON from '@babylonjs/core';
import { NavBar } from "./components/NavBar";
import { TeachingMoment, TeachingMomentType } from "./components/TeachingMoment";
import { CameraButton } from "./components/CameraButton";
import { sceneCookie, SampleScene } from './SampleScene';
import { WebXRAnchorSystem } from '@babylonjs/core';
import Slider from '@react-native-community/slider';

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [teachingMomentVisible, setTeachingMomentVisible] = useState(false);
  const [camera, setCamera] = useState<BABYLON.ArcRotateCamera>();
  const model = useRef<BABYLON.AbstractMesh>();
  const placementIndicator = useRef<BABYLON.AbstractMesh>();
  const scene = useRef<BABYLON.Scene>();
  const xrSession = useRef<BABYLON.WebXRSessionManager>();
  const deviceSourceManager = useRef<BABYLON.DeviceSourceManager>();
  const modelPlaced = useRef(false);
  const [showARControls, setShowARControls] = useState(false);
  const targetScale = useRef(.25);
  const sampleScene = useRef<SampleScene>();
  const sampleCookie = useRef<number>(sceneCookie);
  const anchor = useRef<any>();
  const anchorCreated = useRef<boolean>(false);

  useEffect(() => {
    if (engine) {
      initializeScene();
      }
  }, [engine, sampleCookie]);

  const initializeScene = async () => {
    if (engine) {
      sampleScene.current = new SampleScene(engine);
      await sampleScene.current.initializeSceneAsync();

      // Pull all of the member variables out into our useRefs.
      scene.current = sampleScene.current.scene;
      setCamera(sampleScene.current.camera);
      model.current = sampleScene.current.model;
      placementIndicator.current = sampleScene.current.placementIndicator;      
      targetScale.current = sampleScene.current.targetScale;

      createInputHandling();
    }
  };

  const placeModel = useCallback(() => {
    if (xrSession.current && !modelPlaced.current && placementIndicator.current && placementIndicator.current.isEnabled() && model.current && scene.current) {
      setTeachingMomentVisible(false);
      modelPlaced.current = true;
      model.current.rotationQuaternion = BABYLON.Quaternion.Identity();
      placementIndicator.current.setEnabled(false);
      model.current.setEnabled(true);
      model.current.position = placementIndicator.current.position.clone();
      const { min, max } = model.current.getHierarchyBoundingVectors(true, null);
      model.current.position.y += targetScale.current * (max.y - min.y) / 2;
      model.current.scalingDeterminant = 0;

      const startTime = Date.now();
      scene.current.beforeRender = function () {
        if (model.current && model.current.scalingDeterminant < targetScale.current) {
          const newScale = targetScale.current * (Date.now() - startTime) / 500;
          model.current.scalingDeterminant = newScale > targetScale.current ? targetScale.current: newScale;
          model.current.markAsDirty("scaling")
        }
    };      
    }
  }, [scene.current, camera, model.current, xrSession.current, modelPlaced.current]);

  const createInputHandling = () => {
      if (engine && scene.current) {
        if (!deviceSourceManager.current) { 
          deviceSourceManager.current = new BABYLON.DeviceSourceManager(engine);
        }

        deviceSourceManager.current.onAfterDeviceConnectedObservable.clear();
        deviceSourceManager.current.onAfterDeviceDisconnectedObservable.clear();

        var numInputs = 0;

        // Bind touch event.
        deviceSourceManager.current.onAfterDeviceConnectedObservable.add(deviceEventData => {
          numInputs++;

          // Identify the touch event ID that was just added, and bind to its update event.
          deviceSourceManager.current?.getDeviceSource(deviceEventData.deviceType, deviceEventData.deviceSlot)?.onInputChangedObservable.add(inputEventData => {
            if (inputEventData && model.current && modelPlaced.current && xrSession.current && inputEventData.previousState !== null && inputEventData.currentState !== null) {
              // Calculate the differential between two states.
              const diff = inputEventData.previousState - inputEventData.currentState;
              
              // Single input, do translation.
              if (numInputs == 1) {
                if (inputEventData.inputIndex == BABYLON.PointerInput.Horizontal)
                {
                  model.current.position.x -= diff / 1000;
                }
                else 
                {
                  model.current.position.z += diff / 750;
                }
              }
              // Multi-input do rotation.
              else if (numInputs == 2 && inputEventData.inputIndex == BABYLON.PointerInput.Horizontal && deviceEventData.deviceSlot == 0) {
                model.current.rotate(BABYLON.Vector3.Up(), diff / 200);
              }
            }
          });

        placeModel(); 
        });

      deviceSourceManager.current.onAfterDeviceDisconnectedObservable.add(deviceEventData => {
        numInputs--;
      })
    }
  };

  const resetClick = useCallback(() => {
    setTeachingMomentVisible(false);
    if (model.current && camera && scene.current && placementIndicator.current) {
      if (xrSession.current)
      {
        modelPlaced.current = false;
        model.current.setEnabled(false);
        placementIndicator.current.setEnabled(true);
      }
      else
      {
        placementIndicator.current?.setEnabled(false);
        sampleScene.current?.reset2D();
      }
    }
  }, [model.current, camera, scene.current, xrSession.current]);

  const styles = StyleSheet.create({
    arView: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    teachingMomentView: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    placementBarContainer: {
      position: 'absolute', minHeight: 50, margin: 10, left: 0, right: 0, bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    cameraButton: {
        height: 60,
        width: 60,
        marginVertical: 8
    }
});

  const onToggleXr = useCallback(() => {
    (async () => {
      if (xrSession.current) {
        model.current?.setEnabled(false);
        placementIndicator.current?.setEnabled(false);

        await xrSession.current.exitXRAsync();
        
        xrSession.current = undefined;
        modelPlaced.current = true;
        setTeachingMomentVisible(false);
        setShowARControls(false);
        sampleScene.current?.reset2D();
      } else {
        if (model.current && scene.current && placementIndicator.current) {
          const xr = await scene.current.createDefaultXRExperienceAsync({ disableDefaultUI: true, disableTeleportation: true })
          // Set up the hit test.
          const xrHitTestModule = xr.baseExperience.featuresManager.enableFeature(
            BABYLON.WebXRFeatureName.HIT_TEST,
            "latest",
             {offsetRay: {origin: {x: 0, y: 0, z: 0}, direction: {x: 0, y: 0, z: -1}}}) as BABYLON.WebXRHitTest;

          const xrAnchorModule = xr.baseExperience.featuresManager.enableFeature(
              BABYLON.WebXRFeatureName.ANCHOR_SYSTEM,
              "latest") as WebXRAnchorSystem;

          xrAnchorModule.onAnchorAddedObservable.add(anchor => {
            anchor.attachedNode = model.current.clone("modelClone");
            anchor.attachedNode?.setEnabled(true);
            console.log("anchor atttached.");
          });
          xrAnchorModule.onAnchorRemovedObservable.add(anchor => {
            console.log("anchor detached.");
          });

          xrHitTestModule.onHitTestResultObservable.add((results) => {
            if (results.length) {
              if (!anchor.current && !anchorCreated.current)
              {
                /*anchorCreated.current = true;
                xrAnchorModule.addAnchorAtPositionAndRotationAsync(results[0].position, results[0].rotationQuaternion).then((webXRAnchor : XRAnchor) => {
                  console.log("attached anchor");
                  anchor.current = webXRAnchor
                 });*/

                /*xrAnchorModule.addAnchorPointUsingHitTestResultAsync(results[0]).then((webXRAnchor : XRAnchor) => {
                    console.log("attached anchor");
                    anchor.current = webXRAnchor
                  });*/
              }

              if (!modelPlaced.current) {
                  setTeachingMomentVisible(true);
                placementIndicator.current?.setEnabled(true);
              }
              else {
                placementIndicator.current?.setEnabled(false);
              }
              
              if (placementIndicator.current) {
                placementIndicator.current.position = results[0].position;
              }
            }
          });

          const session = await xr.baseExperience.enterXRAsync("immersive-ar", "unbounded", xr.renderTarget);

          setShowARControls(false);
          model.current.setEnabled(false);
          modelPlaced.current = false;
          xrSession.current = session;
          model.current.rotate(BABYLON.Vector3.Up(), 3.14159);
        }
      }
    })();
  }, [scene.current, model.current, xrSession.current]);

  return (
    <>
      <View style={props.style}>
        <NavBar resetClickHandler={resetClick} backClickHandler={onToggleXr} />
        <View style={{flex: 1}}>
          <EngineView style={props.style} camera={camera} displayFrameRate={false} />
          { teachingMomentVisible &&
            <View style={styles.teachingMomentView}>
                <TeachingMoment teachingMomentType={TeachingMomentType.tapToPlace} />
            </View>
          }
          { showARControls && 
            <View style={styles.placementBarContainer}>
              <CameraButton style={styles.cameraButton} cameraClickHandler={placeModel} />
            </View>
          }
        </View>
      </View>
    </>
  );
};

const App = () => {
  return (
    <>
        <EngineScreen style={{flex: 1, zIndex: 0}} />
    </>
  );
};

export default App;
console.disableYellowBox = true;