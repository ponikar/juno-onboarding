#!/bin/bash
# Static web build for EAS Hosting. Images exist only as name@3x.png; the web bundle asks for name.png,
# so each @3x file is copied to its plain name in the export.
set -e
cd "$(dirname "$0")/.."
rm -rf dist
bunx expo export --platform web --output-dir dist
find dist/assets -name "*@3x.png" | while read -r f; do cp "$f" "${f%@3x.png}.png"; done
