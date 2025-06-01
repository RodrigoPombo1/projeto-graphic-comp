import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';
import { MyFire } from './MyFire.js';

export class MyForest extends CGFobject {
    /**
     * @param {CGFscene} scene
     * @param {number} rows
     * @param {number} columns
     * @param {number} area_width
     * @param {number} area_depth
     * @param {CGFtexture} trunk_texture
     * @param {CGFtexture} leaves_texture
     */
    constructor(scene, rows, columns, area_width, area_depth, trunk_texture, leaves_texture) {
        super(scene);
        this.trees = [];
        this.fires = [];
        for (let current_row = 0; current_row < rows; current_row++) {
            for (let current_column = 0; current_column < columns; current_column++) {
                // random tree parameters
                let tilt_degrees = Math.random() * 10;
                let tilt_axis = Math.random() > 0.5 ? 'X' : 'Z';
                let trunk_radius = 0.1 + Math.random() * 0.1;
                let tree_height = 1.5 + Math.random() * 2.0;
                let green = 0.5 + Math.random() * 0.5;
                let crownColor = [0.1 + Math.random() * 0.2, green, 0.1 + Math.random() * 0.2];

                // random position of the tree within the area (withing the matrix)
                let x_position = (current_column + 0.5 + (Math.random() - 0.5) * 0.5) * (area_width / columns) - area_width / 2;
                let z_position = (current_row + 0.5 + (Math.random() - 0.5) * 0.5) * (area_depth / rows) - area_depth / 2;

                let tree = new MyTree(scene, tilt_degrees, tilt_axis, trunk_radius, tree_height, crownColor, trunk_texture, leaves_texture);
                this.trees.push({ tree, x: x_position, z: z_position });
                if (scene.selectedTag === "tag_6" || scene.selectedTag === "tag_7" || scene.selectedTag === "tag_8") {
                    if (Math.random() < 0.8) {
                        this.fires.push({ x_position, z_position, tree_height, fire: new MyFire(this.scene, 2, 0.4) });
                    }
                }
            }
        }
    }

    display() {
        for (let tree_struct in this.trees) {
            let tree_object = this.trees[tree_struct].tree;
            let x_tree_position = this.trees[tree_struct].x;
            let z_tree_position = this.trees[tree_struct].z;
            this.scene.pushMatrix();
            this.scene.translate(x_tree_position, 0, z_tree_position);
            tree_object.display();
            this.scene.popMatrix();
        }

        for (let { x_position, z_position, tree_height, fire } of this.fires) {
            this.scene.pushMatrix();
            this.scene.translate(x_position, tree_height / 3 + fire.offsetY, z_position);
            fire.display();
            this.scene.popMatrix();
        }
    }
}