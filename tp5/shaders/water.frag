#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

varying vec2 textureCoordsWithOffset;

void main() {
	vec4 color = texture2D(uSampler, textureCoordsWithOffset);
	gl_FragColor = color;
}
