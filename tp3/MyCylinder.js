import {CGFobject} from '../lib/CGF.js';
/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
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
            var current_x_vertex = Math.cos(ang);

            for(var j = 0; j <= this.stacks; j++) {
                this.vertices.push(current_x_vertex, current_y_vertex, j/this.stacks);
                this.normals.push(Math.cos(ang), Math.sin(ang), 0);
                if ((j > 0) && (i != this.slices - 1)) {
                    // this.indices.push(number_vertices_from_previous - 1, number_vertices_from_previous + 1 + this.stacks, number_vertices_from_previous + this.stacks);
                    this.indices.push(number_vertices_from_previous + this.stacks, number_vertices_from_previous + 1 + this.stacks, number_vertices_from_previous - 1);
                    this.indices.push(number_vertices_from_previous + this.stacks + 1, number_vertices_from_previous, number_vertices_from_previous - 1);

                }
                number_vertices_from_previous += 1;
            }
            ang += alphaAng;
        }
        number_vertices_from_previous -= this.stacks;
        for(var j = 0; j < this.stacks; j++) {
            this.indices.push(0 + j, 1 + j, number_vertices_from_previous - 1 + j);
            this.indices.push(1 + j, number_vertices_from_previous + j, number_vertices_from_previous - 1 + j);
        }
        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}
