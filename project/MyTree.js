import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
    /**
     * @param {CGFscene} scene
     * @param {number} tilt_degree - tilt angle in degrees
     * @param {string} tilt_axis - 'X' or 'Z'
     * @param {number} trunk_radius
     * @param {number} tree_height
     * @param {Array} leaf_color - [r,g,b]
     * @param {CGFtexture} trunk_texture
     * @param {CGFtexture} leaf_texture
     */
    constructor(scene, tilt_degree, tilt_axis, trunk_radius, tree_height, leaf_color, trunk_texture, leaf_texture) {
        super(scene);
        this.tilt_degree = tilt_degree;
        this.tiltAxis = tilt_axis;
        this.trunk_radius = trunk_radius;
        this.tree_height = tree_height;
        this.leaf_color = leaf_color;
        this.trunk_texture = trunk_texture;
        this.leaf_texture = leaf_texture;

        // trunk
        this.trunk_height = tree_height * 0.2;
        this.trunk = new MyCone(scene, 12, 16);

        // leaves
        this.all_leaves_height = tree_height * 0.8;
        this.number_leaves_stacks = Math.max(3, Math.round(this.all_leaves_height * 2));
        this.tree_leaves = [];
        for (let i = 0; i < this.number_leaves_stacks; i++) {
            this.tree_leaves.push(new MyPyramid(scene, this.number_leaves_stacks * 2, 1));
        }

        this.trunk_material = new CGFappearance(scene);
        this.trunk_material.setAmbient(0.4, 0.2, 0.05, 1.0);
        this.trunk_material.setDiffuse(0.5, 0.3, 0.1, 1.0);
        this.trunk_material.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.trunk_material.setShininess(5.0);
        this.trunk_material.setTexture(trunk_texture);
        this.trunk_material.setTextureWrap('REPEAT', 'REPEAT');

        this.leaf_material = new CGFappearance(scene);
        this.leaf_material.setAmbient(leaf_color[0], leaf_color[1], leaf_color[2], 1.0);
        this.leaf_material.setDiffuse(leaf_color[0], leaf_color[1], leaf_color[2], 1.0);
        this.leaf_material.setSpecular(leaf_color[0] * 0.1, leaf_color[1] * 0.1, leaf_color[2] * 0.1, 1.0);
        this.leaf_material.setShininess(5.0);
        this.leaf_material.setTexture(leaf_texture);
        this.leaf_material.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        // tilt tree
        this.scene.pushMatrix();
        if (this.tiltAxis === 'X')
            this.scene.rotate(this.tilt_degree * Math.PI / 180, 1, 0, 0);
        else
            this.scene.rotate(this.tilt_degree * Math.PI / 180, 0, 0, 1);

        // trunk
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.scale(this.trunk_radius, this.tree_height * 0.5, this.trunk_radius);
        this.trunk_material.apply();
        this.trunk.display();
        this.scene.popMatrix();

        // leaves
        for (let i = 0; i < this.number_leaves_stacks; i++) {
            this.scene.pushMatrix();
            
            let pyramid_position_ratio = (i / this.number_leaves_stacks) * 1.2; // 1.2 * so that the pyramids "overlap" so there isn't a gap
            let y_leaf_offset = this.trunk_height + (0.5 * pyramid_position_ratio * this.all_leaves_height); // * 0.5 so that the pyramids "overlap" so there isn't a gap
            let scale = 1 - (pyramid_position_ratio * 0.75);
            
            this.scene.rotate(-Math.PI / 2, 1, 0, 0); // rotate leaf so that it's aligned with the trunk
            this.scene.translate(0, 0, y_leaf_offset);
            this.scene.scale((this.trunk_radius * 3 * scale) + this.trunk_radius, (this.trunk_radius * 3 * scale) + this.trunk_radius, this.all_leaves_height / this.number_leaves_stacks);
            this.scene.rotate(Math.PI / 2, 1, 0, 0); // rotate leaf to be upright when displayed
            this.leaf_material.apply();
            this.tree_leaves[i].display();
            
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }
}