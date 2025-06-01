import { CGFobject } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MyCone } from './MyCone.js';
import { MyReverseCone } from './MyReverseCone.js';
import { MySphere } from './MySphere.js';

export class MyBucket extends CGFobject {
    constructor(scene) {
        super(scene);

        this.rope_segments = 3;
        this.rope_length = 2.5;
        this.bucket_has_water = false;
        this.bucket_radius = 0.5;
        this.bucket_height = 0.7;
        this.retract_ratio = 1;

        this.cylinder = new MyCylinder(scene, 12, 2);
        this.cone = new MyCone(scene, 12, 2);
        this.reverse_cone = new MyReverseCone(scene, 12, 2);
        this.sphere = new MySphere(scene, 12, 12);
    }

    display() {
        // rope (made out of segments, 2 on each side)
        for (let side of [-1, 1]) {
            let segmentLength = (this.rope_length * this.retract_ratio) / this.rope_segments;
            for (let i = 0; i < this.rope_segments; i++) {
                this.scene.pushMatrix();
                this.scene.translate(side * 0.4, -segmentLength / 2 - i * segmentLength, 0);
                this.scene.scale(0.07, segmentLength, 0.07);
                this.cylinder.display();
                this.scene.popMatrix();
            }
        }

        // draw bucket (cylinder + cone)
        this.scene.pushMatrix();
        this.scene.translate(0, -this.rope_length * this.retract_ratio - this.bucket_height / 2, 0);
        this.scene.scale(this.bucket_radius, this.bucket_height, this.bucket_radius);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -this.rope_length * this.retract_ratio - this.bucket_height / 2 - this.bucket_height, 0);
        this.scene.scale(this.bucket_radius, -this.bucket_height, this.bucket_radius);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -this.rope_length * this.retract_ratio - (this.bucket_height * 1.5), 0);
        this.scene.scale(this.bucket_radius, this.bucket_height / 2, this.bucket_radius);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.cone.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -this.rope_length * this.retract_ratio - (this.bucket_height * 1.5), 0);
        this.scene.scale(this.bucket_radius, -this.bucket_height / 2, this.bucket_radius);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.reverse_cone.display();
        this.scene.popMatrix();

        // draw water (if full)
        if (this.bucket_has_water) {
            this.scene.pushMatrix();
            this.scene.translate(0, -this.rope_length * this.retract_ratio - this.bucket_height / 2, 0);
            this.scene.scale(this.bucket_radius * 0.85, this.bucket_height * 0.1, this.bucket_radius * 0.85);
            // blue material
            this.scene.setAmbient(0.2, 0.4, 1.0, 1.0);
            this.scene.setDiffuse(0.2, 0.4, 1.0, 1.0);
            this.scene.setSpecular(0.2, 0.4, 1.0, 1.0);
            this.scene.setShininess(10.0);
            this.sphere.display();
            this.scene.popMatrix();
        }
    }
}