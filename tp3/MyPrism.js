import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        var number_vertices_from_previous = 0;
        for(var i = 0; i < this.slices; i++){
            var current_y_vertex = Math.sin(ang);
            var next_y_vertex = Math.sin(ang+alphaAng);
            var current_x_vertex = Math.cos(ang);
            var next_x_vertex = Math.cos(ang+alphaAng);

            for(var j = 0; j <= this.stacks; j++) {
                this.vertices.push(current_x_vertex, current_y_vertex, j/this.stacks);
                this.vertices.push(next_x_vertex, next_y_vertex, j/this.stacks);
                
                this.normals.push(Math.cos(ang + (alphaAng/2)), Math.sin(ang + (alphaAng/2)), 0);
                this.normals.push(Math.cos(ang + (alphaAng/2)), Math.sin(ang + (alphaAng/2)), 0);
                
                if (j > 0) {
                    this.indices.push(number_vertices_from_previous - 2, number_vertices_from_previous - 1, number_vertices_from_previous);
                    this.indices.push(number_vertices_from_previous - 1, number_vertices_from_previous + 1, number_vertices_from_previous);
                }
                number_vertices_from_previous += 2;
            }
            ang += alphaAng;
        }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
