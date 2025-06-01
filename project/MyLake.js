import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyLake extends CGFobject {
  constructor(scene, lake_radius = 10, lakeDivs = 50) {
    super(scene);
    this.lake_radius = lake_radius;
    this.lakeDivs = lakeDivs;

    this.water_material = new CGFappearance(this.scene);
    this.water_material.setAmbient(0.2, 0.4, 0.6, 1.0);
    this.water_material.setDiffuse(0.2, 0.5, 0.7, 1.0);
    this.water_material.setSpecular(0.6, 0.9, 1.0, 1.0);
    this.water_material.setShininess(80.0);
    this.water_material.loadTexture("textures/waterTex.jpg");
    this.water_material.setTextureWrap("REPEAT", "REPEAT");

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const angleOffset = 2 * Math.PI / this.lakeDivs;

    // Centro do disco
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i <= this.lakeDivs; i++) {
      const angle = i * angleOffset;
      const x = this.lake_radius * Math.cos(angle);
      const y = this.lake_radius * Math.sin(angle);

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);
      this.texCoords.push(0.5 + 0.5 * Math.cos(angle), 0.5 + 0.5 * Math.sin(angle));

      if (i > 0) {
        this.indices.push(0, i, i + 1);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

	display() {
    this.water_material.apply();
    super.display();
  }
}
