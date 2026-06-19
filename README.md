# cellar

An interactive cellular-automata editor and visualizer in [Mach][mach], rendered
with [`mach-gl`][mach-gl] / [`mach-glfw`][mach-glfw] and an immediate-mode UI from
[`blit`][blit].

A double-buffered, toroidal grid runs a weighted outer-totalistic kernel on the
CPU and is drawn as screen-space quads. The control panel rides the same vertex
stream, shader, and texture as the grid, so the whole frame is one draw call's
worth of state.

A kernel is a `(2r+1)x(2r+1)` integer-weight footprint plus birth/survive
bitmasks over the saturated weighted neighbor-sum, so it generalizes
Larger-than-Life while still expressing the classic Life family exactly.

## Controls

| input        | action                          |
|--------------|---------------------------------|
| `space`      | play / pause                    |
| `S`          | single step                     |
| `C`          | clear                           |
| `R`          | randomize                       |
| `M`          | cycle color mode                |
| left mouse   | draw cells                      |
| right mouse  | drag to pan                     |
| scroll       | zoom                            |
| arrow keys   | pan                             |
| `Tab`        | hide / show the UI              |
| `F11`        | toggle borderless fullscreen    |
| `Esc`        | quit                            |

The on-screen panel mirrors the core actions: a `running` toggle, step / clear /
randomize buttons, and a speed (steps per second) slider. Color modes are solid,
heat (fading trails), and an age-driven sin palette.

Built-in kernels: Conway's life (`B3/S23`), HighLife (`B36/S23`), Seeds (`B2/S`),
and Day & Night (`B3678/S34678`).

## Build & run

Requires the [Mach toolchain][mach].

```
git clone https://github.com/octalide/cellar
cd cellar
mach dep pull   # vendor mach-std, mach-glfw, mach-gl, and blit into dep/
mach build      # compile
mach run        # launch from the project root (shaders load by relative path)
mach test       # grid / kernel / sim / persist / config unit tests
```
