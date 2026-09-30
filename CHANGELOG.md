# Changelog

All notable changes to cellar are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and cellar uses
[semantic versioning](https://semver.org/).

## [Unreleased]

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
