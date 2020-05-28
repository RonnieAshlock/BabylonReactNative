/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, FunctionComponent, useEffect, useCallback, useRef } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { EngineView, useEngine } from 'react-native-babylon';
import * as BABYLON from '@babylonjs/core';
import { NavBar } from "./components/NavBar";
import { TeachingMoment, TeachingMomentType } from "./components/TeachingMoment";
import { CameraButton } from "./components/CameraButton";
import "@babylonjs/loaders";

class DemoApp {
  private engine : BABYLON.Engine;
  scene : BABYLON.Scene | undefined;
  camera : BABYLON.ArcRotateCamera | undefined;
  model : BABYLON.AbstractMesh | undefined;
  placementIndicator : BABYLON.AbstractMesh | undefined;
  targetScale: number = .25;

  constructor(engine : BABYLON.Engine){
    this.engine = engine;
  }
  
  public initializeScene = async () => {
    const scene = new BABYLON.Scene(this.engine);
    this.scene = scene;
    this.scene.createDefaultCamera(true);
    this.camera = this.scene.activeCamera as BABYLON.ArcRotateCamera;

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 5, 0), this.scene);
    light.diffuse = BABYLON.Color3.White();
    light.intensity = 1;

    this.placementIndicator = BABYLON.Mesh.CreateTorus("placementIndicator", .3, .005, 64);
    var indicatorMat = new BABYLON.StandardMaterial('noLight', this.scene);
    indicatorMat.disableLighting = true;

    indicatorMat.emissiveColor = BABYLON.Color3.White();
    this.placementIndicator.material = indicatorMat;
    this.placementIndicator.scaling = new BABYLON.Vector3(1, 0.01, 1);
    this.placementIndicator.setEnabled(false);

    const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf");
    this.model = newModel.meshes[0];

    // Scale the distance by the size of the object
    const { min, max } = this.model.getHierarchyBoundingVectors(true, null);
    this.model.position = this.camera.position.add(this.camera.getForwardRay().direction.scale(2));
    this.model.scalingDeterminant = 0;

    // Set the target scale to cap the size of the model to .25 meters deep.
    this.targetScale = .3 / (max.z - min.z);
    this.model.position.y -= (this.targetScale * (max.y - min.y));

    this.camera.setTarget(this.model);
    this.camera.beta -= Math.PI / 8;

    var that = this;
    const startTime = Date.now();
    this.scene.beforeRender = function () {
      if (that.model){
        if (that.model.scalingDeterminant < that.targetScale) {
          const newScale = that.targetScale * (Date.now() - startTime) / 500;
          that.model.scalingDeterminant = newScale > that.targetScale ? that.targetScale: newScale;
        }
        
        that.model.rotate(BABYLON.Vector3.Up(), 0.005 * scene.getAnimationRatio());
      }
    };
  }

  public reset2D = () => {
    if (this.model && this.scene && this.camera) {
      this.model.setEnabled(true);

      this.model.position = this.camera.position.add(this.camera.getForwardRay().direction.scale(2));
      this.model.scalingDeterminant = 0;

      this.camera.setTarget(this.model);
      const startTime = Date.now();
      var that = this;
      this.scene.beforeRender = function () {
        if (that.model && that.scene) {
          if (that.model.scalingDeterminant < that.targetScale) {
            const newScale = that.targetScale * (Date.now() - startTime) / 500;
            that.model.scalingDeterminant = newScale > that.targetScale ? that.targetScale: newScale;
          }

          that.model.rotate(BABYLON.Vector3.Up(), 0.005 * that.scene.getAnimationRatio());
        }
      }; 
    }
  }
}

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
  const demoAppClass = useRef<DemoApp>();

  useEffect(() => {
    if (engine) {
      initializeScene();
      }
  }, [engine]);

  const initializeScene = async () => {
    if (engine) {
      demoAppClass.current = new DemoApp(engine);
      await demoAppClass.current.initializeScene();

      // Pull all of the member variables out into our useRefs.
      scene.current = demoAppClass.current.scene;
      setCamera(demoAppClass.current.camera);
      model.current = demoAppClass.current.model;
      placementIndicator.current = demoAppClass.current.placementIndicator;      
      targetScale.current = demoAppClass.current.targetScale;

      createInputHandling();
    }
  };

  const placeModel = useCallback(() => {
    if (xrSession.current && !modelPlaced.current && placementIndicator.current && model.current && scene.current) {
      setTeachingMomentVisible(false);
      modelPlaced.current = true;
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
        }
    };      
    }
  }, [scene.current, camera, model.current, xrSession.current, modelPlaced.current]);

  const createInputHandling = () => {
      if (engine && scene.current) {
        var numInputs = 0;
        if (!deviceSourceManager.current) { 
          deviceSourceManager.current = new BABYLON.DeviceSourceManager(engine);
        }

        deviceSourceManager.current.onAfterDeviceConnectedObservable.clear();
        deviceSourceManager.current.onAfterDeviceDisconnectedObservable.clear();

        deviceSourceManager.current.onAfterDeviceConnectedObservable.add(deviceEventData => {
          numInputs++;
          deviceSourceManager.current?.getDeviceSource(deviceEventData.deviceType, deviceEventData.deviceSlot)?.onInputChangedObservable.add(inputEventData => {
            if (inputEventData && model.current && modelPlaced.current && xrSession.current && inputEventData.previousState !== null && inputEventData.currentState !== null) {
              const diff = inputEventData.previousState - inputEventData.currentState;
              if (numInputs == 2 && inputEventData.inputIndex == BABYLON.PointerInput.Horizontal && deviceEventData.deviceSlot == 0) {
                  model.current.rotate(BABYLON.Vector3.Up(), diff / 200);
              }
              else if (numInputs == 1) {
                if (inputEventData.inputIndex == BABYLON.PointerInput.Horizontal)
                {
                  model.current.position.x -= diff / 1000;
                }
                else 
                {
                  model.current.position.z += diff / 750;
                }
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
        demoAppClass.current?.reset2D();
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
        demoAppClass.current?.reset2D();
      } else {
        if (model.current && scene.current && placementIndicator.current) {
          const xr = await scene.current.createDefaultXRExperienceAsync({ disableDefaultUI: true, disableTeleportation: true })
          // Set up the hit test.
          const xrHitTestModule = xr.baseExperience.featuresManager.enableFeature(
            BABYLON.WebXRFeatureName.HIT_TEST,
            "latest",
             {offsetRay: {origin: {x: 0, y: 0, z: 0}, direction: {x: 0, y: 0, z: -1}}}) as BABYLON.WebXRHitTest;

            xrHitTestModule.onHitTestResultObservable.add((results) => {
              if (results.length) {
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
