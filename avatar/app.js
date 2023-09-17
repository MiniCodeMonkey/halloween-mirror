import {Engine} from '@babylonjs/core/Engines/engine';
import {Color3, Vector3, Angle} from '@babylonjs/core/Maths/math';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {ShadowGenerator} from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Helpers/sceneHelpers';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';

import {HostObject} from '@amazon-sumerian-hosts/babylon';
import {Scene} from '@babylonjs/core/scene';

async function startShow(createScene) {
  const canvas = document.getElementById('renderCanvas');
  const engine = new Engine(canvas, true);
  const scene = await createScene(canvas);
  scene.render();
  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => engine.resize());

  // Reveal the loaded scene.
  document.getElementById('mainScreen').classList.remove('loading');
}

function setupSceneEnvironment(scene) {
  // Create a simple environment.
  const environmentHelper = scene.createDefaultEnvironment({
    groundOpacity: 0,
    groundShadowLevel: 0.1,
  });
  environmentHelper.setMainColor(new Color3(0, 0, 0));

  scene.environmentIntensity = 1.2;

  const shadowLight = new DirectionalLight(
    'shadowLight',
    new Vector3(0.8, -2, -1)
  );
  shadowLight.diffuse = new Color3(1, 0.9, 0.62);
  shadowLight.intensity = 2;

  const keyLight = new DirectionalLight('keyLight', new Vector3(0.3, -1, -2));
  keyLight.diffuse = new Color3(1, 0.9, 0.65);
  keyLight.intensity = 3;

  // Add a camera.
  const cameraRotation = Angle.FromDegrees(85).radians();
  const cameraPitch = Angle.FromDegrees(70).radians();
  const camera = new ArcRotateCamera(
    'camera',
    cameraRotation,
    cameraPitch,
    2.6,
    new Vector3(0, 1.0, 0)
  );
  camera.wheelDeltaPercentage = 0.01;
  camera.minZ = 0.01;

  // Initialize user control of camera.
  const canvas = scene.getEngine().getRenderingCanvas();
  camera.attachControl(canvas, true);

  const shadowGenerator = new ShadowGenerator(2048, shadowLight);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurKernel = 8;
  scene.meshes.forEach(mesh => {
    shadowGenerator.addShadowCaster(mesh);
  });

  return {scene, shadowGenerator};
}

let host;
let scene;

const defaultGestureOptions = {
  holdTime: 1.5, // how long the gesture should last
  minimumInterval: 0, // how soon another gesture can be triggered
};

async function createScene() {

  scene = new Scene();
  scene.useRightHandedSystem = true;

  const {shadowGenerator} = setupSceneEnvironment(scene);
  initUi();

  // ===== Configure the AWS SDK =====
  const config = await (await fetch('/devConfig.json')).json();
  const cognitoIdentityPoolId = config.cognitoIdentityPoolId;

  AWS.config.region = cognitoIdentityPoolId.split(':')[0];
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cognitoIdentityPoolId,
  });

  // ===== Instantiate the Sumerian Host =====

  // Edit the characterId if you would like to use one of
  // the other pre-built host characters. Available character IDs are:
  // "Cristine", "Fiona", "Grace", "Maya", "Jay", "Luke", "Preston", "Wes"
  const characterId = 'Cristine';
  const characterConfig = HostObject.getCharacterConfig(
    './character-assets',
    characterId
  );
  const pollyConfig = {pollyVoice: 'Sofie', pollyEngine: 'neural'};
  host = await HostObject.createHost(scene, characterConfig, pollyConfig);

  // Tell the host to always look at the camera.
  host.PointOfInterestFeature.setTarget(scene.activeCamera);

  // Enable shadows.
  scene.meshes.forEach(mesh => {
    shadowGenerator.addShadowCaster(mesh);
  });

  
  setTimeout(function () {
    document.getElementById('renderCanvas').classList.remove('invisible');
    document.getElementById('renderCanvas').classList.add('animate__animated');
    document.getElementById('renderCanvas').classList.add('animate__fadeIn');
    document.getElementById('renderCanvas').classList.add('animate__slow');

    setTimeout(function () {
      document.getElementById('eyes').classList.remove('invisible');
      document.getElementById('eyes').classList.add('animate__animated');
      document.getElementById('eyes').classList.add('animate__fadeIn');
      document.getElementById('eyes').classList.add('animate__slow');
    }, 12000);

    setTimeout(function () {
      document.getElementById('eyes').classList.remove('animate__fadeIn');
      document.getElementById('eyes').classList.add('animate__fadeOut');
    }, 12000 + 2500);

    setTimeout(function () {
      document.getElementById('pumpkin').classList.remove('invisible');
      document.getElementById('pumpkin').classList.add('animate__animated');
      document.getElementById('pumpkin').classList.add('animate__slideInLeft');
      document.getElementById('pumpkin').classList.add('animate__slow');
    }, 22000);

    setTimeout(function () {
      document.getElementById('pumpkin').classList.remove('animate__slideInLeft');
      document.getElementById('pumpkin').classList.add('animate__slideOutLeft');
    }, 22000 + 2500);

    setTimeout(function () {
      document.getElementById('renderCanvas').classList.remove('animate__fadeIn');
      document.getElementById('renderCanvas').classList.add('animate__fadeOut');
    }, 35000)


    //host.GestureFeature.playGesture('Gesture', 'wave', defaultGestureOptions);
    //host.TextToSpeechFeature.play('I skovens dunkle og grusomme mørke findes væsner der lever i både vinter og tørke.');
    host.TextToSpeechFeature.play(`
<speak>
      <p>
        Godt du er <w role="amazon:VB">her</w>!
        <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Emote", "cheer"]}'/>
      </p>

      <break />

      <p>
        Jeg har brug for din hjælp!
      </p>

      <prosody rate="slow">
        <p>Der er sluppet et monster fri i skoven!!!</p>
        
        <p>Det er sådan cirka så højt her.</p>
        <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Gesture", "big", { "holdTime": 0.8, "minimumInterval": 0 }]}'/> 
        <p>Det har store røde øjne.</p>

        <break />

        <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Gesture", "defense", { "holdTime": 0.8, "minimumInterval": 0 }]}'/> 
        <p>Det nåede at slippe væk fra mig sidst jeg var derinde.</p>

        <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Gesture", "heart", { "holdTime": 0.8, "minimumInterval": 0 }]}'/> 
        <p>Du må gerne hjælpe mig med at skræmme det væk. Baby Græskarerne er meget bange for det.</p>
        <p>Men pas på! Jeg ved ikke hvad det kan finde på at gøre.</p>

        <break />

        <p>God fornøjelse!</p>
        <mark name='{"feature":"GestureFeature","method":"playGesture","args":["Emote", "applause"]}'/>
      </prosody>
</speak>`);


    /*setTimeout(function () {
      host.GestureFeature.playGesture('Gesture', 'you', defaultGestureOptions);
      host.TextToSpeechFeature.play('Ja dig... Pas på! Skoven er mørk og der er fyldt med skrækkelige væsner.');

      setTimeout(function () {
        host.GestureFeature.playGesture('Gesture', 'aggressive', defaultGestureOptions);
      }, 2000);
    }, 5000);*/
  }, 5000);

  return scene;
}

function initUi() {
  // Register Gesture menu handlers.
  const gestureSelect = document.getElementById('gestureSelect');
  gestureSelect.addEventListener('change', evt =>
    playGesture(evt.target.value)
  );

  // Register Emote menu handlers.
  const emoteSelect = document.getElementById('emoteSelect');
  emoteSelect.addEventListener('change', evt => playEmote(evt.target.value));

  // Reveal the UI.
  //document.getElementById('uiPanel').classList.remove('hide');
  //document.getElementById('speakButton').onclick = speak.bind(this);
}

function playGesture(name) {
  if (!name) return;

  // This options object is optional. It's included here to demonstrate the available options.
  const gestureOptions = {
    holdTime: 1.5, // how long the gesture should last
    minimumInterval: 0, // how soon another gesture can be triggered
  };
  host.GestureFeature.playGesture('Gesture', name, gestureOptions);
}

function playEmote(name) {
  if (!name) return;

  host.GestureFeature.playGesture('Emote', name);
}

function speak() {
  const speech = document.getElementById('speechText').value;
  host.TextToSpeechFeature.play(speech);
}

startShow(createScene);
