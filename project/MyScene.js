import { CGFscene, CGFcamera, CGFaxis, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
	constructor() {
		super();
		this.selectedTag = "tag_4"; // default value, will be overwritten by main.js
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
		
		if (this.selectedTag === "tag_2" || this.selectedTag === "tag_3" || this.selectedTag === "tag_4") {
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
		
		if (this.selectedTag === "tag_2" || this.selectedTag === "tag_3" || this.selectedTag === "tag_4") {
			this.plane_material = new CGFappearance(this);
			this.plane_material.setAmbient(0.5, 0.5, 0.5, 1.0);
			this.plane_material.setDiffuse(0.5, 0.5, 0.5, 1.0);
			this.plane_material.setSpecular(0.5, 0.5, 0.5, 1.0);
			this.plane_material.setShininess(10.0);
			this.plane_material.loadTexture("textures/grass_texture.jpg");
			this.plane_material.setTextureWrap("REPEAT", "REPEAT");
		}

		if (this.selectedTag === "tag_3" || this.selectedTag === "tag_4") {
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
		
		if (this.selectedTag === "tag_4") {
			this.trunk_texture = new CGFtexture(this, "textures/wood_texture.jpg");
			this.leaves_texture = new CGFtexture(this, "textures/leaves_texture.jpg");
			this.forest = new MyForest(this, 5, 4, 20, 20, this.trunk_texture, this.leaves_texture);
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
		this.camera = new CGFcamera(
			0.9,
			0.1,
			1000,
			// @ts-ignore
			vec3.fromValues(10, 10, 10),
			// @ts-ignore
			vec3.fromValues(0, 0, 0)
		);
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
	}

	// @ts-ignore
	update(t) {
		this.checkKeys();
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
		this.axis.display();

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

		if (this.selectedTag === "tag_2" || this.selectedTag === "tag_3" || this.selectedTag === "tag_4") {
			this.pushMatrix();
			this.scale(400, 1, 400);
			this.rotate(-Math.PI / 2, 1, 0, 0);
			// this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.plane_material.apply();
			this.plane.display();
			this.popMatrix();
			this.panorama.display();
		}

		if (this.selectedTag === "tag_3" || this.selectedTag === "tag_4") {
			this.pushMatrix();
			this.scale(5, 5, 5);
			this.translate(10, 0, -10);
			this.building.display();
			this.popMatrix();
		}

		if (this.selectedTag === "tag_3" || this.selectedTag === "tag_4") {
			this.pushMatrix();
			this.translate(-10, 0, 10); // position the forest as needed
			this.forest.display();
			this.popMatrix();
		}
	}
}
