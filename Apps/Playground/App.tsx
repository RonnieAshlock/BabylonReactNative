/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, FunctionComponent, useEffect, useCallback, useRef } from 'react';
import { Button, View, Text, ViewProps, StyleSheet } from 'react-native';

import { EngineView, useEngine } from 'react-native-babylon';
import { DeviceSourceManager, DeviceType, Scene, Vector3, Mesh, AbstractMesh, ArcRotateCamera, Camera, PBRMetallicRoughnessMaterial, Color3, TargetCamera, WebXRSessionManager, WebXRFeaturesManager, WebXRFeatureName, WebXRHitTest, FreeCamera, SceneLoader, PointerEventTypes } from '@babylonjs/core';
import { NavBar } from "./components/NavBar";
import { TeachingMoment, TeachingMomentType } from "./components/TeachingMoment";
import { CameraButton } from "./components/CameraButton";

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


  const placeModel = useCallback(() => {
    setTeachingMomentVisible(false);

    if (xrSession.current && model.current && camera && scene.current && placementIndicator.current) {
      modelPlaced.current = true;
      placementIndicator.current.setEnabled(false);
      model.current.setEnabled(true);
      model.current.position = placementIndicator.current.position.clone();
      model.current.position.y += .15;
      model.current.scalingDeterminant = 0;

      camera.setTarget(model.current);
      const startTime = Date.now();
      scene.current.beforeRender = function () {
        if (model.current && model.current.scalingDeterminant < 1) {
          const newScale = (Date.now() - startTime) / 500;
          model.current.scalingDeterminant = newScale > 1 ? 1: newScale;
        }
      };      
    }
  }, [scene.current, camera, model.current, xrSession.current]);

  const createInputHandling = useCallback(() => {
    try
    {
      if (engine && scene.current) {
        deviceSourceManager.current = new DeviceSourceManager(engine);
        scene.current.beforeRender = function() {
          const sources = deviceSourceManager.current?.getDeviceSources(DeviceType.Touch);
          console.error(sources);
          if (sources !== undefined)
          {
            console.error(sources);
          }
        }

        deviceSourceManager.current.onAfterDeviceConnectedObservable.add(deviceEventData => {
        });
    }
  }
  catch (ex)
  {
    console.error(ex);
  }
  }, [engine, scene.current, camera, model.current, xrSession.current]);

  const initializeScene = useCallback(async () => {
    try {
    if (engine) {
      scene.current = new Scene(engine);
      scene.current.createDefaultCamera(true);
      const arcRotateCam = scene.current.activeCamera as ArcRotateCamera;
      setCamera(arcRotateCam);
      cameraInitialPosition.current = arcRotateCam.position.clone();
      scene.current.createDefaultLight(true);
      createInputHandling();

      /*try {
        const model = await SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf");
        setTeachingMomentVisible(true);
        model.meshes[0].position = arcCamera.position.add(arcCamera.getForwardRay().direction.scale(5));
        model.meshes[0].position.y -= 6;
        model.meshes[0].scalingDeterminant = 1.5;
        model.meshes[0].rotate(Vector3.Up(), 3.14159);

        const box = model.meshes[0];
        setBox(box);
        arcCamera.setTarget(box);
        arcCamera.beta -= Math.PI / 8;

        scene.beforeRender = function () {
          box.rotate(Vector3.Up(), 0.005 * scene.getAnimationRatio());
        }
      }
      catch (ex)
      {
        console.error(ex);
      }*/

      model.current = Mesh.CreateBox("box", 0.3, scene.current);
      model.current.position = arcRotateCam.position.add(arcRotateCam.getForwardRay().direction);

      const mat = new PBRMetallicRoughnessMaterial("mat", scene.current);
      mat.metallic = 1;
      mat.roughness = 0.5;
      mat.baseColor = Color3.Red();
      model.current.material = mat;

      model.current.scalingDeterminant = 0;

      placementIndicator.current = Mesh.CreateTorus("placementIndicator", .3, .01, 32);
      placementIndicator.current.scaling = new Vector3(1, 0.01, 1);
      placementIndicator.current.setEnabled(false);

      arcRotateCam.setTarget(model.current);
      arcRotateCam.beta -= Math.PI / 8;

      const startTime = Date.now();
      scene.current.beforeRender = function () {
        if (model.current && scene.current) {
          if (model.current.scalingDeterminant < 1) {
            const newScale = (Date.now() - startTime) / 500;
            model.current.scalingDeterminant = newScale > 1 ? 1: newScale;
          }
          
          model.current.rotate(Vector3.Up(), 0.005 * scene.current.getAnimationRatio());
        }
      };
    }
  }
  catch (ex)
  {
    console.error(ex);
  }
  }, [engine]);

  useEffect(() => {
    if (engine) {
      initializeScene();
      }
  }, [engine]);

  const reset2D = useCallback( () =>{
    if (model.current && scene.current && camera) {
      model.current.setEnabled(true);
      placementIndicator.current?.setEnabled(false);
      model.current.position = camera.position.add(camera.getForwardRay().direction);

      model.current.scalingDeterminant = 0;

      camera.setTarget(model.current);
      const startTime = Date.now();
      scene.current.beforeRender = function () {
        if (model.current && scene.current) {
          if (model.current.scalingDeterminant < 1) {
            const newScale = (Date.now() - startTime) / 500;
            model.current.scalingDeterminant = newScale > 1 ? 1: newScale;
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
        await xrSession.current.exitXRAsync();
        xrSession.current = undefined;
        modelPlaced.current = true;
        setTeachingMomentVisible(false);
        reset2D();
      } else {
        if (model.current && scene.current && placementIndicator.current) {
          model.current.setEnabled(false);
          modelPlaced.current = false;
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
          { xrSession.current && 
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
