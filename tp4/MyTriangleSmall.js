import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangleSmall
 * @param gl {WebGLRenderingContext}
 * @param texCoords {number[]} - Array
 * @constructor
 */
export class MyTriangleSmall extends CGFobject {
    constructor(scene, texCoords) {
        super(scene);
        this.texCoords = texCoords;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -1, 0, 0,
            1, 0, 0,
            0, 1, 0,
        ];

        this.indices = [
            0, 1, 2,
        ];
        
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        this.primitiveType=this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
