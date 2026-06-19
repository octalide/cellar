# cellar

An interactive cellular-automata editor and visualizer in [Mach][mach], rendered
with [`mach-gl`][mach-gl] / [`mach-glfw`][mach-glfw] and an immediate-mode UI from
[`blit`][blit].

A double-buffered, toroidal grid runs a Life-like (B/S) rule on the CPU and is
drawn as screen-space quads. The control panel rides the same vertex stream,
shader, and texture as the grid, so the whole frame is one draw call's worth of
state.

## Controls

| input        | action                          |
|--------------|---------------------------------|
| `space`      | play / pause                    |
| `S`          | single step                     |
| `C`          | clear                           |
| `R`          | randomize                       |
| `N`          | next rule preset                |
| left mouse   | draw cells                      |
| right mouse  | erase cells                     |
| scroll       | zoom                            |
| arrow keys   | pan                             |
| `Esc`        | quit                            |

The on-screen panel mirrors these: a `running` toggle, step / clear / randomize /
next-rule buttons, and speed (steps per second) and randomize-density sliders.

Built-in rules: Conway's life (`B3/S23`), HighLife (`B36/S23`), Seeds (`B2/S`),
and Day & Night (`B3678/S34678`).

## Build & run

```
mach build      # compile
mach run        # build and launch (run from the project root: shaders load by relative path)
mach test       # grid / rule / sim unit tests
```

## Layout

```
src/
  main.mach      window, GL setup, the frame loop, input wiring
  grid.mach      double-buffered toroidal u8 cell grid
  rule.mach      Life-like B/S rules and presets
  sim.mach       simulation state: step, paint, clear, randomize
  render.mach    camera (fit/zoom/pan) and grid -> blit quads
  ui.mach        control-event globals, text helpers, control panel
  shaders.mach   shader compile + program link
  shaders/       ui.vert / ui.frag — the blit overlay shader
```

[mach]:       https://github.com/octalide/mach
[mach-gl]:    https://github.com/octalide/mach-gl
[mach-glfw]:  https://github.com/octalide/mach-glfw
[blit]:       https://github.com/octalide/blit
