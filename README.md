# cellar

An interactive cellular-automata editor and visualizer written in
[Mach](https://github.com/briar-systems/mach), built on the
[boom](https://github.com/briar-systems/boom) engine.

![cellar running Life, with its side panel](doc/screenshot.png)

The world is unbounded: a sparse pool of 64 by 64 chunks that holds only the
regions with live cells and their neighbours, growing in any direction. It is
stepped on the GPU by compute shaders written in Mach, and drawn straight from
the GPU's buffers, so neither stepping nor drawing crosses to the CPU. Where no
GPU can run the compute shaders, the CPU steps it instead, split across every
core by chunk. boom owns the window, input, Vulkan renderer and frame loop; the
interface is drawn over the cells in the same overlay pass by a small
immediate-mode layer of cellar's own, with text from an embedded TrueType face.

A kernel is a `(2r+1)x(2r+1)` integer-weight footprint, of radius up to 16 and
negative weights allowed, plus birth and survive sets over the saturated
weighted neighbor sum, so it generalizes Larger-than-Life (Golly's
`R5,C0,M1,S34..58,B34..45,NM` for Bosco's rule, or HROT's
`R2,C0,S2-3,B3,NC`) while still expressing the classic Life family exactly.
Built-in kernels: Conway's Life (`B3/S23`), HighLife (`B36/S23`), Seeds
(`B2/S`) and Day & Night (`B3678/S34678`).

Generations rules add dying states: in `B2/S/C3` (Brian's Brain) a live cell
that does not survive passes through the states up to `C`-1 before it is dead,
and only live cells count as neighbours. Golly's older form, survive, birth and
states (`345/2/4` for Star Wars), reads too. The trails colour mode shows each
state in its own colour. Built-in: Brian's Brain (`B2/S/C3`) and Star Wars
(`B2/S345/C4`).

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
| `Z`, `X`                 | rotate the stamp, flip the stamp                                 |
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
| arrow keys               | pan                                                              |
| `F`                      | frame the randomize area                                         |
| `M`                      | next colour mode                                                 |
| `G`                      | grid lines                                                       |
| `Tab`                    | hide / show the panel                                            |
| `H`, `F1`                | key reference                                                    |
| `F11`                    | toggle borderless fullscreen                                     |
| `F12`                    | screenshot                                                       |
| `Esc`                    | close the reference, deselect, or quit                           |

Undo steps back through strokes, stamps, selection operations, pastes, rule
changes, clears, randomizes, resets, loads and dropped files, with as many steps as 256 MiB of
before-images holds. A stretch of play is one step too: undoing it returns to
where play started, and undo or redo while running pauses first. Any new
change clears what could be redone.

A readout of the generation, population, rule and speed sits in the top-left
corner, and the side panel groups every control by task:

- **run**: play, step, speed, uncapped stepping, randomize and clear, and the
  area randomize fills, from 32 to 4096 cells square
- **draw**: the tool, a library of about three hundred classic patterns
  (still lifes, oscillators, spaceships, guns, puffers, methuselahs and growth)
  to browse by category or search by name, a custom pattern drawn in place, and
  a preview of the selected one, and with the select tool the operations on the
  selection. copying or cutting a selection makes it the custom pattern and arms
  the stamp. The library's sources are listed in
  [res/patterns](res/patterns/README.md)
- **rule**: presets, the rule in B/S notation, radius, a clickable weight grid
  whose cells cycle from 0 up to 4 and on through -4 to -1, and birth and
  survive toggles over the reachable sums
- **view**: colour mode (a solid colour from a set of swatches, fading trails,
  or colour by age), grid lines, and the interface size from 100 to 200 percent
- **files**: named saves of the world and the custom pattern, a list of every
  world and pattern in the data directory to load from, and screenshots

Settings and the rule are kept between runs. They, saved worlds and patterns,
and screenshots live in the platform's user data directory:
`$XDG_DATA_HOME/cellar` (or `~/.local/share/cellar`) on linux,
`~/Library/Application Support/cellar` on macOS and `%APPDATA%\cellar` on
windows. The first run brings over anything an older version left in
`arrangements/` in the working directory.

`cellar <file>` opens a file at startup: a `.cellar` world loads as the world,
and a pattern in any format cellar reads (RLE, plaintext `.cells`, Life 1.05
and 1.06, Golly's Macrocell `.mc`) is stamped onto an empty world centred on the
origin and framed, taking its rule when cellar can run it. A file that cannot be
read, or a pattern too large for the world to hold, leaves the world as it was
and says why. Options may come before or after the file, and `--` ends
them, so `cellar -- -x.rle` opens a file whose name starts with a dash.

A file dropped on the window opens the same way, a pattern stamped onto the
world as it stands. When several are dropped the first opens and the rest are
left alone. `Ctrl+V` reads any of those pattern formats from the clipboard as
the stamp, and `Ctrl+C` puts a copied selection on the clipboard as RLE with
its rule, ready to paste into LifeWiki or Golly.

`cellar --capture shot.png` draws a second of frames, saves the last one and
exits, leaving the saved settings alone.

`cellar run <file> --gens <n> [--rule <rule>] [--out <file>] [--quiet]` runs
a world or pattern headless, with no window and no GPU. The file opens as it
would at startup, runs under `--rule` or else its own rule for `n`
generations on the CPU, and is written in the format `--out`'s extension names
(`.rle`, `.cells`, `.mc`), or as RLE on stdout without one. The
generation and population go to stderr unless `--quiet`.

## Install

Release archives for linux (x86-64 and arm64), windows (x86-64) and macOS
(x86-64 and Apple silicon) are on the
[releases page](https://github.com/octalide/cellar/releases). cellar needs a
Vulkan driver; on macOS that is MoltenVK.

## Build

Requires [Mach](https://github.com/briar-systems/mach) 6.7 or newer and a C
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
