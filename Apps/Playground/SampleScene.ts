import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";

export const sceneCookie = 1;

// To run this code in the playground copy everything after the Export below down
// and uncomment the final lines.
export class SampleScene {
  private engine: BABYLON.Engine;
  scene: BABYLON.Scene | undefined;
  camera: BABYLON.ArcRotateCamera | undefined;
  model: BABYLON.AbstractMesh | undefined;
  placementIndicator: BABYLON.AbstractMesh | undefined;
  targetScale: number = .25;

  public static modelUrl: string = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF/BoxTextured.gltf";

  constructor(engine: BABYLON.Engine) {
    this.engine = engine;
  }

  public initializeSceneAsync = async () => {
    // Create the scene. 
    this.scene = new BABYLON.Scene(this.engine);

    // Setup the camera.
    this.scene.createDefaultCamera(true);
    this.camera = this.scene.activeCamera as BABYLON.ArcRotateCamera;

    // Set up lighting for the scene
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 5, 0), this.scene);
    light.diffuse = BABYLON.Color3.White();
    light.intensity = 1;

    // Create the placement indicator.
    this.placementIndicator = BABYLON.Mesh.CreateTorus("placementIndicator", .5, .005, 64);
    var indicatorMat = new BABYLON.StandardMaterial('noLight', this.scene);
    indicatorMat.disableLighting = true;
    indicatorMat.emissiveColor = BABYLON.Color3.White();
    this.placementIndicator.material = indicatorMat;
    this.placementIndicator.scaling = new BABYLON.Vector3(1, 0.01, 1);
    this.placementIndicator.setEnabled(false); 

    // Import a model.
    this.model = BABYLON.Mesh.CreateBox("box", 0.3, this.scene);
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", SampleScene.modelUrl);
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF/CesiumMan.gltf");
    //this.model = newModel.meshes[0];

    // Position the model in front of the camera.
    const { min, max } = this.model.getHierarchyBoundingVectors(true, null);
    this.model.position = this.camera.position.add(this.camera.getForwardRay().direction.scale(2));
    this.model.scalingDeterminant = 0;
    this.model.position.y -= (this.targetScale * (max.y - min.y));
    this.camera.setTarget(this.model);
    this.camera.beta -= Math.PI / 8;

    // Set the target scale to cap the size of the model to .5 meters tall.
    this.targetScale = .5 / (max.y - min.y);

    // Set up an animation loop to show the cube spinning.
    const startTime = Date.now();
    this.scene.beforeRender = () => {
      if (this.model && this.scene) {
        if (this.model.scalingDeterminant < this.targetScale) {
          const newScale = this.targetScale * (Date.now() - startTime) / 500;
          this.model.scalingDeterminant = newScale > this.targetScale ? this.targetScale : newScale;
        }
        this.model.rotate(BABYLON.Vector3.Up(), 0.005 * this.scene.getAnimationRatio());
      }
    };
  };

  // Function that resets the 2D screen state to its original position.
  public reset2D = () => {
    if (this.model && this.scene && this.camera) {
      this.model.setEnabled(true);
      this.model.position = this.camera.position.add(this.camera.getForwardRay().direction.scale(2));
      this.model.scalingDeterminant = 0;
      this.camera.setTarget(this.model);
      const startTime = Date.now();
      this.scene.beforeRender = () => {
        if (this.model && this.scene) {
          if (this.model.scalingDeterminant < this.targetScale) {
            const newScale = this.targetScale * (Date.now() - startTime) / 500;
            this.model.scalingDeterminant = newScale > this.targetScale ? this.targetScale : newScale;
          }

          this.model.rotate(BABYLON.Vector3.Up(), 0.005 * this.scene.getAnimationRatio());
        }
      };
    }
  };
}

/*
// Uncomment these lines in the Babylon.js Playground 
class Playground { 
    public static async CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): Promise<BABYLON.Scene> {
        var sampleScene = new SampleScene(engine);
        await sampleScene.initializeSceneAsync();        
        return sampleScene.scene;
    }
}
*/