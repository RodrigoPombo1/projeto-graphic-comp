import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyFire extends CGFobject {
  constructor(scene, fire_height = 1, fire_base = 0.5, fire_color = [1.0, 0.3, 0.0]) {
    super(scene);
    this.fire_height = fire_height;
    this.fire_base = fire_base;
    this.fire_color = fire_color;
		this.randomOffset = Math.random() * 10;
		this.offsetY = 0;

    this.initBuffers();
    this.initMaterial();
  }

  initBuffers() {
    this.vertices = [
      0, 0, 0,
      -this.fire_base, 0, 0,
      this.fire_base, 0, 0,
      0, this.fire_height, 0
    ];

    this.indices = [
			0, 1, 3,
			0, 3, 2,
			0, 3, 1,
			0, 2, 3
    ];

    this.normals = [
      0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1
    ];

    this.texCoords = [
      0.5, 1.0,   0.0, 0.0,
      1.0, 0.0,   0.5, 0.5
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  initMaterial() {
    this.fire_material = new CGFappearance(this.scene);
    this.fire_material.setAmbient(...this.fire_color, 1.0);
    this.fire_material.setDiffuse(...this.fire_color, 1.0);
    this.fire_material.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.fire_material.setShininess(10.0);
    this.fire_material.loadTexture("textures/fire_texture.png");
  }

	update(t) {
		const time = t / 1000.0;
		this.offsetY = Math.sin(time * 1.0 + this.randomOffset) * 0.2;
	}

  display() {
    this.scene.pushMatrix();
		this.scene.translate(0, this.offsetY, 0);
		this.fire_material.apply();
		super.display();
		this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, this.offsetY, 0);
    this.scene.rotate(Math.PI / 4, 0, 1, 0);
    super.display();
    this.scene.popMatrix();
  }
}
