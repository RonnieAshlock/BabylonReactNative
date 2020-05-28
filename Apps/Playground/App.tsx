/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, FunctionComponent, useEffect, useCallback, useRef } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { EngineView, useEngine } from 'react-native-babylon';
import { DeviceSourceManager, DeviceType, PointerInput, PBRMetallicRoughnessMaterial, Color3, Scene, Vector3, Mesh, AbstractMesh, ArcRotateCamera, WebXRSessionManager, WebXRFeatureName, WebXRHitTest, SceneLoader} from '@babylonjs/core';
import { NavBar } from "./components/NavBar";
import { TeachingMoment, TeachingMomentType } from "./components/TeachingMoment";
import { CameraButton } from "./components/CameraButton";
import "@babylonjs/loaders";

const EngineScreen: FunctionComponent<ViewProps> = (props: ViewProps) => {
  const engine = useEngine();
  const [teachingMomentVisible, setTeachingMomentVisible] = useState(false);
  const [camera, setCamera] = useState<ArcRotateCamera>();
  const model = useRef<AbstractMesh>();
  const placementIndicator = useRef<AbstractMesh>();
  const scene = useRef<Scene>();
  const xrSession = useRef<WebXRSessionManager>();
  const cameraInitialPosition = useRef<Vector3>(Vector3.Zero());
  const deviceSourceManager = useRef<DeviceSourceManager>();
  const modelPlaced = useRef(false);
  const [showARControls, setShowARControls] = useState(false);
  const targetScale = useRef(.25);
  const numInputs = useRef(0);

  useEffect(() => {
    if (engine) {
      initializeScene();
      }
  }, [engine]);

  const initializeScene = useCallback(async () => {
    if (engine) {
      scene.current = new Scene(engine);
      scene.current.createDefaultCamera(true);
      const arcRotateCam = scene.current.activeCamera as ArcRotateCamera;
      setCamera(arcRotateCam);
      cameraInitialPosition.current = arcRotateCam.position.clone();
      scene.current.createDefaultLight(true);
      createInputHandling();

      placementIndicator.current = Mesh.CreateTorus("placementIndicator", .3, .005, 64);
      placementIndicator.current.scaling = new Vector3(1, 0.01, 1);
      placementIndicator.current.setEnabled(false);

      try {
      const newModel = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf");
      //const newModel = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf");
      model.current = newModel.meshes[0];

      // Scale the distance by the size of the object
      const { min, max } = model.current.getHierarchyBoundingVectors(true, null);

      model.current.position = arcRotateCam.position.add(arcRotateCam.getForwardRay().direction.scale(2));
      model.current.scalingDeterminant = 0;

      // Set the target scale to cap the size of the model to .25 meters deep.
      targetScale.current = .25 / (max.z - min.z);
      model.current.position.y -= (targetScale.current * (max.y - min.y));

      arcRotateCam.setTarget(model.current);
      arcRotateCam.beta -= Math.PI / 8;

      const startTime = Date.now();
      scene.current.beforeRender = function () {
        if (model.current && scene.current) {
          if (model.current.scalingDeterminant < targetScale.current) {
            const newScale = targetScale.current * (Date.now() - startTime) / 500;
            model.current.scalingDeterminant = newScale > targetScale.current ? targetScale.current: newScale;
          }
          
          model.current.rotate(Vector3.Up(), 0.005 * scene.current.getAnimationRatio());
        }
      };
    }
    catch (ex) { console.error (ex); }
  }
  }, [engine]);

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

  const createInputHandling = useCallback(() => {
      if (engine && scene.current) {
        deviceSourceManager.current = new DeviceSourceManager(engine);
        deviceSourceManager.current.onAfterDeviceConnectedObservable.add(deviceEventData => {
          numInputs.current++;
          deviceSourceManager.current?.getDeviceSource(deviceEventData.deviceType, deviceEventData.deviceSlot)?.onInputChangedObservable.add(inputEventData => {
            if (inputEventData && model.current && modelPlaced.current && xrSession.current && inputEventData.previousState !== null && inputEventData.currentState !== null) {
              const diff = inputEventData.previousState - inputEventData.currentState;
              if (numInputs.current >= 2 && inputEventData.inputIndex == PointerInput.Horizontal && deviceEventData.deviceSlot == 0) {
                if (Math.abs(diff) > 2) {
                  model.current.rotate(Vector3.Up(), diff / 400);
                }
              }
              else if (numInputs.current == 1) {
                if (inputEventData.inputIndex == PointerInput.Horizontal)
                {
                  model.current.position.x -= diff / 1250;
                }
                else 
                {
                  model.current.position.z += diff / 1250;
                }
              }
            }
          });
 
         placeModel(); 
        });

      deviceSourceManager.current.onAfterDeviceDisconnectedObservable.add(deviceEventData => {
        numInputs.current--;
      })
    }
  }, [engine, scene.current, camera, model.current, xrSession.current]);

  const reset2D = useCallback( () =>{
    if (model.current && scene.current && camera) {
      model.current.setEnabled(true);
      placementIndicator.current?.setEnabled(false);

      model.current.position = camera.position.add(camera.getForwardRay().direction.scale(2));
      model.current.scalingDeterminant = 0;

      camera.setTarget(model.current);
      const startTime = Date.now();
      scene.current.beforeRender = function () {
        if (model.current && scene.current) {
          if (model.current.scalingDeterminant < targetScale.current) {
            const newScale = targetScale.current * (Date.now() - startTime) / 500;
            model.current.scalingDeterminant = newScale > targetScale.current ? targetScale.current: newScale;
          }

          model.current.rotate(Vector3.Up(), 0.005 * scene.current.getAnimationRatio());
        }
      }; 
    }
  }, [model.current, camera, scene.current]);

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
        reset2D();
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
        reset2D();
      } else {
        if (model.current && scene.current && placementIndicator.current) {
          const xr = await scene.current.createDefaultXRExperienceAsync({ disableDefaultUI: true, disableTeleportation: true })
          // Set up the hit test.
          const xrHitTestModule = xr.baseExperience.featuresManager.enableFeature(
            WebXRFeatureName.HIT_TEST,
            "latest",
             {offsetRay: {origin: {x: 0, y: 0, z: 0}, direction: {x: 0, y: 0, z: -1}}}) as WebXRHitTest;

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
          model.current.rotate(Vector3.Up(), 3.14159);
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
