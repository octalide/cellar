# cellar

An interactive cellular-automata editor and visualizer written in
[Mach](https://github.com/briar-systems/mach), built on the
[boom](https://github.com/briar-systems/boom) engine with an immediate-mode UI
from [blit](https://github.com/briar-systems/blit).

A double-buffered, toroidal grid runs a weighted outer-totalistic kernel on the
CPU. boom owns the window, input, Vulkan renderer and frame loop; the grid and
the control windows are one blit draw list, submitted through a single overlay
pass each frame.

A kernel is a `(2r+1)x(2r+1)` integer-weight footprint plus birth and survive
bitmasks over the saturated weighted neighbor sum, so it generalizes
Larger-than-Life while still expressing the classic Life family exactly.
Built-in kernels: Conway's Life (`B3/S23`), HighLife (`B36/S23`), Seeds
(`B2/S`) and Day & Night (`B3678/S34678`).

## Controls

| input       | action                       |
|-------------|------------------------------|
| `space`     | play / pause                 |
| `S`         | single step                  |
| `C`         | clear                        |
| `R`         | randomize                    |
| `M`         | cycle color mode             |
| left mouse  | paint cells, or stamp        |
| right mouse | drag to pan                  |
| scroll      | zoom                         |
| arrow keys  | pan                          |
| `Tab`       | hide / show the windows      |
| `F11`       | toggle borderless fullscreen |
| `Esc`       | quit                         |

Three windows sit over the world:

- **world**: run state, speed, uncapped stepping, clear and randomize, erase
  mode, grid lines, color mode (solid with a picker, heat trails, or an
  age-driven palette) and world size from 32 to 512
- **kernel**: preset, radius, a clickable weight grid, and birth and survive
  toggles over the reachable sums
- **arrangements**: a palette of built-in patterns and a custom one drawn in
  place, stamp mode, and saving and loading the custom pattern and the whole
  world

Settings, the kernel and window layout are kept between runs, and saved worlds
and patterns live, under `arrangements/` in the working directory.

## Install

Release archives for linux (x86-64), windows (x86-64) and macOS (x86-64 and
Apple silicon) are on the
[releases page](https://github.com/octalide/cellar/releases). cellar needs a
Vulkan driver; on macOS that is MoltenVK.

## Build

Requires [Mach](https://github.com/briar-systems/mach) 6.7 or newer and a C
compiler for GLFW, which mach-glfw builds from source (on linux, the X11 and
Wayland development headers and `wayland-scanner`).

```
git clone https://github.com/octalide/cellar
cd cellar
mach dep pull .   # realize the pinned std, boom, blit and their dependencies
mach build .
mach run .
mach test .
```

On macOS, pass `--pie` to `mach build` and `mach run`.

## License

MIT, see [LICENSE](LICENSE).
