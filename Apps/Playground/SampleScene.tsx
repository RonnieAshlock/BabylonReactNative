import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";

export class SampleScene {
  private engine: BABYLON.Engine;
  scene: BABYLON.Scene | undefined;
  camera: BABYLON.ArcRotateCamera | undefined;
  model: BABYLON.AbstractMesh | undefined;
  placementIndicator: BABYLON.AbstractMesh | undefined;
  targetScale: number = .25;

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
    this.placementIndicator = BABYLON.Mesh.CreateTorus("placementIndicator", .3, .005, 64);
    var indicatorMat = new BABYLON.StandardMaterial('noLight', this.scene);
    indicatorMat.disableLighting = true;
    indicatorMat.emissiveColor = BABYLON.Color3.White();
    this.placementIndicator.material = indicatorMat;
    this.placementIndicator.scaling = new BABYLON.Vector3(1, 0.01, 1);
    this.placementIndicator.setEnabled(false);

    // Import a model.
    const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf");
    this.model = newModel.meshes[0];


    // Position the model in front of the camera.
    const { min, max } = this.model.getHierarchyBoundingVectors(true, null);
    this.model.position = this.camera.position.add(this.camera.getForwardRay().direction.scale(2));
    this.model.scalingDeterminant = 0;
    this.model.position.y -= (this.targetScale * (max.y - min.y));
    this.camera.setTarget(this.model);
    this.camera.beta -= Math.PI / 8;

    // Set the target scale to cap the size of the model to .25 meters deep.
    this.targetScale = .3 / (max.z - min.z);

    // Set up an animation loop to show the cube spinning.
    var that = this;
    const startTime = Date.now();
    this.scene.beforeRender = function () {
      if (that.model && that.scene) {
        if (that.model.scalingDeterminant < that.targetScale) {
          const newScale = that.targetScale * (Date.now() - startTime) / 500;
          that.model.scalingDeterminant = newScale > that.targetScale ? that.targetScale : newScale;
        }
        that.model.rotate(BABYLON.Vector3.Up(), 0.005 * that.scene.getAnimationRatio());
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
      var that = this;
      this.scene.beforeRender = function () {
        if (that.model && that.scene) {
          if (that.model.scalingDeterminant < that.targetScale) {
            const newScale = that.targetScale * (Date.now() - startTime) / 500;
            that.model.scalingDeterminant = newScale > that.targetScale ? that.targetScale : newScale;
          }
          that.model.rotate(BABYLON.Vector3.Up(), 0.005 * that.scene.getAnimationRatio());
        }
      };
    }
  };
}
