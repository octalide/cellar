# Changelog

All notable changes to cellar are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and cellar uses
[semantic versioning](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/octalide/cellar/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/octalide/cellar/releases/tag/v0.3.0
