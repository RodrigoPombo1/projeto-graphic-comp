import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MySphere } from './MySphere.js';
import { MyCone } from './MyCone.js';
import { MyBucket } from './MyBucket.js';
import { MyWaterDrop } from './MyWaterDrop.js';

export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);

        this.x = 10;
        this.y = 20;
        this.z = -20;
        this.orientation = 0;
        this.speed = 0;
        this.lean_angle = 0;
        this.target_lean = 0;
        this.is_bucket_retracted = false;
        this.bucket_y_position = 0;
        this.state = "flying";
        this.speedFactor = 1.0;
        this.cruiseAltitude = 20;
        this.verticalSpeed = 0;
        this.heliport_height = 20;
        this.lake_height = 3;

        // animation
        this.mainRotorAngle = 0;
        this.tailRotorAngle = 0;

        // for the body of the helicopter
        this.red_material = new CGFappearance(scene);
        this.red_material.setAmbient(0.8, 0, 0, 1);
        this.red_material.setDiffuse(0.8, 0, 0, 1);
        this.red_material.setSpecular(0.5, 0.5, 0.5, 1);
        this.red_material.setShininess(10);

        // orange sphere for exhaust
        this.exhaust_orange_material = new CGFappearance(scene);
        this.exhaust_orange_material.setAmbient(1, 0.5, 0, 1);
        this.exhaust_orange_material.setDiffuse(1, 0.5, 0, 1);
        this.exhaust_orange_material.setSpecular(0.5, 0.5, 0.5, 1);
        this.exhaust_orange_material.setEmission(1, 0.5, 0, 1);
        this.exhaust_orange_material.setShininess(10);

        // rotor material (black)
        this.black_material = new CGFappearance(scene);
        this.black_material.setAmbient(0.1, 0.1, 0.1, 1);
        this.black_material.setDiffuse(0.1, 0.1, 0.1, 1);
        this.black_material.setSpecular(0.5, 0.5, 0.5, 1);
        this.black_material.setShininess(10);

        // cockpit material (glass more or less)
        this.cockpit_material = new CGFappearance(scene);
        this.cockpit_material.setAmbient(0.0, 0.3, 1.0, 1);
        this.cockpit_material.setDiffuse(0.0, 0.3, 1.0, 1);
        this.cockpit_material.setSpecular(0.7, 0.7, 0.7, 1);
        this.cockpit_material.setShininess(20);
        this.cockpit_material.setEmission(0.1, 0.1, 0.1, 1);
        this.cockpit_material.loadTexture("textures/cockpit_texture.png");

        // exhaust cylinder material (grey)
        this.exhaust_cylinder_material = new CGFappearance(scene);
        this.exhaust_cylinder_material.setAmbient(0.5, 0.5, 0.5, 1);
        this.exhaust_cylinder_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.exhaust_cylinder_material.setSpecular(0.5, 0.5, 0.5, 1);
        this.exhaust_cylinder_material.setShininess(10);

        // parts
        this.cone = new MyCone(scene, 16, 8);
        this.cylinder = new MyCylinder(scene, 16, 4);
        this.sphere = new MySphere(scene, 16, 8);
        this.bucket = new MyBucket(scene);

        this.lean_angle = 0;
        this.max_lean_angle = Math.PI / 12;
        this.lean_speed = Math.PI / 60;
        this.target_lean = 0;

        this.is_bucket_retracted = false;
        this.bucket_y_position = 0;
    }

    display() {
        this.scene.pushMatrix();

        // position and orientation
        this.scene.translate(this.x, this.y, this.z);
        this.scene.rotate(this.orientation, 0, 1, 0);

        // lean (pitch) for forward/backward
        this.scene.rotate(this.lean_angle, 1, 0, 0);

        this.red_material.apply();
        
        this.display_cockpit();
        
        this.display_body();

        this.display_exhaust();

        this.display_tail();

        this.display_main_rotor();

        this.display_tail_rotor();

        this.display_landing_gear();

        this.display_landing_gear();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.75);
        this.bucket.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

        
    update(deltaT) {
        // position constants
        const HELIPORT_X = 50;
        const HELIPORT_Z = -50;
        const HELIPORT_Y = 13;
        const HELIPORT_RADIUS = 6;
        
        const LAKE_X = 30;
        const LAKE_Z = 30;
        const LAKE_Y = 2.0;
        const LAKE_RADIUS = 16;

        // check if above heliport or lake
        const above_heliport = (Math.abs(this.x - HELIPORT_X) < HELIPORT_RADIUS && Math.abs(this.z - HELIPORT_Z) < HELIPORT_RADIUS);
        const above_lake = (this.scene.selectedTag !== "tag_5") && (Math.abs(this.x - LAKE_X) < LAKE_RADIUS && Math.abs(this.z - LAKE_Z) < LAKE_RADIUS);

        if (!(this.state === "resting" && above_heliport)) {
            this.mainRotorAngle += 0.3 * this.speedFactor;
            this.tailRotorAngle += 0.6 * this.speedFactor;
        }

        // Smooth lean towards target
        if (Math.abs(this.lean_angle - this.target_lean) > 0.001) {
            if (this.lean_angle < this.target_lean)
                this.lean_angle = Math.min(this.lean_angle + this.lean_speed, this.target_lean);
            else
                this.lean_angle = Math.max(this.lean_angle - this.lean_speed, this.target_lean);
        }


        // bucket
        // if flying or at lake, bucket is extended
        if (this.state === "flying") {
            if (above_heliport && this.bucket.retract_ratio < 1) {
                this.bucket.retract_ratio = Math.min(1, this.bucket.retract_ratio + 0.02 * deltaT);
                this.is_bucket_retracted = false;
            } else if (above_lake) {
                this.bucket.retract_ratio = 1;
                this.is_bucket_retracted = false;
            }
        }
        // landing
        if (this.state === "landing") {
            let target_y = LAKE_Y;
            if (above_heliport) {
                target_y = HELIPORT_Y;
            }

            // if above heliport retract bucket before descending
            if (above_heliport && this.bucket.retract_ratio > 0) {
                this.bucket.retract_ratio = Math.max(0, this.bucket.retract_ratio - 0.02 * deltaT);
                this.is_bucket_retracted = true;
                // wait for bucket to retract before descending
                if (this.bucket.retract_ratio > 0) {
                    return;
                }
            }

            if (above_lake) {
                this.bucket.retract_ratio = 1;
                this.is_bucket_retracted = false;
                if (Math.abs(this.y - LAKE_Y) < 2.0 && this.bucket.retract_ratio === 1) {
                    this.bucket.bucket_has_water = true;
                }
            }

            // descend to target_y
            if (this.y > target_y) {
                this.y -= 0.1 * this.speedFactor * deltaT;
                if (this.y <= target_y) {
                    this.y = target_y;
                    this.state = "resting";
                    if (above_heliport) {
                        this.is_bucket_retracted = true;
                    }
                }
            }
            return;
        }

        // takeoff
        if (this.state === "takingoff") {
            let startY = LAKE_Y;
            if (above_heliport) {
                startY = HELIPORT_Y;
            }
            // If at heliport, keep bucket retracted until at cruise altitude
            if (above_heliport && this.y < this.cruiseAltitude) {
                this.bucket.retract_ratio = 0;
                this.is_bucket_retracted = true;
            }
            // Ascend
            if (this.y < this.cruiseAltitude) {
                this.y += 0.1 * this.speedFactor * deltaT;
                if (this.y >= this.cruiseAltitude) {
                    this.y = this.cruiseAltitude;
                    this.state = "flying";
                }
                return;
            }
            // Once at cruise altitude, extend bucket if at heliport
            if (above_heliport && this.bucket.retract_ratio < 1) {
                this.bucket.retract_ratio = Math.min(1, this.bucket.retract_ratio + 0.02 * deltaT);
                this.is_bucket_retracted = false;
                return;
            }
        }

        // flying
        if (this.state === "flying") {
            this.x += Math.sin(this.orientation) * this.speed * this.speedFactor * deltaT;
            this.z += Math.cos(this.orientation) * this.speed * this.speedFactor * deltaT;
        }

        // resting
        if (this.state === "resting") {
            // If at heliport, keep bucket retracted
            if (above_heliport) {
                this.bucket.retract_ratio = 0;
                this.is_bucket_retracted = true;
            }
        }
    }

    // Control methods
    turn(v) {
        this.orientation += 3 * v * this.speedFactor;
    }

    accelerate(v) {
        this.speed += v * this.speedFactor;
    }

    reset() {
        this.x = 10;
        this.y = 20;
        this.z = -20;
        this.orientation = 0;
        this.speed = 0;
        this.state = "flying";
        this.lean_angle = 0;
        this.target_lean = 0;
        this.is_bucket_retracted = false;
        this.bucket_y_position = 0;
    }

    takeoff() {
        if (this.state === "resting") {
            this.state = "takingoff";
        }
    }

    land() {
        // position constants
        const HELIPORT_X = 50;
        const HELIPORT_Z = -50;
        const HELIPORT_Y = 13;
        const HELIPORT_RADIUS = 6;
        
        const LAKE_X = 30;
        const LAKE_Z = 30;
        const LAKE_Y = 2.0;
        const LAKE_RADIUS = 16;

        // check if above heliport or lake
        const above_heliport = (Math.abs(this.x - HELIPORT_X) < HELIPORT_RADIUS && Math.abs(this.z - HELIPORT_Z) < HELIPORT_RADIUS);
        const above_lake = (this.scene.selectedTag !== "tag_5") && (Math.abs(this.x - LAKE_X) < LAKE_RADIUS && Math.abs(this.z - LAKE_Z) < LAKE_RADIUS);

        if (this.state === "flying" && (above_heliport || above_lake)) {
            this.state = "landing";
        }
    }

    dropWater() {
        if (!this.bucket.bucket_has_water) {
            return;
        }
        // drop water (blue cylinder falling)
        this.scene.waterDrops.push(new MyWaterDrop(this.scene, this.x, this.y - this.bucket.rope_length * this.bucket.retract_ratio - this.bucket.bucket_height, this.z));
        this.bucket.bucket_has_water = false;
    }

    display_cockpit() {
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1.5);
        this.cockpit_material.apply();
        this.scene.scale(0.98, 0.98, 0.98);
        this.sphere.display();
        this.scene.popMatrix();
    }

    display_body() {
        // draw body (cylinder, holds bucket)
        this.scene.pushMatrix();
        this.scene.scale(1, 1, 1.5);
        this.red_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        // draw body connection to tail (cone)
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.red_material.apply();
        this.cone.display();
        this.scene.popMatrix();
    }

    display_exhaust() {
        // draw exhaust small cylinder on back of the cone
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -1);
        this.scene.scale(0.3, 0.3, 0.3);
        this.exhaust_cylinder_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        // draw exhaust sphere at the end of the exhaust cylinder
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.7);
        this.scene.scale(0.25, 0.25, 0.3);
        this.exhaust_orange_material.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }

    display_tail() {
        // draw tail
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, -4.0);
        this.scene.scale(0.2, 0.2, 4.0);
        this.red_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }

    display_main_rotor() {
        // draw main rotor support (vertical cylinder)
        this.scene.pushMatrix();
        this.scene.translate(0, 1.3, 0.75);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.2, 0.2, 0.4);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        // draw main rotor (top center) 2 blades (4 cylinders)
        this.scene.pushMatrix();
        this.scene.translate(0, 1.25, 0.75);
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        this.scene.scale(0.15, 0.05, 3.5);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 1.25, 0.75);
        this.scene.rotate(this.mainRotorAngle, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.15, 0.05, 3.5);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 1.25, 0.75);
        this.scene.rotate(this.mainRotorAngle + (Math.PI / 2), 0, 1, 0);
        this.scene.scale(0.15, 0.05, 3.5);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 1.25, 0.75);
        this.scene.rotate(this.mainRotorAngle + (Math.PI / 2), 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.15, 0.05, 3.5);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        // draw a sphere for the connexion between the blades and the support
        this.scene.pushMatrix();
        this.scene.translate(0, 1.3, 0.75);
        this.scene.scale(0.2, 0.01, 0.2);
        this.black_material.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }

    display_tail_rotor() {
        // draw tail rotor support
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, -4.0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.2, 0.5, 1.0);
        this.red_material.apply();
        this.cone.display();
        this.scene.popMatrix();

        // add sphere to cover the back of the tail rotor support
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, -4.0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.2, 0.1, 1.0);
        this.red_material.apply();
        this.sphere.display();
        this.scene.popMatrix();

        // draw tail rotor wing
        this.scene.pushMatrix();
        this.scene.translate(0, 1.45, -4.0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(0.075, 0.1, 1.0);
        this.red_material.apply();
        this.cone.display();
        this.scene.popMatrix();

        // add sphere to cover the back of the tail rotor wing
        this.scene.pushMatrix();
        this.scene.translate(0, 1.45, -4.0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(0.075, 0.01, 1.0);
        this.red_material.apply();
        this.sphere.display();
        this.scene.popMatrix();

        // draw tail rotor support (vertical cylinder)
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, -4.0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.scale(0.075, 0.1, 0.4);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();


        // draw tail rotor (middle back) 2 blades (4 cylinders)
        this.scene.pushMatrix();
        this.scene.translate(0.35, 0.5, -4.0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.rotate(this.tailRotorAngle, 0, 1, 0);
        this.scene.scale(0.1, 0.05, 0.6);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.35, 0.5, -4.0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.rotate(this.tailRotorAngle, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.1, 0.05, 0.6);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.35, 0.5, -4.0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.rotate(this.tailRotorAngle + (Math.PI / 2), 0, 1, 0);
        this.scene.scale(0.1, 0.05, 0.6);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.35, 0.5, -4.0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.rotate(this.tailRotorAngle + (Math.PI / 2), 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(0.1, 0.05, 0.6);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        // draw a sphere for the connexion between the blades and the support
        this.scene.pushMatrix();
        this.scene.translate(0.40, 0.5, -4.0);
        this.scene.scale(0.01, 0.2, 0.2);
        this.black_material.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }

    display_landing_gear() {
        // draw landing gear (two cylinders connected each by 2 cylinders)
        this.scene.pushMatrix();
        this.scene.translate(-0.7, -1.3, 0.0);
        this.scene.scale(0.05, 0.05, 2.0);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.7, -1.3, 0.0);
        this.scene.scale(0.05, 0.05, 2.0);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        // draw the cylinders connecting the landing gear to the body
        this.scene.pushMatrix();
        this.scene.translate(-0.7, -0.5, 0.3);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.05, 0.05, 0.75);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.7, -0.5, 0.3);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.05, 0.05, 0.75);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.7, -0.5, 1.2);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.05, 0.05, 0.75);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.7, -0.5, 1.2);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.05, 0.05, 0.75);
        this.black_material.apply();
        this.cylinder.display();
        this.scene.popMatrix();
    }
}