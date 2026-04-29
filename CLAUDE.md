# Productivity Management — Project Standards

> Three non-negotiable rules: every prompt · every commit · every response.

---

## 1. Mini-Spec Before Any Code

> **No code until the user approves the spec.**

### Spec Template

```
## Spec: [Feature Name]

Assumptions
- ...

Inputs
| Name | Type | Required | Description |
|------|------|----------|-------------|
| ...  | ...  | yes / no | ...         |

Expected Output
...

Constraints & Security
- ...

Edge Cases
- ...

Out of Scope
- ...

✅ Approve to start building.
```

### Rules

1. Show spec → stop → wait for approval.
2. "Just build it" is not approval.
3. Wrong assumption? Revise the spec — never patch around it.
4. Out of Scope is mandatory — prevents scope creep.

### Example

|          | Approach                                                                         |
| -------- | -------------------------------------------------------------------------------- |
| **Bad**  | "I'll build JWT auth with refresh tokens, email verification, password reset..." |
| **Good** | Show spec below, wait for yes                                                    |

```
## Spec: User Login

Assumptions
- Users exist in DB · JWT in httpOnly cookie

Inputs
| Name     | Type   | Required |
|----------|--------|----------|
| email    | string | yes      |
| password | string | yes      |

Expected Output
- Success → { userId, role } + set cookie
- Failure → 401 "Invalid credentials"

Constraints & Security
- bcrypt.compare — never plain equality
- Rate limit: 5 attempts / 15 min / IP

Edge Cases
- Wrong email = wrong password = same 401 (no user enumeration)

Out of Scope
- Registration · password reset · OAuth

✅ Approve to start building.
```

---

## 2. Automated Tests on Every Commit

> Tests run automatically after every `git commit`.

**One-time setup:**

```bash
bash scripts/setup-hooks.sh
```

### How the scripts connect

```
git commit
  └── .git/hooks/post-commit      (installed by setup-hooks.sh)
        └── run-tests.sh          ← detects stack, runs tests

Claude runs git commit
  └── .claude/settings.json       (PostToolUse hook)
        └── claude-hook.sh        ← checks if it was a commit
              └── run-tests.sh    ← same script, same result
```

`run-tests.sh` is the only script that does real work — everything else just calls it.

### Supported stacks

| Stack    | Command         |
| -------- | --------------- |
| Node.js  | `npm test`      |
| Python   | `pytest`        |
| Go       | `go test ./...` |
| Rust     | `cargo test`    |
| Makefile | `make test`     |

If tests fail → fix before next commit. No skipping.

---

## 3. Credit Report — Every Response

> Every response ends with this block.

```
---
| Item              | Value                                          |
|-------------------|------------------------------------------------|
| Model             | claude-sonnet-4-6                              |
| Input tokens      | ~X,XXX                                         |
| Output tokens     | ~X,XXX                                         |
| Estimated cost    | ~$0.00XX                                       |
| Conversation size | small · medium · large · approaching limit     |
---
```

**Estimate:** 1 token ≈ 4 characters · `cost = (in × $0.000003) + (out × $0.000015)`

### Model Pricing

| Model             | Input / 1M | Output / 1M | Use when                      |
| ----------------- | ---------- | ----------- | ----------------------------- |
| Haiku 4.5         | $0.80      | $4.00       | Simple / repetitive tasks     |
| **Sonnet 4.6** ✅ | **$3.00**  | **$15.00**  | **Default — everyday coding** |
| Opus 4.7          | $15.00     | $75.00      | Deep reasoning only           |

### When to `/clear`

| Size              | Tokens  | Action     |
| ----------------- | ------- | ---------- |
| Small             | < 5K    | Continue   |
| Medium            | 5K–20K  | Continue   |
| Large             | 20K–80K | Clear soon |
| Approaching limit | > 80K   | Clear now  |

---

## Quick Reference

| Standard       | Rule                    |
| -------------- | ----------------------- |
| Before code    | Spec → approval → build |
| On commit      | Tests run automatically |
| Every response | End with Credit Report  |
