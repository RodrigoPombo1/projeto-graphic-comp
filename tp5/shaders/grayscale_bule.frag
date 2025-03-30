#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
varying vec2 uSampler2;


void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    float color_grayscale = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
    gl_FragColor = vec4(color_grayscale, color_grayscale, color_grayscale, 1.0);
}