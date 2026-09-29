#!/usr/bin/env bash
# per-leg toolchains mach-glfw's C step needs: zig carries the windows sysroot
# and the mingw runtime, and a brewed glfw would shadow the vendored archive
set -euo pipefail

zig_version=0.16.0

case "${MACH_CI_LEG:-}" in
  x86_64-windows)
    name="zig-x86_64-windows-$zig_version"
    root="$RUNNER_TEMP/zig"
    mkdir -p "$root"
    curl -fsSL "https://ziglang.org/download/$zig_version/$name.zip" -o "$root/zig.zip"
    pwsh -NoProfile -Command "Expand-Archive -Path '$(cygpath -w "$root/zig.zip")' -DestinationPath '$(cygpath -w "$root")' -Force"
    cygpath -w "$root/$name" >> "$GITHUB_PATH"
    echo "zig $("$root/$name/zig.exe" version)"
    ;;
  x86_64-darwin|aarch64-darwin)
    if brew list --versions glfw >/dev/null 2>&1; then
      brew uninstall --ignore-dependencies glfw
    fi
    echo "no brewed glfw"
    ;;
esac
