#version 330 core
// blit overlay vertex: pixel-space position (loc 0), atlas uv (loc 1), color (loc 2).
layout (location = 0) in vec2 aPos;
layout (location = 1) in vec2 aUV;
layout (location = 2) in vec4 aColor;

uniform vec2 uScreen;

out vec2 vUV;
out vec4 vColor;

void main() {
    // pixel coords (origin top-left) to clip space, y flipped
    gl_Position = vec4(aPos.x / uScreen.x * 2.0 - 1.0, 1.0 - aPos.y / uScreen.y * 2.0, 0.0, 1.0);
    vUV = aUV;
    vColor = aColor;
}
