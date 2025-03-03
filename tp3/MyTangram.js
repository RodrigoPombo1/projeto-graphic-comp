import {CGFappearance, CGFobject} from '../lib/CGF.js';

// import the figures from TP1
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
	constructor(scene) {
		super(scene);
		// this.initBuffers();
        this.diamond = new MyDiamond(this.scene);
        this.triangle = new MyTriangle(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.triangleSmall = new MyTriangleSmall(this.scene);
        this.triangleBig = new MyTriangleBig(this.scene);

        this.initMaterials();
	}

    initMaterials() {
        // yellow parallelogram
        this.yellowParallelogramMaterial = new CGFappearance(this.scene);
        this.yellowParallelogramMaterial.setAmbient(1, 1, 0, 1.0);
        this.yellowParallelogramMaterial.setDiffuse(1, 1, 0, 1.0);
        this.yellowParallelogramMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.yellowParallelogramMaterial.setShininess(10);

        // purple triangle
        this.purpleTriangleMaterial = new CGFappearance(this.scene);
        this.purpleTriangleMaterial.setAmbient(170/255, 79/255, 194/255, 1.0);
        this.purpleTriangleMaterial.setDiffuse(170/255, 79/255, 194/255, 1.0);
        this.purpleTriangleMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.purpleTriangleMaterial.setShininess(10);

        // red triangle
        this.redTriangleMaterial = new CGFappearance(this.scene);
        this.redTriangleMaterial.setAmbient(1, 20/255, 20/255, 1.0);
        this.redTriangleMaterial.setDiffuse(1, 20/255, 20/255, 1.0);
        this.redTriangleMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.redTriangleMaterial.setShininess(10);

        // pink triangle
        this.pinkTriangleMaterial = new CGFappearance(this.scene);
        this.pinkTriangleMaterial.setAmbient(1, 156/255, 210/255, 1.0);
        this.pinkTriangleMaterial.setDiffuse(1, 156/255, 210/255, 1.0);
        this.pinkTriangleMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.pinkTriangleMaterial.setShininess(10);

        // light blue triangle
        this.lightBlueTriangleMaterial = new CGFappearance(this.scene);
        this.lightBlueTriangleMaterial.setAmbient(0, 156/255, 1, 1.0);
        this.lightBlueTriangleMaterial.setDiffuse(0, 156/255, 1, 1.0);
        this.lightBlueTriangleMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.lightBlueTriangleMaterial.setShininess(10);

        // orange triangle
        this.orangeTriangleMaterial = new CGFappearance(this.scene);
        this.orangeTriangleMaterial.setAmbient(1, 156/255, 0, 1.0);
        this.orangeTriangleMaterial.setDiffuse(1, 156/255, 0, 1.0);
        this.orangeTriangleMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.orangeTriangleMaterial.setShininess(10);
    }
	
    display() {
        // green diamond
        this.scene.pushMatrix();

        let diamond_translate_matrix = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            1,0,0,1,
        ];

        this.scene.multMatrix(diamond_translate_matrix);

        this.scene.materials[this.scene.selectedMaterial].apply();
        this.diamond.display();
        this.scene.popMatrix();

        // yellow parallelogram
        this.scene.pushMatrix();
        
        this.scene.scale(-1, 1, 1);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        
        this.yellowParallelogramMaterial.apply();

        this.parallelogram.display();
        this.scene.popMatrix();

        // purple triangle
        this.scene.pushMatrix();

        this.scene.translate(1.7, 2.3, 0);
        this.scene.scale(0.7,0.7,0.7);

        this.purpleTriangleMaterial.apply();

        this.triangle.display();
        this.scene.popMatrix();

        // red triangle
        this.scene.pushMatrix();

        this.scene.translate(2,-1,0);
        this.scene.rotate(90*(Math.PI/180),0,0,1);

        this.redTriangleMaterial.apply();

        this.triangleSmall.display();
        this.scene.popMatrix();

        // pink triangle
        this.scene.pushMatrix();
        
        this.scene.translate(0.5, -2, 0);
        this.scene.rotate(270*(Math.PI/180),0,0,1);
        this.scene.scale(1.5,1.5,1.5);

        this.pinkTriangleMaterial.apply();
        
        this.triangleSmall.display();
        this.scene.popMatrix();

        // light blue triangle
        this.scene.pushMatrix();

        this.scene.translate(-1, -2, 0);
        this.scene.rotate(270*(Math.PI/180), 0, 0, -1);
        this.scene.scale(1.5,1.5,1.5);

        this.lightBlueTriangleMaterial.apply();

        this.triangle.display();
        this.scene.popMatrix();

        // orange triangle
        this.scene.pushMatrix();

        this.scene.translate(-1.5,-0.5,0);
        this.scene.rotate(180*(Math.PI/180), 0, 0, 1);

        this.orangeTriangleMaterial.apply();

        this.triangleBig.display();
        this.scene.popMatrix();
    }

    enableNormalViz(){
        this.diamond.enableNormalViz()
        this.triangle.enableNormalViz()
        this.triangleBig.enableNormalViz()
        this.triangleSmall.enableNormalViz()
        this.parallelogram.enableNormalViz()
    };

    disableNormalViz(){
        this.diamond.disableNormalViz()
        this.triangle.disableNormalViz()
        this.triangleBig.disableNormalViz()
        this.triangleSmall.disableNormalViz()
        this.parallelogram.disableNormalViz()
    };
}

