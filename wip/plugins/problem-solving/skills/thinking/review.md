---
description: Code review of selected code or last diff
argument-hint: [file-path]
---

# Code Review

## Target

- If argument provided: review `$ARGUMENTS`
- Otherwise: review last `git diff HEAD~1` or uncommitted modified files

## Review Checklist

### 1. Correctness
- [ ] Correct logic
- [ ] Edge cases handled
- [ ] No obvious bugs
- [ ] Expected behavior verified

### 2. Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No injection possible (SQL, XSS, command)
- [ ] Correct authentication/authorization

### 3. Performance
- [ ] Acceptable algorithmic complexity
- [ ] No N+1 queries
- [ ] Resources released (connections, files)
- [ ] No obvious memory leaks

### 4. Maintainability
- [ ] Code readable and understandable
- [ ] Clear and consistent naming
- [ ] DRY respected (no duplication)
- [ ] Well-separated responsibilities

### 5. Types
- [ ] Types/hints present and correct
- [ ] No unjustified `any`
- [ ] Well-defined interfaces

### 6. Tests
- [ ] Tests present if needed
- [ ] Critical cases covered
- [ ] Tests readable and maintainable

## Output Format

### Summary
[1-2 sentences on general code state]

### Issues Found

| Severity | File:Line | Issue | Suggestion |
|----------|-----------|-------|------------|
| HIGH | path:42 | description | proposed fix |
| MEDIUM | path:87 | description | proposed fix |
| LOW | path:123 | description | proposed fix |

### Positive Points
- [what's well done]

### Verdict
- [ ] **APPROVE** - Code ready to merge
- [ ] **REQUEST CHANGES** - Corrections required before merge
- [ ] **NEEDS DISCUSSION** - Questions to clarify

## Rules

- Always read the code before commenting
- Prioritize issues by impact
- Propose solutions, not just criticisms
- Be constructive and factual