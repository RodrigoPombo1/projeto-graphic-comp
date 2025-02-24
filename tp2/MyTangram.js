import {CGFobject} from '../lib/CGF.js';

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
        
        this.scene.setDiffuse(0, 1, 0, 0);
        this.diamond.display();
        this.scene.popMatrix();

        // yellow parallelogram
        this.scene.pushMatrix();
        
        this.scene.scale(-1, 1, 1);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        
        this.scene.setDiffuse(1, 1, 0, 0);
        this.parallelogram.display();
        this.scene.popMatrix();

        // purple triangle
        this.scene.pushMatrix();

        this.scene.translate(1.7, 2.3, 0);
        this.scene.scale(0.7,0.7,0.7);

        this.scene.setDiffuse(0.5, 0, 0.5, 0);
        this.triangle.display();
        this.scene.popMatrix();

        // red triangle
        this.scene.pushMatrix();

        this.scene.translate(2,-1,0);
        this.scene.rotate(90*(Math.PI/180),0,0,1);

        this.scene.setDiffuse(1, 0, 0, 0);
        this.triangleSmall.display();
        this.scene.popMatrix();

        // pink triangle
        this.scene.pushMatrix();
        
        this.scene.translate(0.5, -2, 0);
        this.scene.rotate(270*(Math.PI/180),0,0,1);
        this.scene.scale(1.5,1.5,1.5);

        this.scene.setDiffuse(1, 209/255, 223/255, 0);
        this.triangleSmall.display();
        this.scene.popMatrix();

        // light blue triangle
        this.scene.pushMatrix();

        this.scene.translate(-1, -2, 0);
        this.scene.rotate(270*(Math.PI/180), 0, 0, -1);
        this.scene.scale(1.5,1.5,1.5);

        this.scene.setDiffuse(135/255, 206/255, 250/255, 0);
        this.triangle.display();
        this.scene.popMatrix();

        // orange triangle
        this.scene.pushMatrix();

        this.scene.translate(-1.5,-0.5,0);
        this.scene.rotate(180*(Math.PI/180), 0, 0, 1);

        this.scene.setDiffuse(1, 166/255, 0, 0);
        this.triangleBig.display();
        this.scene.popMatrix();
    }
}

