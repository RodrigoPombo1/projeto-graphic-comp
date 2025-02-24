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

        this.scene.setDiffuse(0, 1, 0, 0);
        this.diamond.display();
        this.scene.popMatrix();

        // yellow parallelogram
        this.scene.pushMatrix();

        this.scene.setDiffuse(1, 1, 0, 0);
        this.parallelogram.display();
        this.scene.popMatrix();

        // purple triangle
        this.scene.pushMatrix();

        this.scene.setDiffuse(0.5, 0, 0.5, 0);
        this.diamond.display();
        this.scene.popMatrix();

        // red triangle
        this.scene.pushMatrix();

        this.scene.setDiffuse(1, 0, 0, 0);
        this.diamond.display();
        this.scene.popMatrix();

        // pink triangle
        this.scene.pushMatrix();

        this.scene.setDiffuse(1, 209/255, 223/255, 0);
        this.diamond.display();
        this.scene.popMatrix();

        // blue triangle
        this.scene.pushMatrix();

        this.scene.setDiffuse(0, 0, 0.5, 0);
        this.diamond.display();
        this.scene.popMatrix();

        // orange triangle
    }
}

