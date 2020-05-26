/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, FunctionComponent, useEffect, useCallback } from 'react';
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
  const [model, setModel] = useState<AbstractMesh>();
  const [scene, setScene] = useState<Scene>();
  const [xrSession, setXrSession] = useState<WebXRSessionManager>();
  const [cameraInitialPosition, setCameraPosition] = useState<Vector3>(Vector3.Zero());
  const [deviceSourceManager, setDeviceSourceManager] = useState<DeviceSourceManager>();

  const createInputHandling = useCallback(() => {
    try
    {
    if (engine && scene) {
      const dsm = new DeviceSourceManager(engine);
      setDeviceSourceManager(dsm);
      scene.beforeRender = function() {
         const sources = dsm.getDeviceSources(DeviceType.Touch);
         console.error(sources);
         if (sources !== undefined)
         {
           console.error(sources);
         }
      }

      dsm.onAfterDeviceConnectedObservable.add(deviceEventData => {
        /*console.error("Got input device.");
        setTeachingMomentVisible(false);

        if (xrSession && model && camera && scene) {
          model.setEnabled(false);
          model.scalingDeterminant = 0;

          camera.setTarget(model);
          const startTime = Date.now();
          scene.beforeRender = function () {
            if (model.scalingDeterminant < 1) {
              const newScale = (Date.now() - startTime) / 1000;
              model.scalingDeterminant = newScale > 1 ? 1: newScale;
            }
          };      
        }*/      
        console.log(`Added ${DeviceType[deviceEventData.deviceType]}-${deviceEventData.deviceSlot}`);
        dsm.getDeviceSource(deviceEventData.deviceType, deviceEventData.deviceSlot)?.onInputChangedObservable.add(inputEventData => {
          console.log(`${DeviceType[deviceEventData.deviceType]}-${deviceEventData.deviceSlot} | ${PointerInput[inputEventData.inputIndex]} | ${inputEventData.previousState} -> ${inputEventData.currentState}`);
        });
      });
    }
  }
  catch (ex)
  {
    console.error(ex);
  }
  }, [engine, scene, camera, model, xrSession]);

  const initializeScene = useCallback(async () => {
    if (engine) {
      const scene = new Scene(engine);
      setScene(scene);
      scene.createDefaultCamera(true);
      const arcCamera = scene.activeCamera as ArcRotateCamera;
      setCamera(arcCamera);
      setCameraPosition(arcCamera.position);
      scene.createDefaultLight(true);
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

      const newBox = Mesh.CreateBox("box", 0.3, scene);
      setModel(newBox);
      newBox.position = arcCamera.position.add(arcCamera.getForwardRay().direction);

      const mat = new PBRMetallicRoughnessMaterial("mat", scene);
      mat.metallic = 1;
      mat.roughness = 0.5;
      mat.baseColor = Color3.Red();
      newBox.material = mat;

      newBox.scalingDeterminant = 0;

      arcCamera.setTarget(newBox);
      arcCamera.beta -= Math.PI / 8;

      const startTime = Date.now();
      scene.beforeRender = function () {
        if (newBox.scalingDeterminant < 1) {
          const newScale = (Date.now() - startTime) / 1000;
          newBox.scalingDeterminant = newScale > 1 ? 1: newScale;
        }
        
        newBox.rotate(Vector3.Up(), 0.005 * scene.getAnimationRatio());
      };

    }
  }, [engine]);

  useEffect(() => {
    if (engine) {
      initializeScene();
      }
  }, [engine]);

  const resetClick = useCallback(() => {
    setTeachingMomentVisible(false);
    Date.now()
    if (model !== undefined && camera !== undefined && scene !== undefined) {
      model.position = camera.position.add(camera.getForwardRay().direction);

      model.scalingDeterminant = 0;

      camera.setTarget(model);
      const startTime = Date.now();
      scene.beforeRender = function () {
        if (model.scalingDeterminant < 1) {
          const newScale = (Date.now() - startTime) / 1000;
          model.scalingDeterminant = newScale > 1 ? 1: newScale;
        }

        model.rotate(Vector3.Up(), 0.005 * scene.getAnimationRatio());
      };
    }
  }, [model, scene, xrSession]);

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
      if (xrSession) {
        await xrSession.exitXRAsync();
        setXrSession(undefined);
        setTeachingMomentVisible(false);

        if (model !== undefined && scene !== undefined) {
          if (camera !== undefined)
          {
            model.setEnabled(true);
            model.position = camera.position.add(camera.getForwardRay().direction);
            camera.position = cameraInitialPosition;
          }
        }
      } else {
        if (model !== undefined && scene !== undefined) {
          model.setEnabled(false);
          const xr = await scene.createDefaultXRExperienceAsync({ disableDefaultUI: true, disableTeleportation: true })

          // Set up the hit test.
          const xrHitTestModule = xr.baseExperience.featuresManager.enableFeature(
            WebXRFeatureName.HIT_TEST,
            "latest",
             {offsetRay: {origin: {x: 0, y: 0, z: 0}, direction: {x: 0, y: 0, z: -1}}}) as WebXRHitTest;

          xrHitTestModule.onHitTestResultObservable.add((results) => {
              if (results.length) {
                if (!teachingMomentVisible)
                {
                  setTeachingMomentVisible(true);
                }

                model.position = results[0].position;
              }
          });

          const session = await xr.baseExperience.enterXRAsync("immersive-ar", "unbounded", xr.renderTarget);
          setXrSession(session);
          model.rotate(Vector3.Up(), 3.14159);
        }
      }
    })();
  }, [scene, model, xrSession]);

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

          <View style={styles.placementBarContainer}>
                  <CameraButton style={styles.cameraButton} cameraClickHandler={() => {}} />
          </View>
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
