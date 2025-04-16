<template>

</template>
<script setup lang="ts">
import * as BABYLON from '@babylonjs/core/Legacy/legacy'

const createScene = function() {
    const scene = new BABYLON.Scene(engine);

    // 相机
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // 灯光
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // 流体渲染器
    const fluidRenderer = new BABYLON.FluidRenderer(scene);

    // 圆柱体
    const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {
        height: 2,
        diameter: 1,
        tessellation: 64
    }, scene);
    cylinder.position.y = 1;

    // 圆柱体材质
    cylinder.material = new BABYLON.StandardMaterial("cylinderMat", scene);
    cylinder.material.alpha = 0.3;
    cylinder.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 1);

    // 流体对象
    const fluidObject = fluidRenderer.createFluidObject(cylinder, {
        generateParticles: true,
        particleSize: 0.02,
        particleThickness: 0.02
    });

    fluidObject.particleSize = 0.02;
    fluidObject.particleThickness = 0.02;
    fluidObject.maxParticles = 5000;
    fluidObject.minParticles = 1000;
    fluidObject.density = 1.0;
    fluidObject.viscosity = 0.01;
    fluidObject.surfaceTension = 0.1;

    // 物理
    const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    const physicsPlugin = new BABYLON.HavokPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    cylinder.physicsImpostor = new BABYLON.PhysicsImpostor(
        cylinder,
        BABYLON.PhysicsImpostor.CylinderImpostor,
        { mass: 0, restitution: 0.7 },
        scene
    );

    // 粒子系统
    fluidObject.particleSystem = new BABYLON.ParticleSystem("particles", 5000, scene);
    fluidObject.particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,...", scene);
    fluidObject.particleSystem.emitter = cylinder;
    fluidObject.particleSystem.minEmitBox = new BABYLON.Vector3(-0.4, -0.9, -0.4);
    fluidObject.particleSystem.maxEmitBox = new BABYLON.Vector3(0.4, 0.9, 0.4);
    fluidObject.particleSystem.gravity = gravityVector;

    // 倾斜控制
    let isTilting = false;
    let tiltAngle = 0;

    scene.onPointerDown = function() {
        isTilting = true;
    };

    scene.onPointerUp = function() {
        isTilting = false;
    };

    scene.onPointerMove = function(evt) {
        if (isTilting) {
            tiltAngle += evt.movementX * 0.01;
            cylinder.rotation.z = tiltAngle;

            if (Math.abs(tiltAngle) > Math.PI/4) {
                fluidObject.particleSystem.minEmitBox.y = -1.5;
            } else {
                fluidObject.particleSystem.minEmitBox.y = -0.9;
            }
        }
    };

    return scene;
};
</script>
<style></style>
