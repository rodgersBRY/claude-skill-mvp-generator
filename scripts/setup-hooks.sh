#!/usr/bin/env bash
# Installs the post-commit git hook. Run once after cloning or first setup.

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK="$PROJECT_ROOT/.git/hooks/post-commit"

if [ ! -d "$PROJECT_ROOT/.git" ]; then
    echo "❌ No git repo found. Run: git init"
    exit 1
fi

# Write the hook file
cat > "$HOOK" << 'EOF'
#!/usr/bin/env bash
bash "$(git rev-parse --show-toplevel)/scripts/run-tests.sh"
EOF

chmod +x "$HOOK"
echo "✅ post-commit hook installed — tests will run on every commit."
echo "   To test manually: bash scripts/run-tests.sh"
