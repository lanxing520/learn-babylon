<template>
  <div id="renderCanvas" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { onMounted } from 'vue';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.2/dat.gui.min.js');
    await loadScript('https://assets.babylonjs.com/generated/Assets.js');
    await loadScript('https://cdn.babylonjs.com/recast.js');
    await loadScript('https://cdn.babylonjs.com/ammo.js');
    await loadScript('https://cdn.babylonjs.com/cannon.js');
    await loadScript('https://cdn.babylonjs.com/Oimo.js');
    await loadScript('https://cdn.babylonjs.com/earcut.min.js');
    await loadScript('https://cdn.babylonjs.com/babylon.js');
    await loadScript('https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js');
    await loadScript('https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js');
    await loadScript('https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js');
    await loadScript('https://cdn.babylonjs.com/loaders/babylonjs.loaders.js');
    await loadScript('https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js');
    await loadScript('https://cdn.babylonjs.com/gui/babylon.gui.min.js');
    await loadScript('https://cdn.babylonjs.com/addons/babylonjs.addons.min.js');
    await loadScript('https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js');

    // 所有脚本加载完成后初始化 Babylon 场景
    initializeBabylon();
  } catch (error) {
    console.error('Failed to load scripts', error);
  }
});

function initializeBabylon() {
  // 在这里初始化 Babylon.js 引擎和场景
  var canvas = document.getElementById('renderCanvas');
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
    return scene;
  };

  var scene = createScene();
  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });
}
</script>