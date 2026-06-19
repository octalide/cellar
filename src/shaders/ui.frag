#version 330 core
// blit overlay fragment: vertex color tints the font atlas (white cell = solid fill).
in vec2 vUV;
in vec4 vColor;

uniform sampler2D uTex;

out vec4 FragColor;

void main() {
    FragColor = vColor * texture(uTex, vUV);
}
