import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

export class MyWindow extends CGFobject {
    constructor(scene, window_material) {
        super(scene);
        this.quad = new MyQuad(scene);
        this.window_material = window_material;
    }

    display() {
        this.scene.pushMatrix();
        this.window_material.apply();
        this.quad.display();
        this.scene.popMatrix();
    }
}