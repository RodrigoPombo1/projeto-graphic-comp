import {CGFobject} from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
import { CGFappearance } from '../lib/CGF.js';
/**
 * MyPanorama
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPanorama extends CGFobject {
	constructor(scene) {
		super(scene);
		this.initBuffers();
		this.sphere = new MySphere(scene, 32, 16);

		//////// REVERSE THE SPHERE INSIDE OUT
		// Reverse normals
        for (let i = 0; i < this.sphere.normals.length; i++) {
            this.sphere.normals[i] *= -1;
        }

        // Change order of the indices
        for (let i = 0; i < this.sphere.indices.length; i += 3) {
            // Swap the second and third indices
            let aux = this.sphere.indices[i + 1];
            this.sphere.indices[i + 1] = this.sphere.indices[i + 2];
            this.sphere.indices[i + 2] = aux;
        }
		
        // Reload the sphere with the new normals and indices
        this.sphere.initGLBuffers();
		///////////

		this.panorama_material = new CGFappearance(scene);
		this.panorama_material.setAmbient(0.0, 0.0, 0.0, 0.0);
		this.panorama_material.setDiffuse(0.0, 0.0, 0.0, 0.0);
		this.panorama_material.setSpecular(0.0, 0.0, 0.0, 0.0);
		this.panorama_material.setShininess(0.0);
		this.panorama_material.setEmission(1.0, 1.0, 1.0, 1.0);
		this.panorama_material.loadTexture("textures/panorama_texture.jpg");
		this.panorama_material.setTextureWrap("REPEAT", "REPEAT");
		//this.sphere.setLineMode();
	}
	
	display() {
		this.scene.pushMatrix();
		// this.scene.translate(this.scene.camera.position[0], this.scene.camera.position[1], this.scene.camera.position[2]);
		this.scene.scale(200, 200, 200);
		this.panorama_material.apply();
		this.sphere.display();
		this.scene.popMatrix();
	}

	setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
	}

	setLineMode() 
	{ 
		this.primitiveType=this.scene.gl.LINES;
	};
}

