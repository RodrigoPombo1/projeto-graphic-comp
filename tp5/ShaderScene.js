import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { Teapot } from "./Teapot.js";
import { MyPlane } from "./MyPlane.js";

/**
 * getStringFromUrl(url)
 * Function to load a text file from a URL (used to display shader sources)
 */

function getStringFromUrl(url) {
	var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", url, false);
    xmlHttpReq.send();
    return xmlHttpReq.responseText;
}

/**
 * MyScene
 * @constructor
 */
export class ShaderScene extends CGFscene {
	constructor() {
		super();
		this.texture = null;
		this.appearance = null;

		// initial configuration of interface
		this.selectedObject = 1;
		this.wireframe = false;
		this.selectedExampleShader = 11;
		this.showShaderCode = false;
		// this.selectedTexture = 3;
		// this.additionalTexture = null;
		// this.selectedAdditionalTexture = 4;

		this.scaleFactor = 16.0;
	}

	init(application) {
		// main initialization
		super.init(application);

		this.initCameras();

		this.initLights();

		this.gl.clearDepth(10000.0);
		this.gl.clearColor(1, 1, 1, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.depthFunc(this.gl.LEQUAL);

		// objects initialization

		this.axis = new CGFaxis(this);
		this.enableTextures(true);

		this.objects=[
			new Teapot(this),
			new MyPlane(this, 50)
		];

		// Object interface variables
		this.objectList = {
			'Teapot': 0,
			'Plane': 1
		}

		// Materials and textures initialization

		this.appearance = new CGFappearance(this);
		this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
		this.appearance.setShininess(120);

		// this.texture = new CGFtexture(this, "textures/texture.jpg");
		this.texture = new CGFtexture(this, "textures/waterTex.jpg");
		this.appearance.setTexture(this.texture);
		this.appearance.setTextureWrap('REPEAT', 'REPEAT');

		// this.texture2 = new CGFtexture(this, "textures/FEUP.jpg");
		this.texture2 = new CGFtexture(this, "textures/waterMap.jpg");

		// this.textures = [
		// 	this.texture = new CGFtexture(this, "textures/texture.jpg"), // 0
		// 	this.texture2 = new CGFtexture(this, "textures/FEUP.jpg"), // 1
		// 	this.terrainMap = new CGFtexture(this, "textures/terrainMap.jpg"), // 2
		// 	this.waterTex = new CGFtexture(this, "textures/waterTex.jpg"), // 3
		// 	this.waterMap = new CGFtexture(this, "textures/waterMap.jpg"), // 4
		// ];


		// this.textureList = {
		// 	"Texture": 0,
		// 	"FEUP": 1,
		// 	"Terrain Map": 2,
		// 	"WaterTex": 3,
		// 	"WaterMap": 4,
		// }

		// this.onSelectedTexture1Changed(this.selectedTexture);

		// shaders initialization

		this.testShaders = [
			new CGFshader(this.gl, "shaders/flat.vert", "shaders/flat.frag"), // 0 Flat shading
			new CGFshader(this.gl, "shaders/uScale.vert", "shaders/uScale.frag"), // 1 Passing a scale as uniform
			new CGFshader(this.gl, "shaders/varying.vert", "shaders/varying.frag"), // 2 Passing a varying parameter from VS -> FS
			new CGFshader(this.gl, "shaders/texture1.vert", "shaders/texture1.frag"), // 3 Simple texturing
			new CGFshader(this.gl, "shaders/texture2.vert", "shaders/texture2.frag"), // 4 Multiple textures in the FS
			new CGFshader(this.gl, "shaders/texture3.vert", "shaders/texture3.frag"), // 5 Multiple textures in VS and FS
			new CGFshader(this.gl, "shaders/texture3anim.vert", "shaders/texture3anim.frag"), // 6 Animation example
			new CGFshader(this.gl, "shaders/texture1.vert", "shaders/sepia.frag"), // 7 Sepia
			new CGFshader(this.gl, "shaders/texture1.vert", "shaders/convolution.frag"), // 8 Convolution
			new CGFshader(this.gl, "shaders/color_bule.vert", "shaders/color_bule.frag"), // 9 Color bule
			new CGFshader(this.gl, "shaders/color_bule.vert", "shaders/grayscale_bule.frag"), // 10 Grayscale
			new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag"), // 11 Water
		];

		// additional texture will have to be bound to texture unit 1 later, when using the shader, with "this.texture2.bind(1);"
		this.testShaders[4].setUniformsValues({ uSampler2: 1 });
		this.testShaders[5].setUniformsValues({ uSampler2: 1 });
		this.testShaders[6].setUniformsValues({ uSampler2: 1 });
		this.testShaders[6].setUniformsValues({ timeFactor: 0 });


		// Shaders interface variables

		this.shadersList = {
			'Flat Shading': 0,
			'Passing a scale as uniform': 1,
			'Passing a varying parameter from VS -> FS': 2,
			'Simple texturing': 3,
			'Multiple textures in the FS': 4,
			'Multiple textures in VS and FS': 5,
			'Animation example': 6,
			'Sepia': 7,
			'Convolution': 8,
			'Color bule': 9,
			'Grayscale bule': 10,
			'Water': 11,
		};

		// shader code panels references
		this.shadersDiv = document.getElementById("shaders");
		this.vShaderDiv = document.getElementById("vshader");
		this.fShaderDiv = document.getElementById("fshader");

		// force initial setup of shader code panels

		this.onShaderCodeVizChanged(this.showShaderCode);
		this.onSelectedShaderChanged(this.selectedExampleShader);
		// this.onSelectedTexture1Changed(this.selectedTexture);
		// this.onSelectedTexture2Changed(this.additionalTexture);


		// set the scene update period 
		// (to invoke the update() method every 50ms or as close as possible to that )
		this.setUpdatePeriod(50);


		return true;
	};

	// configure cameras
	initCameras() {
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(20, 20, 100), vec3.fromValues(0, 0, 0));
	};
	
	// initialize lights
	initLights() {

		if (this.lights.length > 0) {
			this.lights[0].setPosition(0, 0, 10, 1);
			this.lights[0].setAmbient(0.2, 0.2, 0.2, 1);
			this.lights[0].setDiffuse(0.9, 0.9, 1.0, 1);
			this.lights[0].setSpecular(0, 0, 0, 1);
			this.lights[0].enable();
			this.lights[0].update();
		}
	};

	// Interface event handlers

	// Show/hide shader code
	onShaderCodeVizChanged(v) {
		if (v)
			this.shadersDiv.style.display = "block";
		else
			this.shadersDiv.style.display = "none";
	}

	// Called when selected shader changes
	onSelectedShaderChanged(v) {
		// update shader code
		this.vShaderDiv.innerHTML = "<xmp>" + getStringFromUrl(this.testShaders[v].vertexURL) + "</xmp>";
		this.fShaderDiv.innerHTML = "<xmp>" + getStringFromUrl(this.testShaders[v].fragmentURL) + "</xmp>";

		// update scale factor
		this.onScaleFactorChanged(this.scaleFactor);
	}

	// onSelectedTexture1Changed(v) {
	// 	switch (v) {
	// 		case 0:
	// 			this.appearance.setTexture(this.texture);
	// 			this.appearance.setTextureWrap('REPEAT', 'REPEAT');
	// 			break;
	// 		case 1:
	// 			this.appearance.setTexture(this.texture2);
	// 			break;
	// 		case 2:
	// 			this.appearance.setTexture(this.waterMap);
	// 			this.appearance.setTextureWrap('REPEAT', 'REPEAT');
	// 			break;
	// 		case 3:
	// 			this.appearance.setTexture(this.waterTex);
	// 			this.appearance.setTextureWrap('REPEAT', 'REPEAT');
	// 			break;
	// 		case 4:
	// 			this.appearance.setTexture(this.waterMap);
	// 			this.appearance.setTextureWrap('REPEAT', 'REPEAT');
	// 			break;
	// 	}
	// 	this.appearance.apply();
	// }

	// onSelectedTexture2Changed(v) {
	// 	switch (v) {
	// 		case 0:
	// 			this.additionalTexture = this.texture;
	// 			break;
	// 		case 1:
	// 			this.additionalTexture = this.texture2;
	// 			break;
	// 		case 2:
	// 			this.additionalTexture = this.waterMap;
	// 			break;
	// 		case 3:
	// 			this.additionalTexture = this.waterTex;
	// 			break;
	// 		case 4:
	// 			this.additionalTexture = this.waterMap;
	// 			break;
	// 	}
	// }

	// called when a new object is selected
	onSelectedObjectChanged(v) {
		// update wireframe mode when the object changes
		this.onWireframeChanged(this.wireframe);
	}

	// updates the selected object's wireframe mode
	onWireframeChanged(v) {
		if (v)
			this.objects[this.selectedObject].setLineMode();
		else
			this.objects[this.selectedObject].setFillMode();

	}

	// called when the scale factor changes on the interface
	onScaleFactorChanged(v) {
		this.testShaders[this.selectedExampleShader].setUniformsValues({ normScale: this.scaleFactor });
	}

	// called periodically (as per setUpdatePeriod() in init())
	update(t) {
		// only shader 6 is using time factor
		if (this.selectedExampleShader == 6)
			// Dividing the time by 100 "slows down" the variation (i.e. in 100 ms timeFactor increases 1 unit).
			// Doing the modulus (%) by 100 makes the timeFactor loop between 0 and 99
			// ( so the loop period of timeFactor is 100 times 100 ms = 10s ; the actual animation loop depends on how timeFactor is used in the shader )
			this.testShaders[6].setUniformsValues({ timeFactor: t / 100 % 100 });
			this.testShaders[11].setUniformsValues({ timeFactor: t / 100 % 100 });
	}

	// main display function
	display() {
		// Clear image and depth buffer every time we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


		// Initialize Model-View matrix as identity (no transformation)
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Update all lights used
		this.lights[0].update();

		// Draw axis
		this.axis.display();

		// aplly main appearance (including texture in default texture unit 0)
		this.appearance.apply();

		// activate selected shader
		this.setActiveShader(this.testShaders[this.selectedExampleShader]);
		this.pushMatrix();

		// bind additional texture to texture unit 1
		// this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
		this.texture2.bind(1);
		// this.additionalTexture[this.selectedAdditionalTexture].bind(1);


		if (this.selectedObject==0) {
			// teapot (scaled and rotated to conform to our axis)

			this.pushMatrix();
	
			this.translate(0, -6, 0);
			this.scale(0.5, 0.5, 0.5);
			this.rotate(-Math.PI / 2, 1, 0, 0);
			this.objects[0].display();
	
			this.popMatrix();
		}
		else {
			this.pushMatrix();
			
			this.scale(25, 25, 25);
			this.objects[1].display();
			
			this.popMatrix();
		}

		// restore default shader (will be needed for drawing the axis in next frame)
		this.setActiveShader(this.defaultShader);
	}
}