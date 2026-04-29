#!/usr/bin/env bash
# Called by Claude Code after every Bash tool use (via .claude/settings.json).
# If the Bash command was a git commit, runs the test suite.

cmd=$(echo "$CLAUDE_TOOL_INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('command',''))" 2>/dev/null)

if echo "$cmd" | grep -qE "git[[:space:]]+commit"; then
    bash "$(dirname "$0")/run-tests.sh"
fi
