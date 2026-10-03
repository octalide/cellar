# Test files

Files the tests load as an older cellar wrote them, kept so a change to how a
family stores its cells is held to loading them exactly.

- `reaction-0.8.0.cellar` and `reaction-0.8.0.rlw`: a reaction-diffusion world
  as 0.8.0 saved it, a world file of version 5 and an RLW file of version 1,
  each cell one value holding both fields. They were written by dev at
  138ecb8, the layout 0.8.0 released, from the world
  `persist.seed_legacy_reaction` makes, which the test that loads them makes
  again to compare against.
