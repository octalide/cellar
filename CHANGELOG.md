# Changelog

All notable changes to cellar are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and cellar uses
[semantic versioning](https://semver.org/).

## [Unreleased]

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
