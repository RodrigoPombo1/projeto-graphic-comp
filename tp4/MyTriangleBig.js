import { CGFobject } from '../lib/CGF.js';

/**
 * MyTriangleBig
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
export class MyTriangleBig extends CGFobject {
    constructor(scene) {
        super(scene);

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -2, 0, 0,
            2, 0, 0,
            0, 2, 0
        ];

        this.indices = [
            0, 1, 2
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        this.texCoords = [
            1, 1,
            1, 0,
            0.5, 0.5,
        ]
            
        this.primitiveType=this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
