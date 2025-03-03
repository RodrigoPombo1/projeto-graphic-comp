import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            // 4 vertices formando um quandrado no eixo positivo x, sendo que o eixo x passa no meio perpendicularmente
            // para vetores normais da face direita
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            // outros 4 vertices formando um quadrado no eixo negativo x, sendo que o eixo x passa no meio perpendincularmente
            // para vetores normais da face esquerda
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,

            // para vetores normais da face frente
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            // para vetores normais da face atrás
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            // para vetores normais da face em cima
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            // para vetores normais da face em baixo
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // face direita
            0, 1, 2,
            3, 2, 1,
            // face frente
            0, 4, 5,
            1, 0, 5,
            // face esquerda
            6, 5, 4,
            5, 6, 7,
            // face cima
            6, 4, 0,
            0, 2, 6,
            // face baixo
            5, 3, 1,
            5, 7, 3,
            // face traseira
            3, 6, 2,
            6, 3, 7,
        ];

        this.normals = [
            // face direita
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            // face esquerda
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            // face frente
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            // face traseira
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            // face cima
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            // face baixo
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
        ]

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

