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
  targetScale: number = 2;

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
    light.specular = new BABYLON.Color3(0, 0, 0);

    // Create the placement indicator.
    this.placementIndicator = BABYLON.Mesh.CreateTorus("placementIndicator", .5, .005, 64);
    var indicatorMat = new BABYLON.StandardMaterial('noLight', this.scene);
    indicatorMat.disableLighting = true;
    indicatorMat.emissiveColor = BABYLON.Color3.White();
    this.placementIndicator.material = indicatorMat;
    this.placementIndicator.scaling = new BABYLON.Vector3(1, 0.01, 1);
    this.placementIndicator.setEnabled(false); 

    // Import a model.
    //this.model = BABYLON.Mesh.CreateBox("box", 0.3, this.scene);
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxTextured/glTF/BoxTextured.gltf");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://poly.googleusercontent.com/downloads/c/fp/1595152286652373/6xn1irne__S/aduhRbNxsqH/Sonic%20the%20Hedgehog.gltf");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://poly.googleusercontent.com/downloads/c/fp/1595324547122487/4YajIweD1pN/fAfFoekkdQl/model.gltf");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF/CesiumMan.gltf");
    
    //Models with Progressively larger textures
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Head/Head_NoTex.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Head/Head_512Tex.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Head/Head_1KTex.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Head/Head_2KTex.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Head/Head_4KTex.glb");

    //3D Scans
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/DwarfGoat.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/EnglishBulldog.glb");;
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/FireHydrant.glb");
    
    //Static Models of varying complexity and size
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/CoffeeMug.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/HospitalBed.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/WarehouseShelf.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/WarehouseShelfPieces.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/IndustrialEspresso.glb");
    const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/CherryPicker.glb");
    
    //Animated Models
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Bendy.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Alien.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/ZeroGravity.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/BabylonJS/Assets/master/meshes/alien.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/SolarSystem.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Sun.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Mercury.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Venus.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Earth.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Mars.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Jupiter.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Saturn.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Neptune.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/Uranus.glb");


    // Lighting scenarios
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/GLB/SphereLights.glb");
    //const newModel = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/RonnieAshlock/TestAssets/master/BabylonScenes/SphereLights.babylon");
    
    console.error("loaded model.");
    this.model = newModel.meshes[0];

    // Position the model in front of the camera.
    const { min, max } = this.model.getHierarchyBoundingVectors(true, null);

    // Set the target scale to cap the size of the model to targetScale meters tall.
    this.targetScale = this.targetScale / (max.y - min.y);

    this.model.position = this.camera.position.add(this.camera.getForwardRay().direction.scale(this.targetScale * 10));
    this.model.scalingDeterminant = 0;
    this.model.lookAt(this.camera.position);
    this.camera.setTarget(this.model);
    this.camera.beta -= Math.PI / 8;


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
      this.model.position = this.camera.position.add(this.camera.getForwardRay().direction.scale(this.targetScale * 5));
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