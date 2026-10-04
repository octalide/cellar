# Changelog

All notable changes to cellar are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and cellar uses
[semantic versioning](https://semver.org/).

## [Unreleased]

## [0.13.0] - 2026-10-04

### Added

- The top readout shows the measured rate against the set speed (`speed 41 of 60/s`, or `41/s max` uncapped), and Stats shows the measured rate and the time a step takes, from GPU timestamps on the GPU and wall time otherwise (#310).
- Fullscreen and the window's size and position are saved on close and restored at start, straight into fullscreen without a windowed frame. Position is restored where the platform allows it, which Wayland does not (#309).

### Changed

- The World tab is grouped by task in three folding sections: Shape (topology, boundary, size), Walls, and Select and fill. Every exclusive choice is one button group, toggles are toggles, and each tool's heading shows its key and lights while the tool is in use. Picking the boundary, wall or select tool brings its section to the front (#311).
- The toolbar fits 1280 px with HashLife on. The engine choice, HashLife's step and going to a generation moved into one popup (#311).
- The help screen lists keys by area, and every control with a key shows it in its tooltip (#311).
- Stats takes more of the right side by default, so every row shows at 1280x800 (#311).
- Built on boom 0.50.

### Fixed

- Esc closed the application. It now cancels what is in progress, innermost first, and otherwise does nothing (#308).
- Shape choices for boundaries and walls lit each other and could not be told apart, and the selection's Clear shared the world's Clear (#307).

## [0.12.0] - 2026-10-03

### Added

- Drawn boundaries. A world can be any shape you draw, and any number of separate regions: rectangles, ellipses, polygons and freehand strokes, each added, subtracted or intersected. Outside the boundary there are no cells. Nothing grows or is painted there, no memory is spent, and each rule meets its own open edge there (dead for Life, zero for Lenia, no-flux for reaction-diffusion). Regions can be picked, moved, deleted or cleared, and the outside is drawn shaded (#287, #288).
- Walls. Cells inside the world with a fixed state that the rule's cells live against: dead, live, or a fixed value as a source or sink in Lenia and reaction-diffusion. Drawn with the same shapes and erased with the eraser, in their own colours in every colour mode. Painting cells never overwrites a wall, and painting a walled world on the GPU reads nothing back (#289).
- Randomize fills a square or circle around the view, the whole grid, a chosen boundary region or every region, or the selection, at a chosen density. The last choice is remembered and F frames it (#290).
- World files (`cellar 7`), RLW patterns and the clipboard carry walls, and world files and copies carry the boundary. Older files load unchanged (#291).

### Changed

- Bounds and Walls share one toolbar button, which shows the last of the two you used. W and L still take each directly.
- A `:P` plane is a boundary rectangle, so reaction-diffusion on a plane is no-flux at its edge where it read a fixed value before (#287).
- Cut takes walls with the cells, since copy carries them (#291).
- HashLife refuses a world with a drawn boundary or walls, and says why.

### Fixed

- A toast could show garbled text after a refused edit (#288).

## [0.11.0] - 2026-10-03

### Added

- The pool gives memory back. Clear and reset return it to its starting size, and a world that has sat below a quarter of its pool for about two seconds is packed and shrunk to twice what it needs. On the GPU the packing runs in one pass with nothing read back (#285).

### Fixed

- Clearing a world on the GPU no longer reads the pool back, so a multi-GiB world clears without a pause. A world too large for the host can now be cleared instead of being refused (#295).
- Pausing to clear, or starting play, on a world too large for undo no longer reads the whole world back only to discard it. Smaller worlds keep their undo as before (#295).
- Changing layers no longer holds the old and new GPU pools at once (#285).

## [0.10.1] - 2026-10-03

### Changed

- The cell coordinates sit beside the zoom bar as their own x and y boxes, which stay put when the cursor leaves the world (#280).

### Fixed

- The zoom bar flickered under the cursor and its buttons could not be clicked (#280).
- Trails and Age could not be chosen again once a world had grown a large pool, even after a clear. The pool now shrinks to fit the world when a mode needs room, and a refused switch says why (#279).
- Changing a grown world to a rule with wider cells, such as Life to Lenia, could overrun the GPU pool. Rule changes now fit the pool the same way, and a refused change says why (#283).

## [0.10.0] - 2026-10-03

### Added

- The GPU pool is sized from the device's memory instead of a fixed 32,768 chunks. Each layer is split into shards reached by buffer device address, so a world can use as much of the GPU as you allow: a 4.9 GiB world runs on an 8 GiB card (#233). The default limit is three quarters of the GPU's memory, or a quarter where GPU memory is system RAM. Reaching it pauses the run with a toast that offers to raise it. Stats shows the pool's memory and its limit.
- A Lenia category of 13 creatures from Bert Chan's Lenia collection, Lenia rule presets (Orbium, Gyrorbium, Scutium, Hydrogeminium) and a Gray-Scott category of seeds (#239).
- Picking a library pattern whose rule differs from the world's offers to take it, as a paste does. Shift-click takes it (#273).
- `--bench ... --rule <rule>` runs a bench under any rule, with a seed that suits Lenia and Gray-Scott (#257), and `--colour <solid|trails|age>` runs it in a colour mode (#237).
- A rule family registered after the GPU starts gets its GPU stage built on first use (#251).

### Changed

- Trails, heat and age are kept only while a colour mode shows them. A solid-colour Life world holds 2 bits a cell instead of 34. Switching modes on a GPU world builds or drops the layer on the GPU (#237).
- The chunk ceiling is now a pool memory limit. `cellar run --max-chunks` is replaced by `--max-pool-memory <MiB|off>`, and a saved ceiling carries over (#233).
- A Vulkan 1.2 device with buffer device addresses is required. Every current desktop driver, lavapipe, the Raspberry Pi 5 and MoltenVK on macOS 13 or later have them (#233).
- The readout is padded 12 px at the sides and 8 px above and below again. Built on boom 0.49 and blit 0.13.

### Fixed

- A world past 65,535 chunks stepped wrongly on the GPU, because some dispatches went past the device's workgroup count limit (#275).
- Leaving HashLife for the GPU with a rule the GPU cannot step left the world frozen without a word. It is now refused with the reason (#266).
- A bench whose world stopped printed a wrapped rate (#258).

## [0.9.0] - 2026-10-02

### Added

- cellar notices a software Vulkan device, such as Mesa's llvmpipe, and steps the world on its CPU engine, which outruns the GPU engine emulated on the CPU. It says so once at start, and `--engine gpu` still steps on the device. Settings and Stats show the graphics device in use. The README has a troubleshooting section for slow drawing (#259).
- Tab hides the toolbar as well as the panels, leaving the two stat overlays (#241).
- The zoom readout shows px per cell exactly, with buttons that step zoom by powers of two (#242).

### Changed

- Two-state rules (Life, isotropic and non-totalistic, Larger than Life, weighted) store each cell in one bit and step 32 cells at a time on the GPU, 1.4 to 3 times faster in the benches (#234).
- Generations and rule tables store each cell's state in one byte, 1.8 to 2.3 times faster on the GPU (#235).
- Cells are kept in layers of fixed width with one contract for every rule family, and families are registered in one place (#232, #249, #255, #256). Reaction-diffusion keeps its two fields as two 16-bit layers. Worlds and patterns written by 0.8.0 load exactly (#236).
- boom picks a hardware GPU over a software device. `BOOM_DEVICE` names a device by index or name to override that.
- Built on boom 0.48. Building needs Mach 6.10.1 or newer.

### Fixed

- Some glyphs drew one pixel below the rest of their line (#243).

## [0.8.0] - 2026-10-02

### Changed

- Uncapped GPU stepping is paced from measured GPU time, so frames hold the display's refresh rate instead of a sawtooth that missed one refresh in six. Without GPU timestamps, the frame-time controller cuts as soon as a frame runs over (#207).
- The GPU pool grows without stalling the frame. Its buffers are made inside the frame and the GPU keeps the pool while it grows. If the host cannot get the memory, the run pauses with a toast instead of losing any of the world (#208).
- HashLife collects in 6 to 20 ms instead of freezing the run for 60 to 80 ms (#209), and shows each generation without a stalled upload (#210).
- The view is published through a double buffer, so an uncapped HashLife or CPU run shows a new generation every frame (#220, #223).
- Chunk uploads and the rule table go up as one batched write recorded into the frame (#211, #216, #218).
- Built on boom 0.45.

### Fixed

- HashLife no longer crashes in the GPU driver when a large world grows the pool. Only the render thread creates or deletes GPU resources (#206).
- A small edit while the GPU owns the pool could land in the wrong chunk once the GPU had reused a slot (#228).

## [0.7.1] - 2026-10-02

0.7.0 was tagged but never published, because its release run failed on macOS Intel. 0.7.1 is the first release carrying 0.7.0's changes.

### Fixed

- A HashLife step passes its step-time ceiling once the clock reaches the deadline, not only after it, so a run to a generation pauses on the ceiling on every clock (#202).

## [0.7.0] - 2026-10-02

### Added

- Lenia, continuous automata with float cells and smooth kernels, on the CPU and GPU engines. A rule is Chakazul's parameter string, his patterns open as RLE, Orbium glides stably, and R runs to 64 (#49, #179).
- Gray-Scott reaction-diffusion rules with spots, stripes and mitosis presets, bit-exact between the engines (#180).
- RLW, a pattern file that keeps a continuous rule's exact cell values. Saving a Lenia or reaction-diffusion pattern or world picks it, and a run resumed from one continues exactly (#189).
- Copy, paste and stamps keep a continuous rule's exact cell values inside cellar (#178).
- `--bench <gpu|cpu> footprint`, a bench whose rate is bound by the step shader, and bench worlds for a gun, a torus, a bounded plane and a glider in a large box. Every bench line reports step time and cells per second (#176, #51, #195).

### Changed

- The GPU allocates its own chunks on the unbounded plane, so uncapped stepping is no longer held to the census round trip: about 3x faster on dense worlds and 2x on a glider gun (#51).
- A bounded grid that fits the pool is allocated once when it is set, and the GPU steps only the chunks that can change. Uncapped runs inside a drawn box are about 5x faster, and a small pattern in a very large box about 10x (#195, #198).
- Wide kernels read their neighbourhood through workgroup shared memory and load each weight once, about 20x faster per step at radius 16 (#171, #177).
- The census counts each chunk with a workgroup, about 3x faster (#172).
- The readout wraps inside the world area rather than running under the docks, and uses blit's flow layout (#165, #167).
- cellar's own padding, tab placement and toast stopgaps are gone, so the side docks resize by dragging and their widths are saved (#158).
- Built on mach 6.9, boom 0.43, blit 0.12 and mach-shader 0.5.

### Fixed

- Opening a world file keeps its saved camera instead of reframing (#182).
- `cellar run --engine hashlife` names the real reason a rule cannot run there (#181).
- The release build of Lenia's step shader (#190).

## [0.6.0] - 2026-10-01

### Added

- A Bounds tool. Drag a box around a pattern to make it the world's grid, drag its edges to resize it, or set the shape and size in the World panel. The world shifts so nothing moves on screen, cells outside are dropped with a toast, and undo brings them back (#155).
- Growth ceilings on population, chunks, HashLife memory and step time, each optional, that pause a runaway world with a toast. HashLife stays inside its memory ceiling, stepping down to smaller steps before it gives up. `cellar run` honours them, with flags to override, and exits with status 3 when one stops it (#146).
- A toast naming why the world left HashLife, whichever change caused it (#160).

### Changed

- The interface is a docked layout: a toolbar across the top, Patterns and Files on the left, Rule, World and View tabs with Stats on the right, and Settings in its own window. Panels dock, float, tab and close, and the layout is saved (#154).
- The interface is built on blit, with TrueType text at every scale (#118).
- The simulation steps on its own thread on every engine, so the interface keeps the display's refresh rate however slow a generation is (#143).
- Pause and every other command cancel the step under way, so they take effect within a frame or two (#144).
- A GPU generation is split across frames on large worlds, so a frame never waits on a whole generation (#145).
- Built on boom 0.40, with blit 0.10 and glfw 0.11.

## [0.5.0] - 2026-09-30

### Added

- A HashLife engine beside the GPU and CPU engines, with a step exponent and go to generation. Patterns spanning billions of cells run in real time (#52).
- Generations rules, such as Brian's Brain and Star Wars, on every engine including HashLife (#47, #105).
- Rule tables. Golly's `.rule` files with `@TABLE`, `@TREE` and `@COLORS` load by name from the data directory or by opening the file, and WireWorld and Langton's Loops are built in (#48).
- Isotropic non-totalistic rules in Hensel notation and Golly's MAP rules, with tlife and Just Friends as presets (#22).
- Bounded grids: planes, tori, Klein bottles and cross-surfaces, with Golly's `:P`, `:T`, `:K` and `:C` suffixes. B0 rules run on them as well (#53, #114).
- Wider weighted kernels up to radius 16 with negative weights, a rule editor that scales to them, and Golly's NW weighted notation (#46, #116, #99).
- Type a rule string, and a mistyped one reports the error of the family it meant (#44, #133).
- Undo and redo for every edit, file action and rule change (#40).
- Reset to the starting generation (#41).
- A selection tool, and copy and paste as RLE through the clipboard. Dropping a file on the window opens it (#39, #36).
- A bundled pattern library with search (#42).
- Macrocell read and write. A Macrocell file loads into HashLife straight from its nodes, and a HashLife world saves the same way, so 2^30-sized patterns open and save in milliseconds (#37, #128, #113).
- Oscillator and spaceship identification (#55).
- `cellar run`, a headless batch mode that steps a pattern a number of generations and writes the result (#57).
- A state picker for multi-state rules. Q and Shift+Q step through the states (#132).
- The engine and step exponent are kept in settings (#106).

### Changed

- B0 rules run as Golly runs them, strobing or as their complement (#45).
- Rule families sit behind one contract, and presets come from a data table (#43).
- Large patterns draw from a texture, and only small ones are edited cell by cell (#91).
- CPU stepping has fast paths for common rules (#50).
- The GPU widens its halo while uncapped stepping is bound by reach (#51).
- Frame-time pacing follows the display's refresh rate instead of assuming 60 Hz (#103).
- Built on boom 0.39 and std 9.4.1. blit 0.9 comes in through boom.

### Fixed

- Zoomed out, cells draw by coverage instead of dropping out (#56).
- A Generations world exports every nonzero state (#101).
- The readout and toast draw on an opaque background (#107).
- Nothing is drawn under the pointer while it is outside the window (#115).
- On odd generations of a strobing B0 rule on a bounded grid, population, reads and saves report the cells the view shows (#138).
- Opening a pattern sets its rule before writing its cells, so states the old rule lacked are kept.

## [0.4.0] - 2026-09-30

### Added

- Linux on arm64, tested natively in CI and shipped as a release build. A plain `mach build .` on an arm64 linux host builds for it (#23).
- Pattern files through one format registry that recognises a file by its contents: RLE read and write, LifeWiki plaintext `.cells` read and write, and Life 1.05 and 1.06 read (#32, #33).
- `cellar <file>` opens a world or a pattern at startup and frames it. Options may come before or after the file, and a bad one is refused with a usage line (#35).
- Named saves. The files section lists the data directory, and a name field saves worlds and patterns under any name (#35).
- World files record the rule, weighted kernels included, along with the generation, the camera and the colour mode (#34).
- Rotate (Z) and flip (X) the stamp, with the preview following (#38).
- A population graph in the run section, and the live cells' bounding box outlined in the world and sized in the readout (#54).

### Changed

- Worlds are saved as `.cellar` and the custom pattern as RLE. Saves from 0.3.0 are moved over at startup (#33).
- Edits and file actions apply from a queue at the start of a frame, so a save always sees the world it was asked for (#26).
- Patterns can be any size, and a large stamp applies in one bulk edit (#31).
- The chunk pool's ceiling comes from the GPU's storage limits instead of a fixed count (#25).
- Built on boom 0.35, with mach-glfw 0.10, mach-audio 0.11 and mach-vk 0.8.

### Fixed

- A save made while the GPU was running could write a stale or empty world (#26).
- A world that outgrows its pool stops with a message on both engines, where it stalled silently or exited (#25, #27).
- The view no longer jitters far from the origin (#28).
- Negative weights are saved as signed numbers, and a rule string uses one separator style throughout (#30).
- Flipping the stamp after a rotation mirrors it on screen (#38).

## [0.3.0] - 2026-09-30

### Changed

- Rebuilt on boom for Mach 6.7, and built with mach 6.7.2, whose linker synthesizes the Objective-C selector stubs the Apple silicon build needs. boom owns the window, input, rendering and frame loop, and every shader is written in Mach (#8).
- The world is infinite: a sparse pool of 64x64 chunks that grows in any direction, simulated on the GPU with Mach compute shaders and drawn straight from GPU memory. The CPU engine remains as the reference and the fallback (#10).
- A new interface drawn by cellar itself instead of blit: a docked, collapsible side panel, a readout of generation, population, rule and speed, TrueType text, a new palette, and a 100 to 200 percent interface scale (#11).
- Settings, worlds and patterns are kept in the platform's user data directory, and files in the old arrangements directory are carried over once (#11).
- Live chunks allocate only the neighbours their cells lean towards, and uncapped GPU stepping adapts its steps per frame to keep frames smooth (#13).
- Licensed under MIT.

### Added

- Uncapped stepping, running as fast as the machine allows.
- `cellar --version`, `--capture <png>`, `--bench`, and screenshots with F12.
- The world window shows the generation, rule and speed, and a stamp preview follows the cursor.
- Release builds for linux, windows and macOS on x86-64 and Apple silicon.

### Fixed

- Saved files are read and freed by their real length (#3).
- A saved world or pattern is validated before anything is applied (#2).
- The grid is drawn from the live cells instead of scanning every cell (#1).
- The world is no longer stretched while the side panel is open (#15).
- A restored rule that matches a preset keeps the preset's name.

[Unreleased]: https://github.com/octalide/cellar/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/octalide/cellar/releases/tag/v0.4.0
[0.3.0]: https://github.com/octalide/cellar/releases/tag/v0.3.0
