import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyWindow } from './MyWindow.js';
import { MyUnitCube } from './MyUnitCube.js';
import { MyQuad } from './MyQuad.js';

export class MyBuilding extends CGFobject {
    /**
     * 
     * @param {CGFscene} scene 
     * @param {number} total_width - Total width of the building (set of the three modules)
     * @param {number} number_floors_lateral_modules - Number of this.number_floors_lateral_modules of side modules
     * @param {number} number_windows_per_floor - Number of windows per floor
     * @param {CGFappearance} window_material - Window material
     * @param {Array} color_building - Color of the building
     */
    constructor(scene, total_width, number_floors_lateral_modules, number_windows_per_floor, window_material, color_building) {
        super(scene);

        this.total_width = total_width;
        this.number_floors_lateral_modules = number_floors_lateral_modules;
        this.number_windows_per_floor = number_windows_per_floor;
        this.window_texture_path = window_material;
        this.color_building = color_building;

        // module sizes
        this.module_width = total_width / 3;
        this.module_width = this.module_width;
        this.side_module_depth = this.module_width * 0.75;
        
        // other sizes
        this.central_module_door_and_sign_floor_height = (this.module_width / number_floors_lateral_modules) * 1.5;
        this.other_floor_sizes = (this.module_width - this.central_module_door_and_sign_floor_height) / number_floors_lateral_modules;
        
        this.central_module_height = this.central_module_door_and_sign_floor_height + this.module_width;
        this.central_module_depth = this.module_width;
        
        // materials
        this.building_wall_material = new CGFappearance(scene);
        this.building_wall_material.setAmbient(color_building[0], color_building[1], color_building[2], 1.0);
        this.building_wall_material.setDiffuse(color_building[0], color_building[1], color_building[2], 1.0);
        this.building_wall_material.setSpecular(color_building[0] * 0.2, color_building[1] * 0.2, color_building[2] * 0.2, 1.0);
        this.building_wall_material.setShininess(10.0);

        this.quad = new MyQuad(scene);
        this.unit_cube = new MyUnitCube(scene);

        // window
        this.window = new MyWindow(scene, window_material);

        // door
        this.door_material = new CGFappearance(scene);
        this.door_material.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.door_material.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.door_material.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.door_material.setShininess(5.0);
        this.door_material.loadTexture("textures/door_texture.jpg");
        this.door_material.setTextureWrap('REPEAT', 'REPEAT');

        // sign
        this.sign_material = new CGFappearance(scene);
        this.sign_material.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.sign_material.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.sign_material.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.sign_material.setShininess(10.0);
        this.sign_material.loadTexture("textures/bombeiros_sign_texture.jpg");
        this.sign_material.setTextureWrap('REPEAT', 'REPEAT');

        // heliport
        this.heliport_material = new CGFappearance(scene);
        this.heliport_material.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.heliport_material.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.heliport_material.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.heliport_material.setShininess(10.0);
        this.heliport_material.loadTexture("textures/heliport_texture.png");
        this.heliport_material.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        // left module
        this.scene.pushMatrix();
        this.scene.translate(-this.module_width, this.module_width / 2, 0);
        this.display_side_module();
        this.scene.popMatrix();

        // central module
        this.scene.pushMatrix();
        this.scene.translate(0, this.central_module_height / 2, this.module_width * 0.125);
        this.display_central_module();
        this.scene.popMatrix();

        // right module
        this.scene.pushMatrix();
        this.scene.translate(this.module_width, this.module_width / 2, 0);
        this.display_side_module();
        this.scene.popMatrix();
    }

    display_side_module() {
        // cube
        this.scene.pushMatrix();
        this.scene.scale(this.module_width, this.module_width, this.side_module_depth);
        this.building_wall_material.apply();
        this.unit_cube.display();
        this.scene.popMatrix();

        // windows
        this.scene.pushMatrix();
        this.scene.translate(0, 0, (this.side_module_depth / 2) + 0.01);
        this.display_windows();
        this.scene.popMatrix();
    }

    display_central_module() {
        // cube
        this.scene.pushMatrix();
        this.scene.scale(this.module_width, this.central_module_height, this.central_module_depth);
        this.building_wall_material.apply();
        this.unit_cube.display();
        this.scene.popMatrix();

        // windows
        this.scene.pushMatrix();
        this.scene.translate(0, this.central_module_door_and_sign_floor_height / 2, (this.central_module_depth / 2) + 0.01);
        this.display_windows();
        this.scene.popMatrix();

        // sign
        this.scene.pushMatrix();
        this.scene.translate(0, -(this.central_module_height / 2) + (this.central_module_door_and_sign_floor_height * 0.8), (this.central_module_depth / 2) + 0.01);
        this.scene.scale(this.module_width * 0.5, this.central_module_door_and_sign_floor_height * 0.3, 1);
        this.sign_material.apply();
        this.quad.display();
        this.scene.popMatrix();

        // door
        this.scene.pushMatrix();
        this.scene.translate(0, -(this.central_module_height / 2) + (this.central_module_door_and_sign_floor_height * 0.3), (this.central_module_depth / 2) + 0.01);
        this.scene.scale(this.module_width * 0.3, this.central_module_door_and_sign_floor_height * 0.6, 1);
        this.door_material.apply();
        this.quad.display();
        this.scene.popMatrix();

        // heliport
        this.scene.pushMatrix();
        this.display_heliport();
        this.scene.popMatrix();

    }

    display_windows() {
        for (let floor = 0; floor < this.number_floors_lateral_modules; floor++) {
            for (let window_count = 0; window_count < this.number_windows_per_floor; window_count++) {
                this.scene.pushMatrix();
                let x_offset = (-this.module_width / 2) + (window_count + 0.5) * (this.module_width / this.number_windows_per_floor);
                let y_offset = (-this.module_width / 2) + (floor + 0.5) * (this.module_width / this.number_floors_lateral_modules);
                this.scene.translate(x_offset, y_offset, 0);
                this.scene.scale((this.module_width / this.number_windows_per_floor) * 0.7, (this.module_width / this.number_floors_lateral_modules) * 0.7, 1);
                this.window.display();
                this.scene.popMatrix();
            }
        }
    }

    display_heliport() {
        this.scene.pushMatrix();
        this.scene.translate(0, (this.central_module_height / 2) + 0.01, 0);
        this.scene.scale(this.module_width, this.module_width, this.module_width);
        this.scene.rotate(-(Math.PI / 2), 1, 0, 0);
        this.heliport_material.apply();
        this.quad.display();
        this.scene.popMatrix();
    }
}