# Built-in rule tables

The rule tables cellar knows without a `.rule` file, embedded into cellar at
build time and read by the table family's loader
(`src/rules/table/load.mach`) in Golly's RuleLoader format. A rule string
naming one of them, `WireWorld` or `Langtons-Loops`, runs it, unless a `.rule`
file of that name in the data directory or read earlier in the session comes
first (see `src/rules/table/store.mach`).

To add one, put its `.rule` file here and a row in `built_in_name` and
`built_in_text` in `src/rules/table/store.mach`. The tests read every built-in
table as the family's samples, so a malformed file fails the tests rather than
the app.

## Sources and licence

- `WireWorld.rule` is Brian Silverman's WireWorld (1987), whose rule is the
  four sentences in its header. The table, its variables and its colours were
  written for cellar from that description.
- `Langtons-Loops.rule` is Christopher Langton's self-reproducing loop, from
  C. G. Langton, "Self-reproduction in cellular automata", Physica D 10 (1984)
  135-144. Its 219 transitions are Langton's rule: a published fact about the
  automaton, the same list every implementation of the loop carries, and
  checked here against the list Golly ships. Nothing else is taken from any
  other file: the header, comments and colours were written for cellar.

Both files are part of cellar and distributed under its licence (`LICENSE`
at the repository root). No text of Golly's own rule files, which Golly
distributes under the GNU GPL, is included.
