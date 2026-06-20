# Contributing to Copperline AI

> AI-forward software consulting — agent-driven development with human oversight.

This guide covers the standard engineering workflow for all Copperline AI projects. Every feature, fix, or change flows through four stages: **Plan → Build → Review → Approve**.

For the full dev process, see the [Dev Process Plan](/COP/issues/COP-46#document-plan).

---

## Branch Conventions

- **Branch from `main`** (or the project's default branch).
- **Name:** `{issue-identifier}/short-description` (e.g. `COP-47/add-login-page`).
- **One issue per branch.** Keep branches focused and scoped to a single change.

| Rule | Example |
|---|---|
| Correct | `COP-47/add-login-page` |
| Correct | `COP-48/fix-race-condition` |
| Wrong | `add-login-page` (missing issue identifier) |
| Wrong | `COP-47/login-and-profile` (too broad — split into two issues) |

---

## Commit Conventions

- **Keep commits atomic** — one logical change per commit.
- **Write descriptive messages** explaining _what_ and _why_.
- **Include the Paperclip co-author trailer** on every commit:

```
Co-Authored-By: Paperclip <noreply@paperclip.ing>
```

---

## Pull Request Conventions

### Title

```
{issue-identifier}: Short description
```

Examples:

- `COP-47: Add login page`
- `COP-52: Fix race condition in user cache`

### Body

Every PR body must include:

1. **Link to the issue** (Paperclip issue URL).
2. **Summary of changes** — what was done and why.
3. **Test plan** — how the changes were verified.
4. **Reviewer** — `@` the CTO for review.

Template:

```markdown
## Summary

Brief description of what changed.

## Changes

- Bullet list of key changes

## Test Plan

- [ ] Ran existing test suite — all passing
- [ ] Added tests for new behavior
- [ ] Manual verification steps (if applicable)

## Related

- Issue: [COP-XX](https://github.com/copperline-ai/REPO/issues/XX)
```

### Review

- Request review from the CTO.
- Address all review feedback before merging.
- Only the CTO merges PRs.

---

## Development Workflow

### Stage 1: Plan

The CTO produces a brief plan on the issue before any code is written. The plan covers:

- What changes and why
- Which project/repo is affected
- High-level approach
- Acceptance criteria
- Architectural decisions or trade-offs

**When a plan is NOT needed:**
- Trivial typo fixes
- Config changes with no behavioral impact
- Dependency bumps that pass CI

### Stage 2: Build

The [Founding Engineer](https://github.com/copperline-ai) implements the plan:

1. Create a branch following the [branch conventions](#branch-conventions).
2. Implement the changes, following existing code style.
3. Write tests for new behavior.
4. Run existing tests — do not break CI.
5. Open a PR following the [PR conventions](#pull-request-conventions).

### Stage 3: Review

The CTO reviews the PR against the plan and acceptance criteria.

**Review checklist:**
- [ ] Does the implementation match the plan?
- [ ] Are acceptance criteria met?
- [ ] Is there test coverage for new behavior?
- [ ] Does it follow project conventions?
- [ ] Are there security concerns? (escalate to Security Engineer if needed)
- [ ] Is the PR description clear?

Outcomes:

- **Approved** → merged and sent for board approval.
- **Changes requested** → return to Stage 2.

### Stage 4: Approve

The board gives final sign-off. Once approved, the issue is closed.

---

## Issue Lifecycle

```
backlog → todo → in_progress → in_review → done
            ↑         ↑            ↓
            └─────────┴── blocked ─┘
```

---

## Exception Paths

- **Urgent hotfix:** Skip the formal plan; CTO gives a one-line directive. PR still required.
- **Research/spike:** No PR needed. Issue documents findings. CTO decides next step.
- **Cross-team work:** CTO coordinates. If the Founding Engineer is at capacity, escalate to CEO for staffing.

---

## Getting Started

1. Find an issue assigned to you in [Paperclip](/COP).
2. Clone the target repository.
3. Create a branch following the [branch conventions](#branch-conventions).
4. Implement and open a PR.
5. Request review and iterate.

---

## Tooling

- **Issue tracking:** Paperclip
- **Code hosting:** GitHub (repos under [copperline-ai](https://github.com/copperline-ai))
- **CI/CD:** Per-project — check the project README.
- **Secrets:** Infisical vault
