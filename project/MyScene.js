import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { MyLake } from "./MyLake.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
	constructor() {
		super();
		this.selectedTag = "tag_6"; // default value, will be overwritten by main.js
	}

	init(application){
		super.init(application);

		console.log("Current tag:", this.selectedTag);

		this.initCameras();
		this.initLights();

		//Background color
		this.gl.clearColor(0, 0, 0, 1.0);

		this.gl.clearDepth(100.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.enableTextures(true);

		this.setUpdatePeriod(50);

		//Initialize scene objects
		this.axis = new CGFaxis(this, 20, 1);
		if (this.selectedTag === "tag_1") {
			this.sphere = new MySphere(this, 32, 16);
		}
		
		if (this.selectedTag === "tag_2" || this.selectedTag === "tag_3" || this.selectedTag === "tag_4" || this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.plane = new MyPlane(this, 64);
			this.panorama = new MyPanorama(this);
		}
		
		//Initialize materials
		if (this.selectedTag === "tag_1") {
			this.sphere_material = new CGFappearance(this);
			this.sphere_material.setAmbient(0.5, 0.5, 0.5, 1.0);
			this.sphere_material.setDiffuse(0.5, 0.5, 0.5, 1.0);
			this.sphere_material.setSpecular(0.5, 0.5, 0.5, 1.0);
			this.sphere_material.setEmission(1.0, 1.0, 1.0, 1.0); // TODO REMOVE DEBUG ONLY
			this.sphere_material.setShininess(10.0);
			this.sphere_material.loadTexture("textures/earth_texture.jpg");
			this.sphere_material.setTextureWrap("REPEAT", "REPEAT");
		}
		
		if (this.selectedTag === "tag_2" || this.selectedTag === "tag_3" || this.selectedTag === "tag_4" || this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.plane_material = new CGFappearance(this);
			this.plane_material.setAmbient(0.5, 0.5, 0.5, 1.0);
			this.plane_material.setDiffuse(0.5, 0.5, 0.5, 1.0);
			this.plane_material.setSpecular(0.5, 0.5, 0.5, 1.0);
			this.plane_material.setShininess(10.0);
			this.plane_material.loadTexture("textures/grass_texture.jpg");
			this.plane_material.setTextureWrap("REPEAT", "REPEAT");
		}

		if (this.selectedTag === "tag_3" || this.selectedTag === "tag_4" || this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			let building_color = [1.0, 1.0, 1.0];
			this.window_material = new CGFappearance(this);
			this.window_material.setAmbient(building_color[0], building_color[1], building_color[2], 1.0);
			this.window_material.setDiffuse(building_color[0], building_color[1], building_color[2], 1.0);
			this.window_material.setSpecular(building_color[0] * 0.2, building_color[1] * 0.2, building_color[2] * 0.2, 1.0);
			this.window_material.setShininess(10.0);
			this.window_material.loadTexture("textures/window_texture.png");
			this.window_material.setTextureWrap("REPEAT", "REPEAT");
			
			this.building = new MyBuilding(this, 5, 4, 4, this.window_material, [1.0, 1.0, 1.0]);
		}
		
		if (this.selectedTag === "tag_4" || this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.trunk_texture = new CGFtexture(this, "textures/wood_texture.jpg");
			this.leaves_texture = new CGFtexture(this, "textures/leaves_texture.jpg");
			this.forest = new MyForest(this, 5, 4, 20, 20, this.trunk_texture, this.leaves_texture);
		}

		if (this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.heli = new MyHeli(this);
			this.waterDrops = [];
		}

		if (this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.lake = new MyLake(this, 16, 40);
		}

		//Objects connected to MyInterface
		
		return true;
	}

	initLights() {
		this.lights[0].setPosition(200, 200, 200, 1);
		this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[0].enable();
		this.lights[0].update();
	}

	initCameras() {
		if (this.selectedTag === "tag_1") {
			this.camera = new CGFcamera(
				0.9,
				0.1,
				1000,
				// @ts-ignore
				vec3.fromValues(30, 30, 30), // eye position
				// @ts-ignore
				vec3.fromValues(0, 0, 0) // look at center of the sphere
			);
		}

		if (this.selectedTag === "tag_2") {
			this.camera = new CGFcamera(
				0.9,
				0.1,
				1000,
				// @ts-ignore
				vec3.fromValues(30, 30, 30), // eye position
				// @ts-ignore
				vec3.fromValues(10, 10, -10) // look at center of the plane
			);
		}

		if (this.selectedTag === "tag_3") {
			this.camera = new CGFcamera(
				0.9,
				0.1,
				1000,
				// @ts-ignore
				vec3.fromValues(30, 20, -20),
				// @ts-ignore
				vec3.fromValues(50, 10, -50)
			);
		}

		if (this.selectedTag === "tag_4") {
			this.camera = new CGFcamera(
				0.9,
				0.1,
				1000,
				// @ts-ignore
				vec3.fromValues(30, 30, 40),
				// @ts-ignore
				vec3.fromValues(20, 10, 0)
			);
		}
		// @ts-ignore
		if (this.selectedTag === "tag_5") {
			this.camera = new CGFcamera(
			0.9,
			0.1,
			1000,
			// @ts-ignore
			vec3.fromValues(30, 30, 30), // eye position
			// @ts-ignore
			vec3.fromValues(10, 0, -10) 
			);
		};
		// @ts-ignore
		if (this.selectedTag === "tag_6") {
			this.camera = new CGFcamera(
			0.9,
			0.1,
			1000,
			// @ts-ignore
			vec3.fromValues(30, 30, 30), // eye position
			// @ts-ignore
			vec3.fromValues(10, 0, -10) // look at heliport
			);
		};
		// @ts-ignore
		if (this.selectedTag === "tag_7") {
			this.camera = new CGFcamera(
			0.9,
			0.1,
			1000,
			// @ts-ignore
			vec3.fromValues(30, 30, 30), // eye position
			// @ts-ignore
			vec3.fromValues(10, 0, -10)
			);
		};
		// @ts-ignore
		if (this.selectedTag === "tag_8") {
			this.camera = new CGFcamera(
			0.9,
			0.1,
			1000,
			// @ts-ignore
			vec3.fromValues(30, 30, 30), // eye position
			// @ts-ignore
			vec3.fromValues(10, 0, -10)
			);
		};
	}

	checkKeys() {
		var text = "Keys pressed: ";
		var keysPressed = false;

		// Check for key codes e.g. in https://keycode.info/
		// @ts-ignore
		if (this.gui.isKeyPressed("KeyW")) {
			text += " W ";
			keysPressed = true;
		}

		// @ts-ignore
		if (this.gui.isKeyPressed("KeyS")) {
			text += " S ";
			keysPressed = true;
		}
		if (keysPressed)
			console.log(text);

		if (this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			// @ts-ignore
			if (this.gui.isKeyPressed("KeyW")) {
				this.heli.target_lean = this.heli.max_lean_angle;
				this.heli.accelerate(0.01);
			}
			// @ts-ignore
			else if (this.gui.isKeyPressed("KeyS")) {
			this.heli.accelerate(-0.01);
			this.heli.target_lean = -this.heli.max_lean_angle;
			}
			else {
				this.heli.target_lean = 0;
			}
			// @ts-ignore
			if (this.gui.isKeyPressed("KeyA")) this.heli.turn(0.02);
			// @ts-ignore
			if (this.gui.isKeyPressed("KeyD")) this.heli.turn(-0.02);
			// @ts-ignore
			if (this.gui.isKeyPressed("KeyR")) this.heli.reset();
			// @ts-ignore
			if (this.gui.isKeyPressed("KeyP")) this.heli.takeoff();
			// @ts-ignore
			if (this.gui.isKeyPressed("KeyL")) this.heli.land();
			// @ts-ignore
			if (this.gui.isKeyPressed("KeyO")) {
				this.heli.dropWater();
			}
		}
	}

	// @ts-ignore
	update(t) {
   		this.checkKeys();
		if (this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			if (!this.lastUpdateTime) {
				this.lastUpdateTime = t;
			}
			let deltaT = (t - this.lastUpdateTime) / 10.0;

			this.heli.update(deltaT);

			if (this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
				// --- FIRE REMOVAL LOGIC MOVED HERE ---
				for (let drop of this.waterDrops) {
					if (!(drop.active)) {
						continue;
					}
					drop.update(deltaT);
					// If drop just became inactive, check for fire
					if (drop.active) {
						continue;
					}
					for (let i = 0; i < this.forest.fires.length; i++) {
						let fire_object = this.forest.fires[i];
						let fireWorldX = -15 + 2.0 * fire_object.x_position;
						let fireWorldZ = -10 + 2.0 * fire_object.z_position;
						let diference_x_position = fireWorldX - drop.x;
						let diference_z_position = fireWorldZ - drop.z;
						if (!(Math.sqrt(diference_x_position * diference_x_position + diference_z_position * diference_z_position) < 10.0)) {
							continue;
						}
						this.forest.fires.splice(i, 1);
						console.log("Fire extinguished by water drop at", drop.x, drop.z);
						break;
					}
				}
				// Now remove inactive drops
				this.waterDrops = this.waterDrops.filter(drop => drop.active);

				for (let { fire } of this.forest.fires) {
					fire.update(t);
				}
			}
			this.lastUpdateTime = t;
		}
	}

	setDefaultAppearance() {
		this.setAmbient(0.5, 0.5, 0.5, 1.0);
		this.setDiffuse(0.5, 0.5, 0.5, 1.0);
		this.setSpecular(0.5, 0.5, 0.5, 1.0);
		this.setShininess(10.0);
	}

	display() {
		// ---- BEGIN Background, camera and axis setup
		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		// Initialize Model-View matrix as identity (no transformation
		this.updateProjectionMatrix();
		this.loadIdentity();
		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();
		
		this.lights[0].update();

		// Draw axis
		// this.axis.display();

		this.setDefaultAppearance();

		// this.scale(400, 400, 400);
		
		if (this.selectedTag === "tag_1") {	
			this.pushMatrix();
			this.scale(20, 20, 20);
			this.sphere_material.apply();
			this.sphere.display();
			this.popMatrix();
			// this.sphere.enableNormalViz();
		}

		if (this.selectedTag === "tag_2" || this.selectedTag === "tag_3" || this.selectedTag === "tag_4" || this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.pushMatrix();
			this.scale(400, 1, 400);
			this.rotate(-Math.PI / 2, 1, 0, 0);
			this.plane_material.apply();
			this.plane.display();
			this.popMatrix();

			this.panorama.display();
		}

		if (this.selectedTag === "tag_3" || this.selectedTag === "tag_4" || this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.pushMatrix();
			this.scale(5, 5, 5);
			this.translate(10, 0, -10);
			this.building.display();
			this.popMatrix();
		}

		if (this.selectedTag === "tag_4" || this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.pushMatrix();
			this.translate(-15, 0, -10);
			this.scale(2.0, 2.0, 2.0);
			this.forest.display();
			this.popMatrix();
		}

		if (this.selectedTag === "tag_5" || this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.pushMatrix();
			this.translate(0, 0, 0);
			this.heli.display();
			this.popMatrix();
		}

		if (this.selectedTag === "tag_6" || this.selectedTag === "tag_7" || this.selectedTag === "tag_8") {
			this.pushMatrix();
			this.translate(30, 0.1, 30);
			this.rotate(-Math.PI / 2, 1, 0, 0);
			this.lake.display();
			this.popMatrix();

			for (let drop of this.waterDrops) {
				drop.display();
				if (drop.active) continue;
				if (!(this.forest && (this.forest.fires.length > 0))) continue;

				console.log("Checking drop at", drop.x, drop.z);
				for (let fireObj of this.forest.fires) {
					let fireWorldX = -15 + 2.0 * fireObj.x_position;
					let fireWorldZ = -10 + 2.0 * fireObj.z_position;
					console.log("Fire at", fireWorldX, fireWorldZ);
				}

				let fireIndex = -1;
				for (let i = 0; i < this.forest.fires.length; i++) {
					let fireObj = this.forest.fires[i];
					let fireWorldX = -15 + 2.0 * fireObj.x_position;
					let fireWorldZ = -10 + 2.0 * fireObj.z_position;
					let dx = fireWorldX - drop.x;
					let dz = fireWorldZ - drop.z;
					if (Math.sqrt(dx * dx + dz * dz) < 10.0) {
						fireIndex = i;
						break;
					}
				}
				if (fireIndex !== -1) {
					this.forest.fires.splice(fireIndex, 1);
					console.log("Fire extinguished at", drop.x, drop.z);
				}
			}
			this.waterDrops = this.waterDrops.filter(drop => drop.active);
		}
	}
}
