import {CGFobject} from '../lib/CGF.js';
import {MyQuad} from "./MyQuad.js";

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
        this.quad = new MyQuad(this.scene);
    }
 
    display() {
        // face frente
        this.scene.pushMatrix();

        this.scene.translate(0, 0, 0.5);

        this.quad.display();
        this.scene.popMatrix();

        // face traseira
        this.scene.pushMatrix();

        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(180*(Math.PI/180), 1, 0, 0);

        this.quad.display();
        this.scene.popMatrix();

        // face cima
        this.scene.pushMatrix();

        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-90*(Math.PI/180), 1, 0, 0);

        this.quad.display();
        this.scene.popMatrix();

        // face baixo
        this.scene.pushMatrix();

        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(90*(Math.PI/180), 1, 0, 0);

        this.quad.display();
        this.scene.popMatrix();

        // face direita
        this.scene.pushMatrix();

        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(90*(Math.PI/180), 0, 1, 0);

        this.quad.display();
        this.scene.popMatrix();

        // face esquerda
        this.scene.pushMatrix();

        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-90*(Math.PI/180), 0, 1, 0);

        this.quad.display();
        this.scene.popMatrix();
    }


}

