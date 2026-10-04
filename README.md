# cellar

An interactive cellular-automata editor and visualizer written in
[Mach](https://github.com/briar-systems/mach), built on the
[boom](https://github.com/briar-systems/boom) engine.

![cellar running Life, with its toolbar and docked panels](doc/screenshot.png)

The world is unbounded: a sparse pool of 64 by 64 chunks that holds only the
regions with live cells and their neighbours, growing in any direction. It is
stepped on the GPU by compute shaders written in Mach, and drawn straight from
the GPU's buffers, so neither stepping nor drawing crosses to the CPU. Where no
GPU can run the compute shaders, the CPU steps it instead, split across every
core by chunk. For huge patterns and generation counts, a rule of radius 1
without B0 can instead run on HashLife: the world becomes a hash-consed
quadtree stepped by Gosper's algorithm, a power of two generations at a time,
and drawn from the tree at the current zoom, so a Gosper gun reaches
generation 2^30 in a moment. HashLife keeps no heat or age, so it draws in the
solid colour. boom owns the window, input, Vulkan renderer and frame loop; the
interface is built with [blit](https://github.com/briar-systems/blit) and drawn
over the cells in the same overlay pass through boom's blit renderer, with text
from an embedded TrueType face.

A kernel is a `(2r+1)x(2r+1)` integer-weight footprint, of radius up to 16 and
negative weights allowed, plus birth and survive sets over the saturated
weighted neighbor sum, so it generalizes Larger-than-Life (Golly's
`R5,C0,M1,S34..58,B34..45,NM` for Bosco's rule, or HROT's
`R2,C0,S2-3,B3,NC`) while still expressing the classic Life family exactly.
Golly's weighted neighbourhoods read and write as well, `NW` then a hex weight
for each cell row by row (`R1,C0,S2-3,B3,NW111101111` is Life).
Built-in kernels: Conway's Life (`B3/S23`), HighLife (`B36/S23`), Seeds
(`B2/S`) and Day & Night (`B3678/S34678`).

Generations rules add dying states: in `B2/S/C3` (Brian's Brain) a live cell
that does not survive passes through the states up to `C`-1 before it is dead,
and only live cells count as neighbours. Golly's older form, survive, birth and
states (`345/2/4` for Star Wars), reads too. The trails colour mode shows each
state in its own colour. Built-in: Brian's Brain (`B2/S/C3`) and Star Wars
(`B2/S345/C4`).

Isotropic non-totalistic rules see how the eight neighbours are arranged,
not only how many are live, in Hensel's notation as Golly writes it: a count
followed by letters takes the arrangements the letters name, with their
rotations and reflections, and a minus before the letters every arrangement
but those, so `B2-a/S12` (Just Friends) births on two neighbours unless they
sit side by side. Golly's MAP strings, `MAP` and 86 base64 characters, name any
two-state rule of the Moore neighbourhood, isotropic or not, and read into the
same kind of rule. B0 rules of either form run as the weighted ones do, and
those without B0 run on HashLife too. Built-in: tlife (`B3/S2-i34q`) and Just
Friends (`B2-a/S12`).

Rule tables are Golly's RuleLoader `.rule` files: a `@TABLE` of transitions
over the von Neumann, Moore or hexagonal neighbourhood (Golly's, on the square
grid) with its variables and symmetries, or a `@TREE`, of up to 256 states,
coloured by the file's `@COLORS`. Open a `.rule` file with `cellar <file>`, by
dropping it on the window, or from the files panel, and its rule runs on the
world as it stands. A rule string naming a table is its name, as Golly writes
it (`WireWorld`, `Langtons-Loops:T200,200`), and is looked up as
`<name>.rule` in the data directory first, then among the tables opened this
session, then among the built-in WireWorld and Langton's Loops (see
`res/rules`). Opening a `.rule` file copies it into the data directory, so
worlds, patterns and settings naming it find it in later sessions, and a file
there is read again each time its name is set, so an edit takes effect then.
Every state but 0 is live, and a table whose empty neighbourhood gives a live
cell is refused, since it would flip the unbounded background.

Lenia rules are Bert Chan's continuous automata: a cell holds a value from 0
to 1 and moves each generation by the growth of a smooth kernel's weighted sum
around it. A rule is Chakazul's parameters as his Lenia writes them,
`R=13,T=10,b=[1],m=0.15,s=0.015,kn=1,gn=1` for Orbium. R is the kernel's
radius, up to 64. T is the generations to a unit of time. b holds the peaks of
the kernel's rings. m and s are the growth's centre and width. kn and gn name
the kernel core and growth function, numbered as his are. Cells are drawn by
value on his colour map. Chakazul's patterns are Golly multi-state RLE of
their values in 255ths, so they open as RLE files. RLE and the other pattern
formats keep the 255ths, and a format with fewer states refuses the rule.
RLW, cellar's own pattern format, and a world file keep every value exactly.
Built-in: the rules of Orbium (`R=13,T=10,b=[1],m=0.15,s=0.015`), Gyrorbium
(`m=0.156,s=0.0224`), Scutium (`m=0.29,s=0.045`) and Hydrogeminium
(`R=18,T=10,b=[1/2,1,2/3],m=0.26,s=0.036`), and the pattern library's Lenia
category holds creatures that live under them and others. Lenia runs on the
CPU and the GPU, not on HashLife.

Reaction-diffusion rules are Gray-Scott's model: a cell holds two
concentrations, u and v, that diffuse and react, v feeding on u at u v^2,
u fed in at F (1 - u) and v killed at (F + k) v. A rule is its rates,
`F=0.0367,k=0.0649,Du=0.2097152,Dv=0.1048576`, with Du and Dv Pearson's when
left out. The step is Pearson's, on the 5-point Laplacian, in integers, so both
engines give the same cells. Each concentration is kept to 16 bits in the
cell, and a pattern format keeps each to a 15th: state 16 j + i is
u = 1 - i/15 and v = j/15, so a pattern needs 256 states, as multi-state RLE
holds, and a format with fewer refuses the rule. RLW and a world file keep
every value exactly. The pen paints u = 1, v = 1, which starts a pattern from a
stroke. Cells are drawn by v. Built-in: Gray-Scott spots (`F=0.03,k=0.062`),
stripes (`F=0.029,k=0.057`) and mitosis (`F=0.0367,k=0.0649`), each with a
seed in the pattern library's Gray-Scott category. Reaction-diffusion
runs on the CPU and the GPU, not on HashLife.

Any rule runs on a bounded grid named after it as Golly writes one:
`B3/S23:T100,100` is a 100 by 100 torus, `:P` a plane with dead edges, `:K`
a Klein bottle whose starred size (`:K100*,80`) is the edge joined with a
twist, and `:C` a cross-surface. A lone size gives a square, and a 0 leaves a
plane or torus unbounded along that axis. Cells written off the grid are
dropped.

## Controls

| input                    | action                                                           |
|--------------------------|------------------------------------------------------------------|
| `space`                  | play / pause                                                     |
| `S`                      | single step                                                      |
| `R`                      | randomize                                                        |
| `C`                      | clear                                                            |
| `Backspace`              | reset to where play started                                      |
| `Ctrl+Z`                 | undo                                                             |
| `Ctrl+Shift+Z`, `Ctrl+Y` | redo                                                             |
| `D`, `E`, `T`, `V`       | draw, erase, stamp or select tool                                |
| `L`                      | wall tool                                                        |
| `Z`, `X`                 | rotate the stamp, flip the stamp                                 |
| `Q`, `Shift+Q`           | next or previous state to draw, with a rule of more than two     |
| left mouse               | use the tool; drag to select                                     |
| `Ctrl+C`, `Ctrl+X`       | copy or cut the selection to the stamp and the clipboard, as RLE |
| `Ctrl+V`                 | paste a pattern as the stamp, keeping the current rule           |
| `Ctrl+Shift+V`           | paste a pattern as the stamp, taking its rule                    |
| `Delete`                 | clear the selection                                              |
| `Shift+Delete`           | clear outside the selection                                      |
| `Ctrl+R`                 | fill the selection at random                                     |
| `I`                      | invert the selection                                             |
| `B`                      | shrink the selection to its live cells                           |
| right or middle mouse    | drag to pan                                                      |
| scroll                   | zoom toward the cursor                                           |
| `PgUp`, `PgDn`           | zoom in or out to the next power of two of pixels per cell       |
| arrow keys               | pan                                                              |
| `F`                      | frame the randomize area                                         |
| `M`                      | next colour mode                                                 |
| `G`                      | grid lines                                                       |
| `Tab`                    | hide / show the toolbar and panels                               |
| `H`, `F1`                | key reference                                                    |
| `F11`                    | toggle borderless fullscreen                                     |
| `F12`                    | screenshot                                                       |
| `Esc`                    | close the reference, deselect, or quit                           |

Walls are cells with a fixed state that the live cells around them read but
never change. The wall tool draws them with the same shapes the bounds tool
draws a boundary with, a rectangle, an ellipse, a polygon or a freehand
brush, each wall dead or holding the pen's state: alive, or under Lenia and
reaction-diffusion a fixed value, a source or a sink, chosen in the world
panel's Walls section. The bounds and wall tools share one toolbar button,
named for the one it takes up; pressing it again switches to the other. The
eraser takes them
away. Drawing, stamping, randomizing and the selection's operations leave
them where they stand, and a clear removes them. They show in a stone colour
of their own in every colour mode, and HashLife does not run a world that has
them.

Undo steps back through strokes, stamps, selection operations, pastes, rule
changes, clears, randomizes, resets, loads and dropped files, with as many steps as 256 MiB of
before-images holds. A stretch of play is one step too: undoing it returns to
where play started, and undo or redo while running pauses first. Any new
change clears what could be redone.

A readout of the generation, population, rule and speed sits in the top-left
corner of the world. A toolbar runs across the top, and the panels are docked
at the sides, grouped by purpose:

- **toolbar**: play, step, reset, speed and uncapped stepping, the tool (draw,
  erase, stamp, select, and bounds or walls under one button), with a rule of more than two states the state the pen
  and the custom pattern's editor paint, each in the rule's colour for it, the
  engine: the chunk pool, or HashLife where the rule allows, with its step of
  2^k generations and a generation to go straight to, the panels menu, and the
  settings and the key reference
- **patterns**: a library of about three hundred classic patterns (still
  lifes, oscillators, spaceships, guns, puffers, methuselahs and growth), Lenia
  creatures and reaction-diffusion seeds to browse by category or search by
  name, a custom pattern drawn in place, and a
  preview of the selected one. The library's sources are listed in
  [res/patterns](res/patterns/README.md)
- **files**: named saves of the world and the custom pattern, a list of every
  world, pattern and `.rule` file in the data directory to load or run, and
  screenshots. A pattern is saved as RLE unless its name gives another
  format's extension, or as RLW when it holds a continuous rule's exact values
- **rule**: presets, the rule in B/S notation, radius, a clickable weight grid
  whose cells cycle from 0 up to 4 and on through -4 to -1, and birth and
  survive toggles over the reachable sums
- **world**: randomize, the area it fills, from 32 to 4096 cells square, clear,
  and the operations on a selection. Copying or cutting a selection makes it
  the custom pattern and arms the stamp
- **view**: colour mode (a solid colour from a set of swatches, fading trails,
  or colour by age; a rule table's states show in its own colours in place of
  the solid one), grid lines, and framing the randomize area
- **stats**: the population graph, the readout in full, the graphics device
  drawing the window, and what the last identified selection holds
- **settings**, a floating window closed at first: the ceilings a run pauses
  at, the interface size from 100 to 200 percent, and the graphics device's
  name, kind and driver

Each panel is a window that can be docked at either side, tabbed with another,
floated or closed, and the panels menu reopens a closed one or resets the
layout. The layout is kept with the settings.

Settings and the rule are kept between runs. They, saved worlds and patterns,
and screenshots live in the platform's user data directory:
`$XDG_DATA_HOME/cellar` (or `~/.local/share/cellar`) on linux,
`~/Library/Application Support/cellar` on macOS and `%APPDATA%\cellar` on
windows. The engine chosen in the toolbar and HashLife's step exponent are
kept too. `--engine` overrides the saved engine for that run and leaves the
saved choice alone until the toolbar changes it, and a saved HashLife that cannot
run the loaded rule starts on the chunk engine with a message. The first run
brings over anything an older version left in
`arrangements/` in the working directory.

A run pauses with a message when it crosses a ceiling: a population, the
memory the pool takes, the memory HashLife's nodes take (500 MiB by default,
collected before it counts), or the time one step takes. Each is switched on or
off in the settings and kept with them. Playing on carries the run past the
ceiling it paused at, which stays quiet until the world falls back under it.

The pool's memory is a bound rather than a check: the pool is sized to it, on
the GPU where the GPU steps the world, across as many buffers as the world
needs. Left at its default it takes three quarters of a discrete GPU's memory
and a quarter where the GPU shares the system's, and switched off it may take
all of it. A world that reaches it pauses, and the message offers to raise it
so the run can go on. cellar needs a Vulkan 1.2 GPU with buffer device
addresses, and says so at start on one without.

`cellar <file>` opens a file at startup: a `.cellar` world loads as the world,
a `.rule` file's rule runs on the world, and a pattern in any format cellar reads (RLE, plaintext `.cells`, Life 1.05
and 1.06, Golly's Macrocell `.mc`, cellar's RLW `.rlw`) is stamped onto an empty world centred on the
origin and framed, taking its rule when cellar can run it. A file that cannot be
read, or a pattern too large for the world to hold, leaves the world as it was
and says why. With `--engine hashlife` a Macrocell file is built straight into
HashLife's tree from its nodes, so a pattern far past the chunk pool opens in
the time its file takes to read, and undo takes it back. Options may come before or after the file, and `--` ends
them, so `cellar -- -x.rle` opens a file whose name starts with a dash.

A file dropped on the window opens the same way, a pattern stamped onto the
world as it stands. When several are dropped the first opens and the rest are
left alone. `Ctrl+V` reads any of those pattern formats from the clipboard as
the stamp, and `Ctrl+C` puts a copied selection on the clipboard as RLE with
its rule, ready to paste into LifeWiki or Golly.

RLW (`.rlw`) is cellar's pattern format for continuous rules. It is RLE's
head with the rule required, and a body of run-counted cell words, each cell's
exact value under that rule in base 26 (`mgeuN` is a third in Lenia), so a
Lenia or reaction-diffusion pattern saved to it opens with every value as it
was. Placed under a rule that reads its words differently, it takes their
states, as any pattern does.

`cellar --capture shot.png` draws a second of frames, saves the last one and
exits, leaving the saved settings alone.

`cellar run <file> --gens <n> [--rule <rule>] [--out <file>] [--quiet]` runs
a world or pattern headless, with no window and no GPU. The file opens as it
would at startup, runs under `--rule` or else its own rule for `n`
generations on the CPU, and is written in the format `--out`'s extension names
(`.rle`, `.cells`, `.mc`, `.rlw`), or as RLE on stdout without one. The
generation and population go to stderr unless `--quiet`. It honours the saved
ceilings, which `--max-population`, `--max-pool-memory` (MiB), `--max-memory`
(MiB) and `--max-step-ms` set to a limit or `off` for that run. A run that crosses one
stops there, writes the world as it stood, says which and exits with status 3.

## Bench

`cellar --bench <gpu|cpu> <world> [seconds [radius [speed]]] [--rule <rule>]`
runs a world on
that engine for ten seconds or the seconds given, after a warmup of 30 frames,
prints one line and exits, leaving the saved settings alone. It runs uncapped,
or at `speed` generations a second. The worlds:

- `dense`: a 512 by 512 random soup.
- `sparse`: 400 small soups a thousand cells apart.
- `gun`: Gosper's glider gun, growing a glider at a time.
- `footprint`: a live 1024 by 1024 square under a vote over the whole (2r+1)
  by (2r+1) square at the radius, centre included: a dead cell is born where
  most of its square is live, and a live one survives where more than a third
  is. Every weight is nonzero, so each cell reads its whole footprint, and the
  square holds still once the tips of its corners fall, so each generation
  steps the same chunks in full. On the unbounded plane the GPU allocates its
  own chunks, so no census budget bounds the generations, and at wider radii
  the rate is the step stage's. This is the world for measuring a change to a
  step shader.
- `torus`: a 512 by 512 random soup filling a 512 by 512 torus (`:T512,512`).
- `plane`: Gosper's glider gun on a 1024 by 512 plane (`:P1024,512`), its
  gliders dying at the edge.
- `box`: a glider on an 8192 by 8192 torus (`:T8192,8192`), a sparse world in
  a large box.

The last three measure a bounded grid.

The other worlds run Life with its eight weights widened to the radius, one by
default, so a wider radius costs its spread but reads the same eight cells.

`--rule` runs every world under a rule instead, in the syntax of `cellar run`,
so any family can be measured. A weighted rule is widened to the radius as Life
is. A continuous rule has no soup of live cells to run, so each world seeds what
the rule needs: Orbium for Lenia and a square of ink for reaction-diffusion. The
`footprint` world runs the vote it measures, and `torus`, `plane` and `box` need
a rule that runs on a bounded grid, so a rule that cannot is refused with a
message, as is one that does not parse.

The line reads `bench <engine> radius <r> chunks <n> population <n> gens/s <n>
step us <n> cells/s <n> frame us <n> bits/cell <n> pool bytes <n>`: chunks and
population as the run ended, generations a second, the time a generation took
on average, the cells of the chunks the pool held stepped a second, the time a
frame took on average, the bits a cell takes in the pool, and the bytes the
pool took, on the GPU where it steps.

`cellar --bench <gpu|cpu> pause [seconds]` runs Seeds from a soup, pauses it
after each run of that long and resumes it, and prints how long each pause took
to apply. With `--engine hashlife` it runs on the tree.

## Install

Release archives for linux (x86-64 and arm64), windows (x86-64) and macOS
(x86-64 and Apple silicon) are on the
[releases page](https://github.com/octalide/cellar/releases). cellar needs a
Vulkan driver; on macOS that is MoltenVK.

## Troubleshooting

**cellar is slow.** It may be drawing on a software Vulkan device, such as
Mesa's lavapipe (`llvmpipe`), which runs on the CPU rather than a GPU. cellar
then says that no hardware GPU was found, warns in the settings and the stats,
and steps the world on its CPU engine, which outruns its GPU engine emulated on
such a device. `--engine gpu` steps on the device anyway. Drawing stays slow
until a hardware driver is installed.

`vulkaninfo --summary` (from the Vulkan tools package) lists the devices the
installed drivers offer. A `deviceType` of `PHYSICAL_DEVICE_TYPE_CPU` is a
software one. With only that listed, no driver for the GPU is installed, so
install your GPU's Mesa or vendor Vulkan driver. Linux on Apple silicon needs
the Asahi Linux Mesa, whose Honeykrisp driver is the hardware Vulkan driver
for those GPUs.

cellar takes a hardware GPU over a software one, and a discrete GPU over an
integrated one. `BOOM_DEVICE` overrides that choice with a device's index in
`vulkaninfo`'s list (`BOOM_DEVICE=1` for `GPU1`) or a part of its name
(`BOOM_DEVICE=intel`).

## Build

Requires [Mach](https://github.com/briar-systems/mach) 6.10.1 or newer and a C
compiler for GLFW, which mach-glfw builds from source (on linux, the X11 and
Wayland development headers and `wayland-scanner`).

```
git clone https://github.com/octalide/cellar
cd cellar
mach dep pull .   # realize the pinned std, boom, image and their dependencies
mach build .
mach run .
mach test .
```

On macOS, pass `--pie` to `mach build` and `mach run`.

## License

MIT, see [LICENSE](LICENSE).
