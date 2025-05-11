import {CGFobject, CGFappearance} from '../lib/CGF.js';
import {MyQuad} from "./MyQuad.js";

/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 * @param top_texture - File path to top texture
 * @param front_texture - File path to front texture
 * @param right_texture - File path to right texture
 * @param back_texture - File path to back texture
 * @param left_texture - File path to left texture
 * @param bottom_texture - File path to bottom texture
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, top_texture, front_texture, right_texture, back_texture, left_texture, bottom_texture) {
        super(scene);
        
        this.top_texture = top_texture;
        this.front_texture = front_texture;
        this.right_texture = right_texture;
        this.back_texture = back_texture;
        this.left_texture = left_texture;
        this.bottom_texture = bottom_texture;

        this.initMaterials();
        this.initBuffers();
        this.quad = new MyQuad(this.scene);

        // let texCoordsQuadBack = [
		// 	0, 1,
		// 	1, 1,
        //     1, 0,
		// 	0, 0,
		// ]
        // this.quadBack= new MyQuad(this.scene, texCoordsQuadBack);
    }

    initMaterials() {
        this.top_material = new CGFappearance(this.scene);
        this.top_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.top_material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.top_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.top_material.setShininess(10.0);
        this.top_material.loadTexture(this.top_texture);
        this.top_material.setTextureWrap('REPEAT', 'REPEAT');

        this.front_material = new CGFappearance(this.scene);
        this.front_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.front_material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.front_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.front_material.setShininess(10.0);
        this.front_material.loadTexture(this.front_texture);
        this.front_material.setTextureWrap('REPEAT', 'REPEAT');

        this.right_material = new CGFappearance(this.scene);
        this.right_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.right_material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.right_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.right_material.setShininess(10.0);
        this.right_material.loadTexture(this.right_texture);
        this.right_material.setTextureWrap('REPEAT', 'REPEAT');

        this.back_material = new CGFappearance(this.scene);
        this.back_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.back_material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.back_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.back_material.setShininess(10.0);
        this.back_material.loadTexture(this.back_texture);
        this.back_material.setTextureWrap('REPEAT', 'REPEAT');

        this.left_material = new CGFappearance(this.scene);
        this.left_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.left_material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.left_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.left_material.setShininess(10.0);
        this.left_material.loadTexture(this.left_texture);
        this.left_material.setTextureWrap('REPEAT', 'REPEAT');

        this.bottom_material = new CGFappearance(this.scene);
        this.bottom_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.bottom_material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.bottom_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.bottom_material.setShininess(10.0);
        this.bottom_material.loadTexture(this.bottom_texture);
        this.bottom_material.setTextureWrap('REPEAT', 'REPEAT');
    }
 
    display() {
        // face frente
        this.scene.pushMatrix();

        this.scene.translate(0, 0, 0.5);

        this.front_material.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        
        this.quad.display();
        this.scene.popMatrix();

        // face traseira
        this.scene.pushMatrix();

        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(180*(Math.PI/180), 1, 0, 0);
        this.scene.rotate(180*(Math.PI/180), 0, 0, 1);

        this.back_material.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        this.quad.display();
        this.scene.popMatrix();

        // face cima
        this.scene.pushMatrix();

        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-90*(Math.PI/180), 1, 0, 0);

        this.top_material.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        this.quad.display();
        this.scene.popMatrix();

        // face baixo
        this.scene.pushMatrix();

        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(90*(Math.PI/180), 1, 0, 0);

        this.bottom_material.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        this.quad.display();
        this.scene.popMatrix();

        // face direita
        this.scene.pushMatrix();

        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(90*(Math.PI/180), 0, 1, 0);

        this.right_material.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        this.quad.display();
        this.scene.popMatrix();

        // face esquerda
        this.scene.pushMatrix();

        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-90*(Math.PI/180), 0, 1, 0);

        this.left_material.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        this.quad.display();
        this.scene.popMatrix();
    }


}

