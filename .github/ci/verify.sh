#!/usr/bin/env bash
# a plain `mach build` picks the declared target that matches the host. with no
# match mach fell back to linux-x86_64 on an arm64 host (#23), so each linux leg
# builds with no flags from clean and runs what landed in its own target
set -euo pipefail

[ "$RUNNER_OS" = Linux ] || exit 0

"$MACH_COMPILER" clean .
"$MACH_COMPILER" build .
bin="out/$MACH_CI_TARGET/debug/bin/cellar"
[ -x "$bin" ] || {
  echo "::error::mach build with no flags did not build $MACH_CI_TARGET"
  ls out
  exit 1
}
"$bin" --version
echo "mach build with no flags built $MACH_CI_TARGET"
