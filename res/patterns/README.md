# The pattern library

The patterns the draw section offers, embedded into cellar at build time and
read through the format registry (`src/formats.mach`), each in the format its
bytes are.

Each `.rle` file is one category and holds its patterns one after another, in
the order the panel lists them. A pattern is an ordinary RLE file: `#N` names
it, `#O` credits its discoverer and year, `#C` links the page it was taken
from, and the header and body follow. A pattern of a continuous rule may be an
RLW file instead (`src/formats/rlw.mach`), which keeps its cells' exact
values. A blank line between patterns is customary but not needed, since each
one ends at its body's `!`.

To add a pattern, append it to the category it belongs in. To add a
category, add its file here and a row to the table in `src/library.mach`. The
library's tests decode every pattern, so a malformed entry fails the build's
tests rather than the app.

## Sources and licence

Every pattern is a Game of Life (B3/S23) configuration documented on
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
