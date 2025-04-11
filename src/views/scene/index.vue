<template>
  <canvas id="renderCanvas" touch-action="none"></canvas>
</template>
<script setup lang="ts">
import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic'
import { onMounted } from 'vue'

const PI = Math.PI
registerBuiltInLoaders()

onMounted(async () => {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  // // Associate a Babylon Engine to it.
  if (!canvas) return
  const engine = await BABYLON.EngineFactory.CreateAsync(canvas, {})

  // Create our first scene.
  const scene = new BABYLON.Scene(engine)
  // This creates and positions a free camera (non-mesh)
  // const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -PI / 2,
    PI / 2.5,
    10,
    new BABYLON.Vector3(0, 0, 0),
    scene,
  )
  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero())
  // This attaches the camera to the canvas
  camera.attachControl(canvas, true)
  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight('light2', new BABYLON.Vector3(0, 1, 0), scene)
  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7
  // Create a grid material
  const material = new BABYLON.StandardMaterial('mat', scene)
  // Our built-in 'sphere' shape.
  const sphere = BABYLON.CreateSphere('sphere1', { segments: 16, diameter: 2 }, scene)
  // Move the sphere upward 1/2 its height
  sphere.position.y = 2
  // Affect a material
  sphere.material = material

  // Our built-in 'ground' shape.
  const ground = BABYLON.CreateGround('ground1', { width: 6, height: 6, subdivisions: 2 }, scene)

  // Affect a material
  ground.material = material
  await BABYLON.AppendSceneAsync('/test.glb', scene)

  // Render every frame
  engine.runRenderLoop(() => {
    scene.render()
  })
})
</script>
<style lang="scss" scoped>
canvas {
  width: 80%;
  height: 80vh;
}
</style>
