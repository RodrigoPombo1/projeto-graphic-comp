import { CGFobject } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';

export class MyWaterDrop extends CGFobject {
    constructor(scene, x, y, z) {
        super(scene);
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = 0;
        this.speed = 0.15;
        this.radius = 0.3;
        this.height = 0.7;
        this.start_y = y;
        this.max_radius = 2.0;
        this.max_height = 8.0;
        this.sphere = new MySphere(scene, 24, 12);
        this.active = true;
    }

    update(delta_t) {
        this.t += delta_t;

        let fall_progress = Math.min(1, (this.start_y - this.y) / this.start_y);
        let currentHeight = this.height + (this.max_height - this.height) * fall_progress;

        this.y -= this.speed * delta_t;

        if ((this.y + currentHeight / 2) <= 0) {
            this.y = - currentHeight / 2;
            this.active = false;
        }
    }

    display() {
        if (!this.active && this.y !== 0) {
            return;
        }

        let fall_progress = Math.min(1, (this.start_y - this.y) / this.start_y);

        let current_radius = this.radius + (this.max_radius - this.radius) * fall_progress;
        let currentHeight = this.height + (this.max_height - this.height) * fall_progress;

        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(current_radius, current_radius, currentHeight);
        this.scene.setAmbient(0.2, 0.4, 1.0, 1.0);
        this.scene.setDiffuse(0.2, 0.4, 1.0, 1.0);
        this.scene.setSpecular(0.2, 0.4, 1.0, 1.0);
        this.scene.setShininess(10.0);
        this.sphere.display();
        this.scene.popMatrix();
    }
}