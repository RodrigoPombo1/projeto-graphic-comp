attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D waterMap;

uniform float normScale;
uniform float timeFactor;

varying vec2 vTextureCoord;
varying vec2 textureCoordsWithOffset;


void main() {
	vTextureCoord = aTextureCoord;

	float waveHeight = 0.5;
    float waveLength = 0.1;
	float speedControl = 0.001;

    textureCoordsWithOffset = vec2(timeFactor * speedControl) + vTextureCoord * waveLength;

    vec3 offset = vec3(0, 0, texture2D(waterMap, textureCoordsWithOffset).b * waveHeight);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}
