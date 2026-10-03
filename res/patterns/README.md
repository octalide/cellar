# The pattern library

The patterns the draw section offers, embedded into cellar at build time and
read through the format registry (`src/formats.mach`), each in the format its
bytes are.

Each file is one category and holds its patterns one after another, in the
order the panel lists them. A pattern is an ordinary RLE file: `#N` names it,
`#O` credits its discoverer and year, `#C` links the page it was taken from,
and the header and body follow. A pattern of a continuous rule is an RLW file
instead (`src/formats/rlw.mach`), which keeps its cells' exact values, so the
Lenia and Gray-Scott categories are `.rlw` files. A library pattern is
stamped under the world's rule, so each of those names its own rule in its
header, which the rule panel's presets mostly match. A blank line between patterns is customary but not needed, since each
one ends at its body's `!`.

To add a pattern, append it to the category it belongs in. To add a
category, add its file here and a row to the table in `src/library.mach`. The
library's tests decode every pattern, so a malformed entry fails the build's
tests rather than the app.

## Sources and licence

### Life

Every pattern in the `.rle` files is a Game of Life (B3/S23) configuration documented on
[LifeWiki](https://conwaylife.com/wiki/), and each entry's `#C` line links its
page. The cells were taken from LifeWiki's RLE pattern files, as of the wiki's
public dump of 2 October 2023
(<https://archive.org/details/wiki-conwaylife.com_w-20231002>). The selection
is the most linked-to patterns of each kind, each checked by simulation to
behave as its page says (a still life is stable, an oscillator returns at its
period, a spaceship moves at its period, a gun emits at a steady rate).

A pattern's cells are a discovered configuration, a fact about the rule, and
the names, discoverers and years are facts too. No prose, comments or other
text from LifeWiki is reproduced here: the files were written out afresh from
the cells, and the only text in them is the name, the credit and the link.
LifeWiki's own text is licensed under the GNU Free Documentation License 1.2,
and none of it is included.

The files themselves are part of cellar and distributed under its licence
(`LICENSE` at the repository root). The credit to each pattern's discoverer is
kept in every entry as a matter of attribution.

### Lenia

The creatures in `lenia.rlw` are Bert Wang-Chak Chan's (Chakazul's), from his
Lenia's `animals.json` (<https://github.com/Chakazul/Lenia>, as of its commit
`adfc542` of 15 March 2022), with the names and rule parameters he gives them.
His cells are Golly multi-state RLE of each value in 255ths, and each was
converted to RLW unchanged, so a cell holds exactly the value his file gives
it. A creature is listed only where its rule is one cellar's Lenia runs and it
was checked by simulation on the CPU to keep its mass and travel or turn as
his do, over a thousand generations. The Lenia repository is distributed under
the MIT licence, copyright (c) 2018 Bert Chan, and its notice applies to the
creatures' data:

> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to
> deal in the Software without restriction, including without limitation the
> rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
> sell copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
> FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
> IN THE SOFTWARE.

### Reaction-diffusion

The seeds in `reaction.rlw` are John E. Pearson's, from "Complex Patterns in
a Simple System" (Science 261, 1993): a 20 by 20 square of u = 1/2 and
v = 1/4 on the empty field, here at the nearest 15ths a pattern format keeps
(u = 7/15, v = 4/15), one for each of the rule panel's Gray-Scott presets and
under its rule. He broke the square's symmetry with noise, and these leave it
out, so each grows the same pattern every time. They were checked by
simulation on the CPU to grow under their rule rather than die out.
