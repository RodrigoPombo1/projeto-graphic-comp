import {CGFobject} from '../lib/CGF.js';
/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MySphere extends CGFobject {
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
        this.texCoords = [];

        let stacks_angle = 0;
        let stacks_alpha_angle = Math.PI / (this.stacks * 2); // 2 * stacks because 1 is only for a demi-sphere
        let slices_alpha_angle = (2 * Math.PI) / this.slices;

        // Add north pole vertex (since since the first stack layer have to be a triangle, we only want one vertex at the top)
        this.vertices.push(0, 1, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0);
        
        // Stacks
        for(let i = 0; i <= (this.stacks * 2) - 1; i++) { // 2 * stacks because 1 is only for a demi-sphere
            let current_y_vertex = Math.cos(stacks_angle);
            let vertical_texture_coord = i / (this.stacks * 2);

            // Slices
            let slices_angle = 0;
            for(let j = 0; j <= this.slices; j++){
                let current_x_vertex = Math.sin(stacks_angle) * Math.cos(slices_angle);
                let current_z_vertex = Math.sin(stacks_angle) * Math.sin(slices_angle);
                let horizontal_texture_coord = 1 - (j / this.slices);

                this.vertices.push(current_x_vertex, current_y_vertex, current_z_vertex);
                this.normals.push(current_x_vertex, current_y_vertex, current_z_vertex);
                this.texCoords.push(horizontal_texture_coord, vertical_texture_coord);

                slices_angle += slices_alpha_angle;
            }

            stacks_angle += stacks_alpha_angle;
        }

        // Add south pole vertex (since the last stack layer will have to be a triangle, we only want one vertex at the bottom)
        this.vertices.push(0, -1, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 1);


        //////////// Indices //////////

        // Indice for the north pole (the slice layer of the first stack)
        for (let j = 0; j < this.slices; j++) {
            this.indices.push(0, j + 1, j + 2);
        }

        for(let i = 0; i < (this.stacks * 2) - 1; i++) { // 2 * stacks because 1 is only for a demi-sphere
            for (let j = 0; j < this.slices; j++) {
                let start = i * (this.slices + 1) + j + 1; // offset because of the north pole indice
                let end = start + this.slices + 1;
                
                this.indices.push(start, end + 1, end);
                this.indices.push(start, start + 1, end + 1);
            }
        }

        // Indice for the south pole (the slice layer of the last stack)
        let last_vertex = this.vertices.length / 3 - 1;
        let last_stack_vertex_start = last_vertex - this.slices - 1;
        for (let j = 0; j < this.slices; j++) {
            this.indices.push(last_vertex, last_stack_vertex_start + j + 1, last_stack_vertex_start + j + 2);
        }

        // this.indices = this.indices.slice(this.indices.length - (this.slices * 3), this.indices.length);

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.setLineMode();

        this.initGLBuffers();
    }

    setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
	}

	setLineMode() 
	{ 
		this.primitiveType=this.scene.gl.LINES;
	};
}
