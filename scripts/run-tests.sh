#!/usr/bin/env bash
# Auto-detects the project stack and runs its test command.
# Triggered automatically after every git commit.

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

echo ""
echo "── Tests $(date '+%H:%M:%S') ──────────────────"

if [ -f package.json ] && grep -q '"test"' package.json; then
    npm test

elif [ -f pytest.ini ] || [ -f pyproject.toml ] || [ -f setup.py ]; then
    python -m pytest -v

elif [ -f go.mod ]; then
    go test ./...

elif [ -f Cargo.toml ]; then
    cargo test

elif [ -f Makefile ] && grep -q "^test:" Makefile; then
    make test

else
    echo "⚠  No test suite found."
    echo "   Add tests for your stack — this will pick them up automatically."
fi

echo "────────────────────────────────────────"
echo ""
